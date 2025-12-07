# Architecture Documentation

## System Overview

BeforeYouSign is a full-stack web application built with Next.js 14 that uses AI (GPT-4) to analyze legal contracts and provide plain-language explanations to help users understand risks before signing.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Client                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Next.js Frontend (React + TypeScript)               │   │
│  │  - FileUpload Component (Drag & Drop)                │   │
│  │  - AnalysisResult Component (Risk Display)           │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                           ↓ HTTP POST
┌─────────────────────────────────────────────────────────────┐
│                    Next.js Server                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  API Routes (/api/analyze)                           │   │
│  │  - File validation                                   │   │
│  │  - Document parsing orchestration                    │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↓                                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Document Parser Library                             │   │
│  │  - PDF Parser (pdf-parse)                            │   │
│  │  - DOCX Parser (mammoth)                             │   │
│  │  - TXT Parser (native)                               │   │
│  └──────────────────────────────────────────────────────┘   │
│                           ↓                                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Contract Analyzer                                   │   │
│  │  - Prompt engineering                                │   │
│  │  - Response formatting                               │   │
│  │  - Risk scoring logic                                │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                           ↓ API Call
┌─────────────────────────────────────────────────────────────┐
│                    OpenAI API                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  GPT-4 Turbo                                         │   │
│  │  - Contract analysis                                 │   │
│  │  - Risk identification                               │   │
│  │  - Plain language translation                        │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: lucide-react
- **File Upload**: react-dropzone
- **Rendering**: Client-side (marked with 'use client')

### Backend
- **Runtime**: Node.js (Next.js API Routes)
- **API Framework**: Next.js Route Handlers
- **File Processing**:
  - `pdf-parse`: PDF text extraction
  - `mammoth`: DOCX text extraction
  - Native Buffer API: TXT parsing

### AI/ML
- **Provider**: OpenAI
- **Model**: GPT-4 Turbo Preview
- **Library**: openai (official SDK)
- **Strategy**: Single-shot analysis with structured JSON output

## Data Flow

### 1. File Upload Flow

```
User uploads file
    ↓
FileUpload component validates client-side
    ↓
File sent to /api/analyze via FormData
    ↓
Server validates file type and size
    ↓
DocumentParser.parse() extracts text
    ↓
Text validated for minimum length
    ↓
ContractAnalyzer.analyze() processes text
```

### 2. AI Analysis Flow

```
Contract text input
    ↓
Build comprehensive analysis prompt
    ↓
Call OpenAI API with structured output format
    ↓
Parse JSON response
    ↓
Format into ContractAnalysis type
    ↓
Return to client
    ↓
AnalysisResult component renders
```

## Core Components

### 1. DocumentParser (`lib/document-parser.ts`)

**Purpose**: Extract text from various document formats

**Key Methods**:
- `parse(file: File): Promise<string>` - Main entry point
- `parsePDF(buffer: Buffer): Promise<string>` - PDF handling
- `parseDOCX(buffer: Buffer): Promise<string>` - DOCX handling
- `parseTXT(buffer: Buffer): Promise<string>` - TXT handling
- `validateFileSize(file: File, maxSize: number): boolean`
- `validateFileType(file: File): boolean`

**Supported Formats**:
- PDF (via pdf-parse)
- DOCX (via mammoth)
- DOC (via mammoth, limited support)
- TXT (native)

### 2. ContractAnalyzer (`lib/contract-analyzer.ts`)

**Purpose**: AI-powered contract analysis

**Key Methods**:
- `analyze(text: string, fileName: string, fileSize: number): Promise<ContractAnalysis>`
- `buildAnalysisPrompt(text: string): string` - Prompt engineering
- `formatAnalysis(data: any, ...): ContractAnalysis` - Response formatting

**Analysis Output**:
- Overall risk score (0-100)
- Clause-by-clause breakdown
- Red flag identification
- Plain language explanations
- Actionable recommendations

### 3. FileUpload Component (`components/FileUpload.tsx`)

**Purpose**: User interface for file uploads

**Features**:
- Drag-and-drop support
- Click-to-browse
- File type validation
- Size validation
- Visual feedback
- Error handling

### 4. AnalysisResult Component (`components/AnalysisResult.tsx`)

**Purpose**: Display analysis results

**Features**:
- Risk score visualization
- Red flag alerts
- Clause-by-clause display
- Plain language translations
- Export functionality
- Print-friendly layout

## Type System

### Core Types (`lib/types.ts`)

