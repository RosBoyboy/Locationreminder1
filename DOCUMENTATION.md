# GeoRemind - Location-Based Reminder Application

## Overview
GeoRemind is a web and mobile-friendly application (PWA) that allows users to set location-based reminders. Users can define geofences around specific areas, and the app will trigger push notifications as soon as they enter or approach those locations. The app ensures you never forget your tasks when you are near the relevant location (e.g., getting a reminder to pick up groceries when passing by the supermarket).

## Tech Stack
The project is built using modern web development tools and frameworks:

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4, Vanilla CSS
- **UI Components**: Radix UI, Shadcn UI
- **Animations**: Framer Motion
- **Map Integration**: React Leaflet (Leaflet.js)
- **Backend & Database**: Supabase (PostgreSQL, Authentication, Real-time sync)
- **State Management**: React Query, React Context
- **Icons**: Lucide React, Radix Icons
- **PWA**: Progressive Web App capabilities for mobile installation and offline support

## Core Features
- **Geofence Triggers**: Draw boundaries on an interactive map. Reminders trigger when you step inside.
- **Smart Notifications**: Rich push notifications with 'Done' or 'Snooze' actions.
- **Interactive Map**: View all location pins live on a map.
- **Category System**: Organize reminders (Work, Personal, School, Shopping, Health).
- **Instant Sync**: Real-time updates across devices with offline support.
- **Privacy First**: End-to-end encryption with local processing where possible.

## Project Structure
The repository is structured as a standard Next.js App Router project:

```text
/
├── app/                  # Next.js App Router (pages, layouts, globals.css)
│   ├── dashboard/        # Main application dashboard
│   ├── login/            # Authentication pages
│   └── page.tsx          # Landing page
├── components/           # Reusable React components (UI elements, layout parts)
├── context/              # React Context providers for global state
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries and configurations
├── public/               # Static assets (images, icons, manifest)
├── services/             # API services and external integrations
├── supabase/             # Supabase configurations and edge functions
├── types/                # TypeScript type definitions
├── utils/                # Helper functions
└── ...configuration files (package.json, next.config.ts, etc.)
```

## Getting Started

### Prerequisites
- Node.js (v20+ recommended)
- npm, yarn, pnpm, or bun
- A Supabase Project

### Environment Variables
To run the project locally, duplicate the `.env.example` file and rename it to `.env.local`. Fill in the required Supabase keys:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
# Optional for admin scripts
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Installation & Running Locally

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment
The project is optimized for deployment on **Vercel**. 
1. Push the code to a Git repository (GitHub/GitLab/Bitbucket).
2. Import the project in the Vercel dashboard.
3. Configure the environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`).
4. Deploy.

## Notes
- Ensure your Supabase project has the correct tables (e.g., `reminders`, `categories`) and Row Level Security (RLS) policies set up for authentication to work securely.
- If testing geofences locally, browser location mocking tools may be needed.
