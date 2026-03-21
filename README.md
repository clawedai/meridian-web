# Drishti Web

Frontend for the Drishti Intelligence Platform.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + custom components
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth + Custom JWT

## Getting Started

### 1. Install Dependencies

```bash
cd drishti-web
npm install
```

### 2. Environment Variables

Create a `.env.local` file:

```env
# Supabase (from your Supabase project)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Backend API (default: local development)
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
drishti-web/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Login, Register pages
│   ├── dashboard/          # Main dashboard
│   │   ├── entities/      # Entity management
│   │   ├── sources/       # Data sources
│   │   ├── insights/     # AI insights
│   │   ├── alerts/       # Alert configuration
│   │   ├── reports/      # Report generation
│   │   └── settings/     # Account settings
│   ├── layout.tsx
│   └── page.tsx          # Landing page
├── components/
│   ├── ui/               # Base UI components
│   └── layout/          # Layout components
├── lib/
│   ├── api.ts           # API client
│   ├── supabase.ts      # Supabase client
│   ├── types.ts         # TypeScript types
│   └── utils.ts         # Utilities
└── public/              # Static assets
```

## Features

- [x] Landing page with pricing
- [x] User authentication
- [x] Dashboard overview
- [x] Entity management (CRUD)
- [x] Data source management
- [x] AI-powered insights
- [x] Alert configuration
- [x] Report generation
- [x] Account settings

## Backend Setup

The frontend connects to the Meridian API backend. See `../meridian-api/README.md` for setup instructions.

## Deployment

Deploy on Vercel:

1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy

## Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Production server
npm run lint     # ESLint
```
