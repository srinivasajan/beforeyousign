/**
 * Export Manager - Unified Export Interface
 * 
 * Consolidates functionality from:
 * - export-utils.ts (basic exports)
 * - advanced-export-integrations.ts (advanced exports & integrations)
 * 
 * Provides single, consistent API for all export operations
 */

import { exportAsPDF as basicPDF, exportAsDOCX as basicDOCX, exportAsMarkdown as basicMarkdown } from './export-utils';
import { AdvancedExporter } from './advanced-export-integrations';
import type { ExportOptions } from './template-types';

export class ExportManager {
  private advancedExporter = new AdvancedExporter();

  /**
   * Unified export function
   * Automatically selects basic or advanced exporter based on options
   */
  async export(content: string, options: Partial<ExportOptions> = {}): Promise<Buffer | string> {
    const format = options.format || 'pdf';
    
    // Use advanced exporter if any advanced options are specified
    const useAdvanced = Boolean(
      options.styling ||
      options.branding ||
      options.output?.destination !== 'download' ||
      format === 'latex' ||
      format === 'epub'
    );

    if (useAdvanced) {
      return this.advancedExporter.export(content, {
        format,
        ...options,
      } as ExportOptions);
    } else {
      // Use simple exporters for basic cases
      return this.basicExport(content, format);
    }
  }

  /**
   * Basic export using legacy utilities
   * Fast and simple, no external dependencies
   */
  private async basicExport(content: string, format: string): Promise<Buffer | string> {
    switch (format) {
      case 'pdf':
        return basicPDF(content);
      case 'docx':
        return basicDOCX(content);
      case 'markdown':
        return basicMarkdown(content);
      case 'html':
        return this.convertToHTML(content);
      case 'plain-text':
        return content;
      default:
        throw new Error(`Unsupported basic export format: ${format}. Use advanced exporter.`);
    }
  }

  /**
   * Convert markdown content to HTML
   */
  private convertToHTML(content: string): string {
    // Simple markdown to HTML conversion
    return content
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>');
  }

  /**
   * Export to PDF with advanced options
   */
  async exportToPDF(content: string, options: Partial<ExportOptions> = {}): Promise<Buffer> {
    return this.export(content, { ...options, format: 'pdf' }) as Promise<Buffer>;
  }

  /**
   * Export to DOCX with advanced options
   */
  async exportToDOCX(content: string, options: Partial<ExportOptions> = {}): Promise<Buffer> {
    return this.export(content, { ...options, format: 'docx' }) as Promise<Buffer>;
  }

  /**
   * Export to HTML
   */
  async exportToHTML(content: string, options: Partial<ExportOptions> = {}): Promise<string> {
    return this.export(content, { ...options, format: 'html' }) as Promise<string>;
  }

  /**
   * Export to Markdown
   */
  async exportToMarkdown(content: string, options: Partial<ExportOptions> = {}): Promise<string> {
    return this.export(content, { ...options, format: 'markdown' }) as Promise<string>;
  }

  /**
   * Send document for e-signature
   */
  async sendForSignature(content: string, signers: any[], provider: 'docusign' | 'adobe-sign' | 'hellosign' | 'pandadoc' = 'docusign'): Promise<any> {
    return this.advancedExporter.sendForSignature({
      provider,
      document: {
        name: 'Contract for Signature',
        content,
        format: 'pdf',
      },
      signers,
    });
  }

  /**
   * Upload to cloud storage
   */
  async uploadToCloud(content: string, provider: 'google-drive' | 'dropbox' | 'onedrive' | 's3' | 'box', filename: string): Promise<any> {
    const pdfContent = await this.exportToPDF(content);
    return this.advancedExporter.uploadToCloud({
      provider,
      action: 'upload',
      file: {
        name: filename,
        content: pdfContent,
        mimeType: 'application/pdf',
      },
    });
  }

  /**
   * Integrate with CRM
   */
  async integrateCRM(content: string, provider: 'salesforce' | 'hubspot' | 'pipedrive' | 'zoho', dealData: any): Promise<any> {
    const pdfContent = await this.exportToPDF(content);
    return this.advancedExporter.integrateCRM({
      provider,
      action: 'attach-document',
      document: {
        name: `Contract_${Date.now()}.pdf`,
        content: pdfContent,
      },
      deal: dealData,
    });
  }

  /**
   * Bulk export multiple templates
   */
  async bulkExport(templates: Array<{ templateId: string; variables: Record<string, any>; outputName: string }>, format: string, destination: any): Promise<any> {
    return this.advancedExporter.bulkExport({
      id: `bulk-${Date.now()}`,
      name: `Bulk Export ${new Date().toISOString()}`,
      templates,
      format,
      options: { format } as ExportOptions,
      destination,
      status: 'pending',
      progress: {
        total: templates.length,
        completed: 0,
        failed: 0,
      },
      createdAt: new Date(),
    });
  }
}

// Singleton instance
export const exportManager = new ExportManager();

// Re-export legacy functions for backward compatibility
export const exportAsPDF = (content: string) => exportManager.exportToPDF(content);
export const exportAsDOCX = (content: string) => exportManager.exportToDOCX(content);
export const exportAsHTML = (content: string) => exportManager.exportToHTML(content);
export const exportAsMarkdown = (content: string) => exportManager.exportToMarkdown(content);
