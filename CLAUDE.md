# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Reform in Focus** is a Michigan K-12 education reform blog serving as a "reform translator" - connecting policy initiatives to show how they relate and their long-term trajectories. Unlike typical education coverage focused on political battles, this blog provides nuanced analysis for parents, school board members, administrators, teachers, and community members.

**Tech Stack:**
- Next.js 15 with Pages Router (NOT App Router)
- Supabase (PostgreSQL) for database and storage
- TypeScript for type safety
- Interweave for HTML content rendering
- Vercel hosting at `blog.ryanlongo.net`

## Commands

### Development
```bash
npm run dev         # Start development server with Turbopack
npm run build       # Build for production
npm start           # Start production server
npm run lint        # Run ESLint
```

## Design System

### Typography
- **Body text:** Georgia, 'Times New Roman', serif (newspaper-inspired)
- **Headlines:** 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif
- **Tone:** Serious, authoritative journalistic aesthetic

### Color Palette (Defined in [styles/globals.css](styles/globals.css))
- **Primary:** `--primary-blue` (#2563eb)
- **Neutrals:** `--neutral-900` to `--neutral-50` (dark to light)
- **Topic Accents:**
  - Literacy/Reading: `--neutral-900` (dark)
  - Funding/Finance: `--accent-green` (#10b981)
  - Teacher Pipeline: `--accent-orange` (#f59e0b)
  - School Choice: `--neutral-900` (dark)

### Design Principles
- Generous whitespace
- Mobile-first responsive (audience includes busy parents/administrators on the go)
- Clean, content-focused layout
- Card-based organization for topic discovery

## Architecture

### Pages Router Structure
This project uses Next.js Pages Router. All routes are file-based in `/pages` directory.

**Current Pages:**
- `/pages/index.tsx` - Homepage
- `/pages/articles.tsx` - Article listing page
- `/pages/article/[id].tsx` - Dynamic article detail page (by ID)
- `/pages/_app.tsx` - Custom App component
- `/pages/_document.tsx` - Custom Document
- `/pages/login/page.tsx` - Login page stub (commented out)
- `/pages/api/*` - API routes

**Planned Pages (To Build):**
- `/pages/topics/index.tsx` - Topic cluster exploration
- `/pages/topics/[cluster-slug].tsx` - Articles by cluster
- `/pages/tags/[tag-slug].tsx` - Articles by tag
- `/pages/understanding-reform/index.tsx` - Evergreen explainer guides
- `/pages/research/index.tsx` - In-depth research publications
- `/pages/subscribe/index.tsx` - Newsletter subscription
- `/pages/contact/index.tsx` - Contact form
- `/pages/search/index.tsx` - Search results
- `/pages/admin/*` - Admin panel (protected routes)

### Database Schema (Supabase)

**Core Tables:**
- `articles` - id, title, slug, excerpt, content (HTML), author_name, featured_image_url, published, published_at, read_time_minutes, article_type (enum: 'topic', 'research', 'opinion', 'understanding')
- `tags` - id, name, slug, description, color
- `article_tags` - junction table (article_id, tag_id)
- `clusters` - id, name, slug, description, icon_or_image_url, display_order (4 pre-seeded: Literacy, Funding, Teacher Pipeline, School Choice)
- `cluster_tags` - junction table (cluster_id, tag_id)
- `subscribers` - id, email, is_active, preferences (JSONB: weekly_newsletter, article_alerts, research_updates)
- `contact_submissions` - id, name, email, subject, message, submitted_at, is_read
- `users` - id, email (for authenticated users)
- `bookmarks` - id, user_id, article_id, memo (for future user feature)

**Important:** RLS policies exist. Use Supabase client properly; admin operations need service role for writes. The `is_admin()` function exists for admin route protection.

### Data Flow

1. **Supabase Integration**: All content stored in Supabase, fetched via API routes
2. **API Routes** (`/pages/api/`):
   - `getArticles.js` (GET) - Fetches published articles from `articles` table
   - `getArticle.js` (POST) - Fetches single article by `easyid` field
   - **Note:** These use `.js` extension; new API routes should match existing patterns
3. **Client-Side Fetching**: Pages use `useEffect` hooks to fetch from API routes
4. **Article Type**: Defined in [components/article.tsx](components/article.tsx:8-14):
   ```typescript
   type articleType = {
     id: number;
     title: string;
     slug: string;
     excerpt: string;
     content: string;  // HTML string, rendered via Interweave
   }
   ```
5. **Future Expansion**: Database has additional fields (author_name, featured_image_url, article_type, etc.) not yet used in current `articleType`

### Component Structure

**Existing Components** in `/components`:
- `article.tsx` - Article container, ArticleHeader, ArticleBody, ArticleFigure components
- `navbar.tsx` - Site navigation with Logo component
- `button.tsx` - Reusable button component
- `portal.tsx` - Portal component (minimal implementation)
- `head_component.tsx` - Head component

**Article Rendering:** Uses `Interweave` library ([components/article.tsx](components/article.tsx:44)) to safely render HTML content from Supabase

**Planned Component Categories (To Build):**
- **Layout:** Footer, admin sidebar
- **Article:** ArticleCard, ArticleMeta, RelatedArticles
- **Content:** MermaidDiagram, AudioPlayer, TagBadge, ClusterCard
- **Forms:** SubscribeForm, ContactForm, SearchInput
- **Admin:** RichTextEditor (Tiptap), ImageUploader, TagSelector, DataTable, StatsCard
- **UI:** Modal, Toast, LoadingSpinner

### Styling
- CSS files in `/styles` directory
- Component-specific CSS imported in components (e.g., [navbar.tsx](components/navbar.tsx:2))
- Global styles and color palette in [styles/globals.css](styles/globals.css)
- Mobile-first responsive approach

### Environment Variables
Required in `.env` file:
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` - Supabase anonymous key
- Service role key needed for admin operations (should NOT be public)

### TypeScript Configuration
- Path aliases: `@/*` maps to project root
- Target: ES2017
- Strict mode enabled
- Component files use `.tsx` extension

## Key Implementation Patterns

### 1. API Routes
- Mixed `.ts` and `.js` files - new routes should match existing patterns
- Return JSON with `{ message, data }` or `{ error, details }` format
- Include proper HTTP status codes

### 2. Dynamic Routes
- Use `useRouter` hook to access route params
- Check `router.isReady` before accessing query params ([article/[id].tsx](pages/article/[id].tsx:11-21))
- Handle loading states during router initialization

### 3. Loading States
- Implement loading spinners for async operations
- Show error states when fetches fail
- Example pattern in [articles.tsx](pages/articles.tsx:47-56)

### 4. Article Content Rendering
- Store article content as HTML in database
- Render using `<Interweave content={articleContent} />` ([article.tsx](components/article.tsx:44))
- This safely handles HTML from database without XSS vulnerabilities

### 5. Supabase Client Usage
- Create client with `createClient(supabaseUrl, supabaseKey)`
- Use `.select()`, `.eq()`, `.single()` for queries
- Handle errors from Supabase responses

## Special Features to Implement

### 1. Mermaid Diagram Support (High Priority)
Articles should render Mermaid diagram code blocks as visual diagrams for governance flowcharts, policy trees, etc.
- Detect `mermaid` code blocks in article content
- Render using mermaid.js library
- Include alt text for accessibility

### 2. Rich Text Editor (Critical - Admin Panel)
Build Tiptap-based editor at `/admin/articles/new` and `/admin/articles/[id]/edit`:
- Bold, italic, headings, lists, quotes, code blocks, links
- Image uploads to Supabase Storage
- Mermaid diagram insertion
- HTML source view toggle
- Auto-save drafts
- Preview mode

### 3. Audio Player Infrastructure (Future)
- Add `audio_url` field to articles table
- Build player component with play/pause, progress bar, playback speed
- Placeholder for AI voice API integration

### 4. Search Functionality
- Full-text search across titles, excerpts, content
- Use Supabase full-text search
- Search page at `/search?q=query`
- Search input in navbar

### 5. Related Articles
- Show 3-4 related articles on article pages
- Determine by shared tags
- Prioritize articles in same cluster

### 6. Social Sharing
- Share buttons (Twitter/X, Facebook, LinkedIn, email)
- Open Graph meta tags for rich previews

### 7. Newsletter Subscription
- Multiple options: weekly newsletter, topic alerts, research updates
- Save to `subscribers` table with JSONB preferences
- No full account required initially

## Admin Panel Requirements

Protected routes at `/admin/*` using Supabase Auth and `is_admin()` function.

**Key Admin Features:**
1. **Dashboard** - Stats overview, quick links
2. **Article Editor** - Rich text editor with metadata fields, auto-save, preview
3. **Tag Manager** - CRUD with color picker
4. **Cluster Manager** - CRUD with display ordering, tag assignment
5. **Subscriber Management** - List, filter, export to CSV
6. **Contact Submissions** - View, mark read, delete

**Authentication Flow:**
- Login page at `/admin/login`
- Check user email against `is_admin()` function
- Redirect non-admins

## Development Priorities

### Phase 1: Core Public Site (Current Focus)
- Home page with article listing
- Individual article pages
- Topics/clusters navigation
- Tag filtering and pages
- Basic search

### Phase 2: Admin Panel
- Admin authentication
- Article list management
- **Rich text editor** (critical)
- Image uploads
- Tag/cluster management

### Phase 3: Engagement Features
- Subscribe page
- Contact form
- Social sharing
- Related articles

### Phase 4: Advanced Features
- Mermaid diagrams
- Audio player infrastructure
- Enhanced search
- Understanding Reform section

### Phase 5: User Features (Future)
- User authentication
- Bookmarking with memos
- User dashboard
- Smart popup system

## Important Notes

1. **Pages Router, not App Router** - Structure routes in `/pages`, not `/app`
2. **Article content is HTML** - Editor outputs HTML, Interweave renders it
3. **RLS policies active** - Service role needed for admin writes
4. **Current article fetching uses `easyid`** - Not slug (see [article/[id].tsx](pages/article/[id].tsx))
5. **Color palette is pre-defined** - Use CSS variables from [globals.css](styles/globals.css)
6. **Mobile-first** - Key audience uses phones frequently
7. **SEO matters** - Use meta tags, semantic HTML, SSR/SSG where appropriate
8. **Mermaid diagrams are essential** - Not optional; important visual tool for governance charts
