# AfroCreate AI - Premium AI Content Platform

A full-stack AI content creation platform built with Next.js 14, designed for creators, startups, and businesses with strong relevance to Nigeria and Africa.

![AfroCreate AI](https://via.placeholder.com/1200x630/1a1a2e/f59e0b?text=AfroCreate+AI)

## ✨ Features

### AI Content Generation
- **Multi-format content**: Blog posts, social media, ad copy, emails, headlines, hashtags
- **Nigerian context awareness**: AI trained to understand Nigerian culture, market references, and Pidgin English
- **Smart suggestions**: Real-time AI suggestions as you type
- **SEO optimization**: Automatic keyword suggestions, meta titles, and readability scores

### Content Management
- **Content library**: Organize and manage all your content in one place
- **Draft autosave**: Never lose your work with automatic saving
- **Version control**: Track changes and revert when needed

### Content Calendar
- **Drag-and-drop scheduling**: Plan your content with visual calendar
- **Multiple event types**: Publish, review, meeting, deadline
- **Team visibility**: See what everyone is working on

### Team Collaboration
- **Role-based permissions**: Admin, Editor, Viewer roles
- **Team invitations**: Easy onboarding for new members
- **Activity tracking**: See who made what changes

### Analytics Dashboard
- **Performance metrics**: Views, clicks, shares, engagement rate
- **Content insights**: See which content performs best
- **Visual charts**: Beautiful data visualization

### Premium UI/UX
- **Glassmorphism design**: Modern, high-end aesthetic
- **Dark/Light mode**: Seamless theme switching
- **Micro-interactions**: Smooth animations throughout
- **Command palette**: Quick actions with ⌘K
- **Mobile responsive**: Works great on all devices

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **UI Components**: shadcn/ui + Radix UI
- **State Management**: Zustand
- **Database**: MongoDB
- **AI**: OpenAI GPT-4
- **Drag & Drop**: dnd-kit
- **Charts**: Recharts

## 📁 Project Structure

```
src/
├── app/
│   ├── api/                    # API Routes (Backend)
│   │   ├── ai/
│   │   │   ├── generate/       # AI content generation
│   │   │   ├── suggestions/    # Live suggestions
│   │   │   ├── seo/           # SEO metadata
│   │   │   └── improve/       # Content improvement
│   │   ├── content/           # Content CRUD
│   │   ├── calendar/          # Calendar events
│   │   └── analytics/         # Analytics data
│   ├── actions/               # Server Actions
│   │   ├── content.ts
│   │   ├── calendar.ts
│   │   └── team.ts
│   ├── dashboard/             # Dashboard pages
│   │   ├── page.tsx           # Main dashboard
│   │   ├── editor/            # AI content editor
│   │   ├── content/           # Content library
│   │   ├── calendar/          # Content calendar
│   │   ├── analytics/         # Analytics
│   │   ├── team/              # Team management
│   │   ├── settings/          # User settings
│   │   └── help/              # Help center
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Landing page
│   └── globals.css            # Global styles
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── ai-thinking.tsx        # AI thinking animation
│   ├── command-palette.tsx    # ⌘K command palette
│   ├── sidebar.tsx            # Dashboard sidebar
│   ├── theme-provider.tsx     # Theme context
│   └── theme-toggle.tsx       # Theme switcher
├── lib/
│   ├── utils.ts               # Utility functions
│   ├── mongodb.ts             # Database connection
│   └── openai.ts              # OpenAI integration
├── store/
│   └── index.ts               # Zustand stores
└── middleware.ts              # Next.js middleware
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB database
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/afrocreate-ai.git
   cd afrocreate-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file:
   ```env
   # OpenAI
   OPENAI_API_KEY=sk-your-openai-api-key
   
   # MongoDB
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/afrocreate
   MONGODB_DB=afrocreate
   
   # App
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open the app**
   
   Visit [http://localhost:3000](http://localhost:3000)

## 🎨 UI Components

The project uses a custom component library built on top of shadcn/ui with additional features:

- **GlassCard**: Glassmorphism card with hover effects
- **StatsCard**: Dashboard statistics display
- **AIThinking**: Animated AI processing indicator
- **CommandPalette**: Global command interface

## 🔌 API Endpoints

### AI Endpoints
- `POST /api/ai/generate` - Generate AI content
- `POST /api/ai/suggestions` - Get live suggestions
- `POST /api/ai/seo` - Generate SEO metadata
- `POST /api/ai/improve` - Improve existing content

### Content Endpoints
- `GET /api/content` - List all content
- `POST /api/content` - Create new content
- `GET /api/content/[id]` - Get single content
- `PATCH /api/content/[id]` - Update content
- `DELETE /api/content/[id]` - Delete content

### Calendar Endpoints
- `GET /api/calendar` - List calendar events
- `POST /api/calendar` - Create event
- `PATCH /api/calendar` - Update event
- `DELETE /api/calendar` - Delete event

### Analytics Endpoints
- `GET /api/analytics` - Get analytics data
- `POST /api/analytics` - Record analytics event

## 🔐 Server Actions

Server Actions provide optimistic UI updates:

- `createContent` - Create new content
- `updateContent` - Update existing content
- `deleteContent` - Delete content
- `publishContent` - Publish content
- `scheduleContent` - Schedule content
- `duplicateContent` - Duplicate content

## 🌍 Nigerian Context

AfroCreate includes special support for Nigerian content:

- **Cultural references**: Markets (Computer Village, Alaba), events (Felabration, Lagos Fashion Week)
- **Business terms**: Local slang and expressions
- **Pidgin English**: Full support for Nigerian Pidgin writing

## 📱 Keyboard Shortcuts

- `⌘K` - Open command palette
- `⌘D` - Go to dashboard
- `⌘E` - Open editor
- `⌘L` - Open calendar
- `⌘,` - Open settings

## 🎯 Roadmap

- [ ] Authentication with NextAuth.js
- [ ] Real-time collaboration
- [ ] Content templates
- [ ] API access for integrations
- [ ] Mobile app
- [ ] Multi-language support
- [ ] AI image generation

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Vercel](https://vercel.com) for Next.js
- [OpenAI](https://openai.com) for GPT-4
- [shadcn](https://ui.shadcn.com) for UI components
- [Tailwind CSS](https://tailwindcss.com) for styling

---

Built with ❤️ for African creators by AfroCreate

