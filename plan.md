# SneakerDrop implementation plan

## Scope and implementation approach

SneakerDrop will be a Next.js App Router application written in strict TypeScript. The public experience will be server-rendered from Supabase so catalogue content is never backed by a hardcoded product array. A small set of client components will handle waitlist submission, mobile navigation, animated reveals, admin mutations, and inline feedback. Supabase Auth will provide administrator sign-in; server-side route handlers will verify the authenticated user and the `admin_users` role table before allowing product CRUD or waitlist reads.

The database layer will be version-controlled in `supabase/migrations` and `supabase/seed.sql`. Products will have a constrained availability status, price and URL validation, timestamp maintenance, public read policy, and admin-only writes. Waitlist submissions will be accepted through a narrowly scoped security-definer RPC that validates the product and normalized email before inserting into a table protected by RLS. A unique constraint on `(product_id, email)` will prevent concurrent duplicates. Product deletion will use `ON DELETE RESTRICT`, preserving subscriber history and requiring an administrator to resolve dependent waitlist records deliberately.

The public route set will include `/`, `/catalogue`, and `/products/[slug]`; the protected area will include `/admin`, `/admin/login`, and server API routes under `/api`. Middleware will refresh Supabase sessions. The public site will use a small set of stable Unsplash sneaker photographs as fictional catalogue imagery, configured in database seed data rather than in frontend product arrays. The application will include a reproducible README, environment example, migration instructions, and admin provisioning instructions.

## Project structure

- `app/`: App Router pages, layouts, metadata, route handlers, and middleware.
- `components/`: Reusable public UI, product cards, catalogue sections, waitlist form, navigation, and admin dashboard components.
- `lib/`: Supabase clients, auth guards, shared types, validation schemas, and data access helpers.
- `supabase/migrations/`: Versioned PostgreSQL schema, RLS policies, RPC, indexes, and timestamp trigger.
- `supabase/seed.sql`: Idempotent fictional demonstration product records.
- `public/`: Route manifest and static brand assets.
- `README.md`: Evaluation-ready setup, security, architecture, testing, and deployment documentation.

## Design system

### Direction candidates

- **Concrete editorial streetwear** — 0.06: A gallery-like sneaker journal with raw paper, hard rules, and deliberate asymmetry.
- **Neo-track utility** — 0.07: Performance-inspired panels, compact labels, and lime signal color used like equipment markings.
- **Midnight atelier** — 0.05: Dark luxury with warm surfaces, close-up product crops, and restrained gallery pacing.

**Chosen direction: Concrete editorial streetwear.**

### Design Movement

Contemporary streetwear editorial with cues from independent print zines, product lookbooks, and industrial wayfinding.

### Core Principles

1. Let the product image carry the drama; typography and borders frame it rather than decorate it.
2. Use contrast as navigation: near-black, warm paper, and one electric signal color.
3. Prefer asymmetrical editorial compositions over generic centered ecommerce grids.
4. Make every action feel tactile with crisp focus states, short motion, and explicit feedback.

### Color Philosophy

Near-black establishes a serious, nocturnal streetwear backdrop. Warm white gives catalogue sections the tactile feel of uncoated paper. Electric lime is reserved for action, availability, and the brand mark so it reads as a signal rather than a wash of neon. Muted graphite and rust provide depth without adding competing brand colors.

### Layout Paradigm

The homepage alternates full-bleed dark editorial bands with warm paper catalogue modules. The hero uses a split composition: oversized copy and a framed product image with a vertical release index. Catalogue cards use consistent geometry, but feature ordering and supporting copy shift across breakpoints to avoid a template feel.

### Signature Elements

- A lime `//` signal mark paired with the wordmark.
- Thin graphite rules and small mono labels that feel like release documentation.
- Product cards with an oversized index number and an intentional image crop.

### Interaction Philosophy

Interactions are direct and physical: buttons lift one pixel, cards shift their image crop, and status labels use short transitions rather than ornamental effects. Waitlist submission preserves the product context and clearly tells the visitor what happened. Admin operations use explicit destructive confirmation and inline status messaging.

### Animation

Use Framer Motion for short reveal transitions, card hover image scale, and the mobile menu. Keep durations between 180–520ms with ease-out curves. Respect `prefers-reduced-motion` by disabling transforms and reducing reveals to opacity changes. No looping decorative animation should compete with product photography or form feedback.

### Typography System

Use Space Grotesk for display and interface typography, with DM Mono for metadata, prices, availability labels, and release indexes. Display headlines are compact and oversized; body copy is set with generous line height; mono labels are uppercase with tracking for a technical editorial tone.

### Brand Essence

SneakerDrop is a fictional independent release desk for people who read the details before they buy the pair. Personality: exacting, nocturnal, considered.

### Brand Voice

Headlines are concise and declarative. CTAs invite exploration without hype. Example lines: “The next pair starts here.” and “Keep your place in the release.”

### Wordmark & Logo

The wordmark is set in a tight uppercase display treatment with the lime `//` signal mark as a recognizable stamp. The mark appears in the header, hero eyebrow, and footer, but never as a decorative watermark.

### Signature Brand Color

Signal Lime `#D8FF3E` — a sharp, high-visibility green that reads like a release indicator against charcoal and aged paper.

## Backend and security decisions

- Public reads use the publishable Supabase key and RLS; no service-role key is required by the application.
- Admin authorization is represented by `admin_users.user_id` referencing `auth.users`. The first admin is provisioned manually from the Supabase dashboard after creating an Auth user.
- The `is_admin()` security-definer function is used only for database policy checks and has a fixed `search_path`.
- Waitlist writes go through `submit_waitlist(product_id, email)` with server-side zod validation in the route and database-level validation/uniqueness in the function/table.
- Waitlist reads are admin-only. Product deletes are restricted when waitlist rows exist, which avoids accidental loss of subscriber history.
- `.env`, `.env.local`, build outputs, and node modules are excluded from Git.

## Delivery workflow

Implement the plan, apply the migration and seed to the accessible SneakerDrop Supabase project, run lint/type/build checks, start Preview and inspect the public and admin routes at desktop and mobile sizes, then save a checkpoint. Attempt the requested GitHub canonical transfer and Vercel project connection only when the application is complete; if account authorization is unavailable, document the exact manual action and leave the working project and README ready for it.
