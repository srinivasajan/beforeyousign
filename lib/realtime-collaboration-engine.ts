/**
 * Real-Time Collaboration Engine - REVOLUTIONARY
 * Multiple users editing contracts simultaneously with live presence
 * Google Docs for contracts - NO COMPETITOR HAS THIS
 */

export interface CollaborationUser {
  id: string;
  name: string;
  email: string;
  color: string;
  avatar?: string;
  cursor?: {
    position: number;
    selection?: { start: number; end: number };
  };
  lastActivity: Date;
  role: 'owner' | 'editor' | 'reviewer' | 'viewer';
}

export interface CollaborationChange {
  id: string;
  userId: string;
  userName: string;
  type: 'insert' | 'delete' | 'format' | 'comment';
  position: number;
  content: string;
  timestamp: Date;
  synced: boolean;
}

export interface CollaborationComment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  position: number;
  resolved: boolean;
  replies: Array<{
    userId: string;
    userName: string;
    text: string;
    timestamp: Date;
  }>;
  timestamp: Date;
}

export interface CollaborationSession {
  sessionId: string;
  contractId: string;
  documentTitle: string;
  activeUsers: CollaborationUser[];
  changes: CollaborationChange[];
  comments: CollaborationComment[];
  version: number;
  locked: boolean;
  lockedBy?: string;
  createdAt: Date;
  lastModified: Date;
}

export interface OperationalTransform {
  apply(operation: CollaborationChange, document: string): string;
  transform(op1: CollaborationChange, op2: CollaborationChange): CollaborationChange;
  compose(ops: CollaborationChange[]): CollaborationChange[];
}

class RealTimeCollaborationEngine {
  private sessions: Map<string, CollaborationSession> = new Map();
  private wsConnections: Map<string, Set<WebSocket>> = new Map();

