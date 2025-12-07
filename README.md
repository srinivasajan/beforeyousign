# BeforeYouSign

> **Democratizing legal comprehension — one contract at a time.**

BeforeYouSign is an AI-powered contract analysis tool that helps ordinary people understand complex legal agreements before signing them. It identifies risks, explains legal jargon in plain language, and provides actionable recommendations to protect your interests.

## 🎯 The Problem

Most people participate in the modern economy while being legally illiterate by necessity, not by choice. They're expected to navigate contracts written in technical language that was never designed for them, drafted in ways that shift risk, obligations, and liability onto the weaker party while concealing those shifts behind jargon and opacity.

Freelancers, small businesses, creators, tenants, and individuals engage in high-stakes agreements where a single clause can:
- Quietly transfer intellectual property rights
- Impose unlimited liability
- Lock them into auto-renewals
- Restrict termination rights
- Expose them to penalties they don't realize they've accepted

Simply because hiring a lawyer for every contract is economically impossible.

## 💡 The Solution

BeforeYouSign uses advanced AI (GPT-4) to analyze contracts and provide:

- **Risk Scoring**: Overall risk assessment (0-100 scale)
- **Red Flag Detection**: Automatic identification of dangerous clauses
  - IP transfers
  - Unlimited liability
  - Auto-renewal clauses
  - Restricted termination rights
  - One-sided amendments
  - Unfair venue/forum selection
  - Waiver of rights
  - Confidentiality overreach
  - Harsh indemnification
  - Non-compete restrictions
  - Problematic payment terms
  - Dispute resolution issues
- **Plain Language Translation**: Complex legal jargon explained simply
- **Clause-by-Clause Analysis**: Detailed breakdown with risk levels
- **Actionable Recommendations**: Specific advice on what to negotiate

## 🚀 Tech Stack

- **Frontend**: Next.js 14 (React) + TypeScript
- **Styling**: Tailwind CSS
- **AI**: Google Gemini 2.5 Flash (free tier available)
- **Document Processing**: 
  - pdf-parse (PDF files)
  - mammoth (DOCX files)
  - Native text parsing (TXT files)
- **UI Components**: lucide-react icons, react-dropzone
- **Deployment**: Vercel-ready

## 📦 Installation

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

1. **Upload a contract**: Drag and drop or click to upload PDF, DOCX, or TXT files
2. **Wait for analysis**: The AI will analyze the contract (typically 30-60 seconds)
3. **Review results**: 
   - Check the overall risk score
   - Review red flags and warnings
   - Read clause-by-clause plain language explanations
   - Get specific recommendations
4. **Export**: Print or save the analysis for your records

## 🏗️ Project Structure

```
beforeyousign/
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts          # API endpoint for contract analysis
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main page
├── components/
│   ├── FileUpload.tsx            # Drag-and-drop file upload component
│   └── AnalysisResult.tsx        # Contract analysis results display
├── lib/
│   ├── types.ts                  # TypeScript type definitions
│   ├── document-parser.ts        # Document parsing utilities
│   └── contract-analyzer.ts      # AI-powered contract analysis
├── public/                       # Static assets
├── .env.example                  # Environment variables template
└── README.md                     # This file
```

## 🧪 Features

### Document Processing
- ✅ PDF parsing
- ✅ DOCX parsing
- ✅ Plain text parsing
- ✅ File size validation (10MB default)
- ✅ File type validation

### AI Analysis
- ✅ Gemini 2.5 Flash powered analysis (free tier available)
- ✅ Structured JSON output with schema validation
- ✅ Risk scoring algorithm
- ✅ Red flag detection (12+ types)
- ✅ Plain language translation
- ✅ Clause categorization
- ✅ Actionable recommendations

### User Interface
- ✅ Responsive design
- ✅ Drag-and-drop upload
- ✅ Loading states
- ✅ Error handling
- ✅ Print/export functionality
- ✅ Clean, accessible UI

## 🚧 Future Enhancements

- [ ] User authentication and contract history
- [ ] Comparison mode (compare multiple contract versions)
- [ ] Custom risk profiles (freelancer, tenant, employee, etc.)
- [ ] PDF export with annotations
- [ ] Multi-language support
- [ ] Contract templates library
- [ ] Negotiation scripts generation
- [ ] Lawyer marketplace integration
- [ ] Chrome extension for instant analysis
- [ ] Mobile app

## ⚖️ Legal Disclaimer

**BeforeYouSign is an AI-powered tool designed to help you understand contracts. It does not constitute legal advice.** For legal matters, please consult a licensed attorney in your jurisdiction.

The analysis provided is based on AI interpretation and may not catch all risks or nuances. Always exercise your own judgment and seek professional legal counsel for important agreements.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [Google Gemini](https://ai.google.dev/)
- Inspired by the need to democratize legal comprehension

## 📧 Contact

For questions, suggestions, or feedback, please open an issue on GitHub.

---

**Built with ❤️ to level the playing field in contract negotiations.**
