# Quick Start Guide

## Prerequisites

- Node.js 18.x or higher
- npm or yarn
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your OpenAI API key:

```env
OPENAI_API_KEY=sk-your-actual-openai-api-key-here
NEXT_PUBLIC_APP_NAME=BeforeYouSign
NEXT_PUBLIC_MAX_FILE_SIZE=10485760
```

### 3. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
npm start
```

## Testing the Application

1. Open `http://localhost:3000` in your browser
2. Upload a test contract (you can use `public/sample-contract.txt`)
3. Wait for the AI analysis (30-60 seconds)
4. Review the results

## Common Issues

### "Failed to analyze contract: API key is invalid"
- Make sure you've added a valid OpenAI API key to `.env.local`
- Restart the development server after adding the key

### "File type not supported"
- Only PDF, DOCX, and TXT files are supported
- Make sure your file is under 10MB

### Build errors
- Clear `.next` folder: `rm -rf .next` (or `rmdir /s .next` on Windows)
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check that you're using Node.js 18.x or higher: `node --version`

## API Key Setup

### Getting an OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new secret key
5. Copy the key and add it to `.env.local`

**Note**: Using GPT-4 API requires a paid OpenAI account with GPT-4 access enabled.

### Cost Estimation

- Average contract: ~2,000-5,000 tokens
- GPT-4 Turbo cost: ~$0.01-0.05 per contract analysis
- For high volume, consider implementing caching or using GPT-3.5-turbo

## Development

### Project Structure

```
beforeyousign/
├── app/                    # Next.js app directory
│   ├── api/analyze/       # Contract analysis API endpoint
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page (upload + results)
├── components/            # React components
│   ├── FileUpload.tsx    # Drag-and-drop upload
│   └── AnalysisResult.tsx # Analysis display
├── lib/                   # Core utilities
│   ├── types.ts          # TypeScript types
│   ├── document-parser.ts # PDF/DOCX/TXT parsing
│   └── contract-analyzer.ts # AI analysis logic
└── public/               # Static files
```

### Adding New Features

1. **Custom Risk Profiles**: Edit `lib/contract-analyzer.ts` to adjust prompts for specific user types (freelancer, tenant, etc.)
2. **New Document Types**: Add parsers to `lib/document-parser.ts`
3. **UI Customization**: Modify components in `components/` directory
4. **New Red Flag Types**: Update `lib/types.ts` and analysis prompt

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variables in Vercel dashboard:
   - `OPENAI_API_KEY`
   - `NEXT_PUBLIC_MAX_FILE_SIZE`
5. Deploy!

### Environment Variables for Production

Make sure to set these in your production environment:

```env
OPENAI_API_KEY=sk-your-production-key
NEXT_PUBLIC_APP_NAME=BeforeYouSign
NEXT_PUBLIC_MAX_FILE_SIZE=10485760
```

## Support

For issues, questions, or contributions, please visit the GitHub repository.

---

**Ready to democratize legal comprehension? Let's go! 🚀**