```typescript
ContractAnalysis {
  summary: string
  riskScore: number (0-100)
  clauses: ClauseAnalysis[]
  redFlags: RedFlag[]
  recommendations: string[]
  metadata: ContractMetadata
}

ClauseAnalysis {
  id: string
  title: string
  originalText: string
  plainLanguage: string
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  category: ClauseCategory
  concerns: string[]
  position: { start: number, end: number }
}

RedFlag {
  id: string
  type: RedFlagType
  severity: 'warning' | 'danger' | 'critical'
  title: string
  description: string
  affectedClauses: string[]
  recommendation: string
}
```

## API Endpoints

### POST /api/analyze

**Purpose**: Analyze uploaded contract

**Request**:
- Method: POST
- Content-Type: multipart/form-data
- Body: FormData with 'file' field

**Response**:
```typescript
{
  success: boolean
  analysis?: ContractAnalysis
  error?: string
}
```

**Status Codes**:
- 200: Success
- 400: Invalid file or validation error
- 500: Server or AI processing error

**Timeout**: 60 seconds

## AI Prompt Engineering

### System Prompt

The system prompt establishes the AI's role as an expert contract lawyer focused on protecting the weaker party's interests.

### User Prompt Structure

1. **Context**: Contract text
2. **Task**: Comprehensive risk assessment
3. **Output Format**: Structured JSON with specific fields
4. **Focus Areas**:
   - IP transfers
   - Liability clauses
   - Auto-renewals
   - Termination restrictions
   - Indemnification
   - Non-compete clauses
   - Payment terms
   - Dispute resolution

### Response Format

The AI is instructed to return JSON with:
- Executive summary
- Risk score calculation
- Detailed clause analysis
- Red flag identification
- Actionable recommendations
- Metadata extraction

## Security Considerations

### Input Validation
- File type whitelist (PDF, DOCX, TXT only)
- File size limit (10MB default, configurable)
- Text length validation (minimum 100 characters)

### API Security
- OpenAI API key stored in environment variables
- No client-side exposure of sensitive keys
- Rate limiting (handled by Vercel by default)

### Data Privacy
- No contract storage or logging
- Ephemeral processing only
- No user tracking or analytics

## Performance Optimization

### Client-Side
- Lazy loading of components
- Optimized image assets (Next.js Image component)
- Tailwind CSS purging for minimal bundle size

### Server-Side
- Edge runtime compatible (can be deployed to edge)
- Streaming responses (future enhancement)
- Caching opportunities (future enhancement)

### AI Processing
- Single API call per analysis
- Structured output reduces parsing overhead
- Temperature set to 0.3 for consistency

## Error Handling

### Client-Side Errors
- File validation errors (type, size)
- Network errors
- Timeout errors

### Server-Side Errors
- Document parsing failures
- AI API failures
- Timeout handling (60s limit)

### User Feedback
- Clear error messages
- Retry mechanisms
- Loading states

## Deployment

### Vercel (Recommended)
- Zero-config deployment
- Automatic HTTPS
- Edge network CDN
- Environment variable management
- Serverless functions for API routes

### Environment Variables
- `OPENAI_API_KEY`: Required
- `NEXT_PUBLIC_MAX_FILE_SIZE`: Optional (default 10MB)
- `NEXT_PUBLIC_APP_NAME`: Optional (default "BeforeYouSign")

## Scalability Considerations

### Current Limitations
- Synchronous processing (60s timeout)
- No contract storage
- No user sessions
- Single AI model

### Future Enhancements
- Async processing with job queue
- Database for contract history
- User authentication
- Multiple AI models (fallbacks)
- Caching layer for common clauses
- Batch processing API

## Cost Analysis

### Per-Contract Costs
- GPT-4 Turbo: ~$0.01-0.05 per analysis
- Vercel hosting: Free tier available
- Document processing: Negligible

### Optimization Strategies
- Cache common clause explanations
- Use GPT-3.5 for initial screening
- Batch processing for enterprise users
- Tiered pricing model

## Testing Strategy

### Unit Tests (Future)
- Document parser functions
- Type validation
- Prompt building logic

### Integration Tests (Future)
- API endpoint testing
- End-to-end file upload flow
- AI response parsing

### Manual Testing
- Sample contracts in `/public/sample-contract.txt`
- Various file formats
- Edge cases (very large/small files)

## Monitoring & Analytics

### Current State
- No monitoring (MVP)
- Console logging only

### Recommended Tools
- Vercel Analytics
- Sentry for error tracking
- OpenAI usage dashboard
- Custom analytics (PostHog, Plausible)

## Maintenance

### Dependency Updates
- Regular npm audit
- Next.js version tracking
- OpenAI SDK updates

### AI Model Updates
- Monitor OpenAI model releases
- Test new models for quality
- Update prompts as needed

## Contributing

See `README.md` for contribution guidelines.

---

**Document Version**: 1.0
**Last Updated**: December 2025
