# Portfolio — Muzammil Safdar

Full-stack portfolio built with Next.js 16, Sanity CMS, and MongoDB. Features a blog, project showcase, resume builder with AI job matching, and a task/daily-report dashboard.




## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16, React 19, TypeScript |
| Styling | Tailwind CSS v4, Sass |
| CMS | Sanity (embedded Studio at `/studio`) |
| Database | MongoDB via Mongoose |
| Auth | Custom JWT (bcrypt, cookie-based sessions) |
| AI | OpenAI API (keyword extraction, resume suggestions) |
| Forms | React Hook Form + Zod |
| Animations | Framer Motion, GSAP |
| UI | Radix UI primitives, custom component library |
| Icons | Lucide React |

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Copy `.env.example` to `.env.local` and fill in:

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for signing auth tokens |
| `SANITY_PROJECT_ID` | Sanity project ID |
| `SANITY_DATASET` | Sanity dataset name |
| `SANITY_API_TOKEN` | Sanity API token |
| `OPENAI_API_KEY` | OpenAI API key (for AI features) |
| `ADMIN_DASHBOARD_TOKEN` | Token for legacy admin access |

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server |
| `pnpm build` | Production build |
| `pnpm lint` | Run ESLint |
| `pnpm typecheck` | Run TypeScript check |
| `pnpm sanity` | Sanity CLI |
| `pnpm sanity:dev` | Start Sanity Studio dev |

## Project Structure

```
src/
├── app/          # Next.js App Router pages & API routes
├── components/   # Shared React components
│   └── ui/       # UI component library (Radix-based)
├── features/     # Feature-specific components (home sections)
├── lib/          # Server utilities (auth, db, analytics)
├── models/       # Mongoose models
├── sanity/       # Sanity config, schemas, client
├── services/     # Data fetching services
├── types/        # TypeScript type definitions
└── utils/        # Utility functions
```

### More Full Stack Blog Titles

- How to Build and Deploy a Full Stack App with Next.js and Express
- From Idea to Production: My Full Stack Project Workflow
- How to Design a Scalable API for Side Projects
- REST vs GraphQL for Real Projects: What I Actually Use
- Authentication in Full Stack Apps: JWT, Sessions, and Tradeoffs
- How to Structure a Monorepo for Frontend and Backend Teams
- PostgreSQL Indexing for Developers: Practical Performance Wins
- Caching 101: Redis Strategies That Improve Real App Speed
- How to Add Role-Based Access Control to a Full Stack App
- File Uploads in Full Stack Apps: Secure and Scalable Patterns
- How to Build Real-Time Features with WebSockets and Node.js
- End-to-End Form Validation with React Hook Form and Zod
- How to Handle Background Jobs in Node.js Applications
- CI/CD for Full Stack Apps: A Simple Pipeline That Works
- Docker for Full Stack Developers: Local Setup to Production
- Logging and Monitoring for Full Stack Apps (Without Overkill)
- How to Write Better API Error Responses for Frontend Teams
- Versioning APIs Without Breaking Your Clients
- How I Organize Shared Types Between Frontend and Backend
- How to Add Feature Flags to Ship Safer Full Stack Releases
