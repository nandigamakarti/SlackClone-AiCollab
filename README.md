# 🚀 Slack Clone with AI Integration

A modern, feature-rich Slack clone built with React, TypeScript, and AI-powered capabilities. This application provides real-time messaging, workspace management, and intelligent features like tone analysis and AI-assisted communication.

## ✨ Features

### 🔐 Authentication & User Management
- User registration and login system
- Workspace creation and management
- User profiles with status and presence indicators
- Role-based access control

### 💬 Messaging & Communication
- Real-time messaging in channels
- Direct messages between users
- Threaded conversations
- Message reactions and emoji support
- Message pinning functionality
- File sharing and document management

### 🤖 AI-Powered Features
- **Tone Analysis**: Real-time analysis of message tone and impact
- **Meeting Notes Generation**: Automated meeting summaries

### 🎨 Modern UI/UX
- Beautiful, responsive design with Tailwind CSS
- Dark/light theme support
- Smooth animations with Framer Motion
- Accessible components with Radix UI
- Mobile-friendly interface

### 🏢 Workspace Management
- Multiple workspace support
- Channel creation and management
- Team member invitations
- Workspace settings and customization

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and context
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible UI components
- **Radix UI** - Unstyled, accessible UI primitives
- **Framer Motion** - Smooth animations and transitions

### State Management & Routing
- **React Context** - Global state management
- **React Router** - Client-side routing
- **TanStack Query** - Server state management

### AI & External Services
- **OpenAI API** - GPT-powered AI features
- **Axios** - HTTP client for API calls

### Development Tools
- **ESLint** - Code linting
- **TypeScript** - Static type checking
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager
- OpenAI API key (for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd slack13
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:8080`

### Build for Production

```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── dashboard/      # Main app dashboard components
│   └── ui/             # shadcn/ui components
├── contexts/           # React context providers
│   ├── AuthContext.tsx    # Authentication state
│   └── MessageContext.tsx # Message and channel state
├── pages/              # Route components
│   ├── Index.tsx          # Main entry point
│   ├── WorkspacesPage.tsx # Workspace selection
│   └── landing/           # Landing page components
├── services/           # External API services
│   ├── openai.ts          # OpenAI integration
│   ├── toneAnalyzer.ts    # Message tone analysis
└── utils/              # Utility functions
│   ├── mockData/          # Mock data generators
│   └── fileStorage.ts     # File handling utilities
└── hooks/              # Custom React hooks
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|---------|
| `VITE_OPENAI_API_KEY` | OpenAI API key for AI features | Yes |

### Tailwind Configuration

The project uses a custom Tailwind configuration with:
- Custom color palette matching Slack's design
- Extended spacing and border radius values
- Custom animations and transitions
- Responsive breakpoints

## 🤖 AI Features Usage

### Tone Analysis
The application automatically analyzes the tone of messages as you type, providing:
- Tone classification (aggressive, neutral, weak, confusing, clear)
- Impact assessment (high, medium, low)
- Improvement suggestions
- Numerical score (1-10)

## 📱 Mobile Support

The application is fully responsive and optimized for:
- Mobile phones (iOS/Android)
- Tablets
- Desktop computers
- Various screen sizes and orientations

## 🎨 Theming

The application supports:
- Light and dark themes
- Custom color schemes
- Accessible color contrasts
- Consistent design tokens

## 🧪 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run type-check` - Run TypeScript type checking
- `npm run clean` - Clean build directory

### Code Style

The project follows:
- ESLint configuration for code quality
- TypeScript strict mode
- Consistent naming conventions
- Component-based architecture

## 🔒 Security

- Environment variables for sensitive data
- Input validation and sanitization
- Secure API key handling
- XSS protection
- CSRF protection considerations

## 🚀 Deployment

The application can be deployed to:
- Vercel (recommended)
- Netlify
- AWS S3 + CloudFront
- Any static hosting service

### Vercel Deployment

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Radix UI](https://www.radix-ui.com/) for accessible primitives
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [OpenAI](https://openai.com/) for AI capabilities
- [Framer Motion](https://www.framer.com/motion/) for animations

## 📞 Support

If you have any questions or need help:
- Open an issue on GitHub
- Check the documentation
- Review the code examples

---

**Built with ❤️ using modern web technologies**