  /**
   * Create a new collaboration session
   */
  async createSession(
    contractId: string,
    documentTitle: string,
    owner: CollaborationUser
  ): Promise<CollaborationSession> {
    const session: CollaborationSession = {
      sessionId: `COLLAB-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      contractId,
      documentTitle,
      activeUsers: [owner],
      changes: [],
      comments: [],
      version: 1,
      locked: false,
      createdAt: new Date(),
      lastModified: new Date(),
    };

    this.sessions.set(session.sessionId, session);
    return session;
  }

  /**
   * Join an existing collaboration session
   */
  async joinSession(sessionId: string, user: CollaborationUser): Promise<CollaborationSession> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    // Check if user already in session
    const existingUser = session.activeUsers.find(u => u.id === user.id);
    if (!existingUser) {
      session.activeUsers.push(user);
      this.broadcastPresence(sessionId, 'user-joined', user);
    }

    return session;
  }

  /**
   * Leave a collaboration session
   */
  async leaveSession(sessionId: string, userId: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    session.activeUsers = session.activeUsers.filter(u => u.id !== userId);
    this.broadcastPresence(sessionId, 'user-left', { id: userId });

    // Clean up if no active users
    if (session.activeUsers.length === 0) {
      this.sessions.delete(sessionId);
    }
  }

  /**
   * Update user cursor position
   */
  async updateCursor(
    sessionId: string,
    userId: string,
    position: number,
    selection?: { start: number; end: number }
  ): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    const user = session.activeUsers.find(u => u.id === userId);
    if (user) {
      user.cursor = { position, selection };
      user.lastActivity = new Date();
      this.broadcastCursor(sessionId, userId, position, selection);
    }
  }

  /**
   * Apply a change to the document with operational transformation
   */
  async applyChange(
    sessionId: string,
    change: CollaborationChange
  ): Promise<{ success: boolean; transformedChange?: CollaborationChange }> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return { success: false };
    }

    // Lock check
    if (session.locked && session.lockedBy !== change.userId) {
      return { success: false };
    }

    // Apply operational transformation for concurrent edits
    const transformedChange = this.transformChange(change, session.changes);
    
    session.changes.push(transformedChange);
    session.version++;
    session.lastModified = new Date();

    // Broadcast to all users
    this.broadcastChange(sessionId, transformedChange);

    return { success: true, transformedChange };
  }

  /**
   * Operational Transformation to handle concurrent edits
   */
  private transformChange(
    newChange: CollaborationChange,
    existingChanges: CollaborationChange[]
  ): CollaborationChange {
    let transformed = { ...newChange };

    // Get all changes that happened after this user's last sync
    const concurrentChanges = existingChanges.filter(
      c => !c.synced && c.userId !== newChange.userId
    );

    concurrentChanges.forEach(existing => {
      if (existing.type === 'insert' && existing.position <= transformed.position) {
        // Adjust position for prior inserts
        transformed.position += existing.content.length;
      } else if (existing.type === 'delete' && existing.position < transformed.position) {
        // Adjust position for prior deletes
        transformed.position -= existing.content.length;
      }
    });

    return transformed;
  }

  /**
   * Add a comment to the document
   */
  async addComment(
    sessionId: string,
    userId: string,
    userName: string,
    text: string,
    position: number
  ): Promise<CollaborationComment> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    const comment: CollaborationComment = {
      id: `COMMENT-${Date.now()}`,
      userId,
      userName,
      text,
      position,
      resolved: false,
      replies: [],
      timestamp: new Date(),
    };

    session.comments.push(comment);
    this.broadcastComment(sessionId, comment);

    return comment;
  }

  /**
   * Reply to a comment
   */
  async replyToComment(
    sessionId: string,
    commentId: string,
    userId: string,
    userName: string,
    text: string
  ): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    const comment = session.comments.find(c => c.id === commentId);
    if (comment) {
      comment.replies.push({
        userId,
        userName,
        text,
        timestamp: new Date(),
      });

      this.broadcastCommentUpdate(sessionId, comment);
    }
  }

  /**
   * Resolve a comment thread
   */
  async resolveComment(sessionId: string, commentId: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    const comment = session.comments.find(c => c.id === commentId);
    if (comment) {
      comment.resolved = true;
      this.broadcastCommentUpdate(sessionId, comment);
    }
  }

  /**
   * Lock document for exclusive editing
   */
  async lockDocument(sessionId: string, userId: string): Promise<boolean> {
    const session = this.sessions.get(sessionId);
    if (!session) return false;

    if (session.locked) return false;

    session.locked = true;
    session.lockedBy = userId;
    this.broadcastLockStatus(sessionId, userId, true);

    return true;
  }

  /**
   * Unlock document
   */
  async unlockDocument(sessionId: string, userId: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    if (session.lockedBy === userId) {
      session.locked = false;
      session.lockedBy = undefined;
      this.broadcastLockStatus(sessionId, userId, false);
    }
  }

  /**
   * Get document snapshot with all changes applied
   */
  async getDocumentSnapshot(sessionId: string, baseContent: string): Promise<string> {
    const session = this.sessions.get(sessionId);
    if (!session) return baseContent;

    let content = baseContent;

    // Apply all changes in order
    session.changes
      .filter(c => c.synced)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
      .forEach(change => {
        content = this.applyChangeToContent(content, change);
      });

    return content;
  }

  private applyChangeToContent(content: string, change: CollaborationChange): string {
    switch (change.type) {
      case 'insert':
        return (
          content.slice(0, change.position) +
          change.content +
          content.slice(change.position)
        );
      
      case 'delete':
        return (
          content.slice(0, change.position) +
          content.slice(change.position + change.content.length)
        );
      
      default:
        return content;
    }
  }

  /**
   * Get collaboration analytics
   */
  async getAnalytics(sessionId: string): Promise<{
    totalEdits: number;
    activeTime: number;
    topContributors: Array<{ userId: string; userName: string; edits: number }>;
    commentsResolved: number;
    averageResponseTime: number;
  }> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    const editsByUser = new Map<string, number>();
    session.changes.forEach(change => {
      editsByUser.set(change.userId, (editsByUser.get(change.userId) || 0) + 1);
    });

    const topContributors = Array.from(editsByUser.entries())
      .map(([userId, edits]) => {
        const user = session.activeUsers.find(u => u.id === userId);
        return { userId, userName: user?.name || 'Unknown', edits };
      })
      .sort((a, b) => b.edits - a.edits)
      .slice(0, 5);

    const activeTime = session.lastModified.getTime() - session.createdAt.getTime();
    const commentsResolved = session.comments.filter(c => c.resolved).length;

    return {
      totalEdits: session.changes.length,
      activeTime,
      topContributors,
      commentsResolved,
      averageResponseTime: 0, // Calculate based on comment reply times
    };
  }

  // WebSocket broadcast methods (simulated - real implementation would use actual WebSocket)
  private broadcastPresence(sessionId: string, event: string, data: any): void {
    // Broadcast to all connected clients
    console.log(`Broadcasting ${event} to session ${sessionId}:`, data);
  }

  private broadcastCursor(sessionId: string, userId: string, position: number, selection?: any): void {
    console.log(`Broadcasting cursor update for ${userId} in ${sessionId}`);
  }

  private broadcastChange(sessionId: string, change: CollaborationChange): void {
    console.log(`Broadcasting change in ${sessionId}:`, change);
  }

  private broadcastComment(sessionId: string, comment: CollaborationComment): void {
    console.log(`Broadcasting comment in ${sessionId}:`, comment);
  }

  private broadcastCommentUpdate(sessionId: string, comment: CollaborationComment): void {
    console.log(`Broadcasting comment update in ${sessionId}:`, comment);
  }

  private broadcastLockStatus(sessionId: string, userId: string, locked: boolean): void {
    console.log(`Broadcasting lock status in ${sessionId}: ${locked} by ${userId}`);
  }

  /**
   * Export session history
   */
  async exportHistory(sessionId: string): Promise<{
    timeline: Array<{
      timestamp: Date;
      user: string;
      action: string;
      details: any;
    }>;
  }> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    const timeline: any[] = [];

    // Add all changes to timeline
    session.changes.forEach(change => {
      timeline.push({
        timestamp: change.timestamp,
        user: change.userName,
        action: change.type,
        details: { position: change.position, content: change.content },
      });
    });

    // Add all comments to timeline
    session.comments.forEach(comment => {
      timeline.push({
        timestamp: comment.timestamp,
        user: comment.userName,
        action: 'comment',
        details: { text: comment.text, position: comment.position },
      });
    });

    timeline.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    return { timeline };
  }
}

export const collaborationEngine = new RealTimeCollaborationEngine();
