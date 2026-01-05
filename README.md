# BeforeYouSign

> **AI-Powered Contract Intelligence — Protect Your Interests Before You Sign**

BeforeYouSign is an enterprise-grade contract analysis platform that uses advanced AI to identify risks, decode legal jargon, and provide actionable negotiation strategies. Built for freelancers, small businesses, and individuals who need professional-level contract review without the lawyer fees.

## 🎯 Why BeforeYouSign?

Every day, people sign contracts they don't fully understand because hiring a lawyer is too expensive. A single overlooked clause can:
- Transfer your intellectual property rights
- Impose unlimited liability
- Lock you into auto-renewals
- Restrict your ability to terminate
- Expose you to hidden penalties

**BeforeYouSign levels the playing field** by giving you institutional-grade contract analysis powered by AI.

## ✨ Features

### Core Analysis
- **AI-Powered Review**: Google Gemini 2.5 Flash analyzes every clause
- **Risk Scoring**: 0-100 risk assessment with detailed breakdown
- **Red Flag Detection**: 12+ dangerous clause types automatically identified
- **Plain Language**: Complex legal jargon translated to simple English
- **Actionable Recommendations**: Specific negotiation points for each risk

### Interactive Tools
- **AI Chat Assistant** (Ctrl+M): Ask questions about any contract clause
- **Interactive Contract Map** (Ctrl+K): Visual navigation through document
- **Shareable Links**: Generate secure analysis links for lawyers/advisors
- **Clause Bookmarking**: Save important clauses with personal notes
- **Version Comparison**: Side-by-side contract comparison tool

### Negotiation Support
- **Email Templates**: Professional negotiation scripts for each risky clause
- **Talking Points**: Strategic conversation guides
- **Full Playbook**: Comprehensive negotiation strategy for entire contract
- **Export Options**: PDF, JSON, Markdown export for all analyses

### Professional Services
- **Lawyer Marketplace**: Find vetted attorneys by specialty and location
- **Template Library**: Balanced contract templates for common scenarios
- **Team Collaboration**: Comments, mentions, and real-time collaboration
- **E-Signature**: Built-in signing workflow (requires backend)

### Technical Excellence
- **Multi-Format Support**: PDF, DOCX, TXT file upload
- **Mobile Responsive**: Full functionality on all devices
- **Keyboard Navigation**: Complete keyboard shortcut support
- **WCAG 2.1 AA**: Accessibility compliant
- **Loading States**: Professional skeleton screens
- **Error Handling**: Graceful error boundaries and recovery

## 🚀 Quick Start

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/beforeyousign.git
   cd beforeyousign
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   ```

4. **Get your free Gemini API key** from [Google AI Studio](https://aistudio.google.com/app/apikey)

5. **Add your Gemini API key** to `.env.local`:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

6. **Run the development server**:
   ```bash
   npm run dev
   ```

7. **Open your browser** to `http://localhost:3000`

## 🔧 Configuration

Edit `.env.local` to customize:

```env
# Google Gemini API Configuration (free tier available)
GEMINI_API_KEY=your_gemini_api_key_here

# Application Configuration
NEXT_PUBLIC_APP_NAME=BeforeYouSign
NEXT_PUBLIC_MAX_FILE_SIZE=10485760  # 10MB default
```

## 📖 Usage

### Basic Workflow
1. **Upload a contract**: Drag and drop or click to upload PDF, DOCX, or TXT files
2. **Wait for analysis**: The AI will analyze the contract (typically 30-60 seconds)
3. **Review results**: 
   - Check the overall risk score
   - Review red flags and warnings
   - Read clause-by-clause plain language explanations
   - Get specific recommendations
4. **Export**: Print or save the analysis for your records

### Advanced Features

#### 🔗 Share Analysis
1. Click **"Share"** button in the header
2. Optional: Set password protection
3. Choose expiration period (1-30 days)
4. Click **"Generate Share Link"**
5. Copy and share with lawyers, advisors, or colleagues

#### ⌨️ Keyboard Shortcuts
- `Ctrl+K` - Open Contract Map (visual navigation)
- `Ctrl+M` - Toggle AI Chat Assistant
- `Esc` - Close any open modal/sidebar
- `Ctrl+/` - Show all keyboard shortcuts
- `1` / `2` - Switch between Quick View and Deep Dive
- `3` / `4` / `5` - Filter risk levels

#### 💬 AI Chat Assistant
- Click the purple chat bubble (or press `Ctrl+M`)
- Ask questions like:
  - "What are my biggest risks?"
  - "Explain the termination clause"
  - "Can I modify section 5?"
  - "What should I negotiate?"

#### 🗺️ Contract Map
- Click the sparkle icon (or press `Ctrl+K`)
- See all clauses organized by section
- Click any clause to jump directly to it
- Color-coded by risk level (Critical/High/Medium/Low)

## 🏗️ Project Structure

```
beforeyousign/
├── app/
│   ├── api/
│   │   ├── analyze/
│   │   │   └── route.ts          # API endpoint for contract analysis
│   │   ├── chat/
│   │   │   └── route.ts          # AI chat assistant endpoint
│   │   └── share/
│   │       ├── route.ts          # Create shareable links
│   │       └── [shareId]/
│   │           └── route.ts      # Retrieve shared analysis
│   ├── share/
│   │   └── [shareId]/
│   │       └── page.tsx          # Public share page
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main page
├── components/
│   ├── FileUpload.tsx            # Drag-and-drop file upload component
│   └── AnalysisResult.tsx        # Contract analysis results display
├── lib/
│   ├── types.ts                  # TypeScript type definitions
│   ├── document-parser.ts        # Document parsing utilities
│   ├── contract-analyzer.ts      # AI-powered contract analysis
│   ├── share-links.ts            # Shareable links utilities
│   └── keyboard-shortcuts.ts     # Keyboard shortcuts hook
```

## 📚 Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Technical architecture and system design
- [PRODUCTION-READY.md](./PRODUCTION-READY.md) - Deployment checklist and integration needs
- [QUICKSTART.md](./QUICKSTART.md) - Quick start guide for developers
- [ROADMAP.md](./ROADMAP.md) - Feature roadmap and future plans

## 🧪 Sample Contracts

The `public/` folder includes sample contracts for testing:
- **sample-employment-predatory.txt** - Employment agreement with red flags
- **sample-freelance-balanced.txt** - Balanced freelance contract
- **sample-lease-aggressive.txt** - Rental agreement with landlord-favoring terms
- **sample-saas-unfair.txt** - SaaS agreement with problematic clauses

## ⚖️ Legal Disclaimer

**BeforeYouSign is an AI tool for educational purposes. It does NOT provide legal advice.** 

Always consult a licensed attorney for legal matters. The AI analysis may not catch all risks or nuances. Use as a starting point, not a substitute for professional legal counsel.

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create feature branch (`git checkout -b feature/Feature`)
3. Commit changes (`git commit -m 'Add Feature'`)
4. Push to branch (`git push origin feature/Feature`)
5. Open Pull Request

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Google Gemini](https://ai.google.dev/) - AI model
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Lucide](https://lucide.dev/) - Icons

---

**Leveling the playing field in contract negotiations — one clause at a time.**
```
