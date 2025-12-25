# FriendMatch Setup Guide

Complete setup instructions for running the FriendMatch app locally or deploying it.

## Prerequisites

- Node.js 18+ and npm
- Git

## Quick Start (Local Development)

### 1. Clone and Install

```bash
cd /path/to/matcing_apps
npm install
```

### 2. Environment Setup

The `.env` file should already exist with:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Database Setup

```bash
# Push schema to database
npx prisma db push

# Seed the database with sample data
npx tsx prisma/seed.ts
```

This creates:
- Admin user: `admin@friendmatch.app` / `admin123`
- Demo users: `yuki@example.com` / `password123`, etc.
- Event series with 7 events in Tokyo
- Sample chat messages and RSVPs

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## App Structure

### User-Facing Routes

- `/` - Landing page with links to app and admin
- `/app` - Home screen (greeting + upcoming events)
- `/app/explore` - Browse all events
- `/app/events/[id]` - Event detail with RSVP
- `/app/experiences` - Series timeline view
- `/app/grads` - Membership perks (mock payment)
- `/app/chat` - Group chat list
- `/app/chat/[id]` - Chat thread
- `/app/profile` - Settings with language toggle
- `/app/profile/verification` - Upload verification photos

### Admin Routes

- `/admin` - Admin dashboard
- `/admin/series/create` - Create new event series
- `/admin/verifications` - Review pending verifications
- `/admin/verifications/[userId]` - Approve/reject individual verification

## Test Accounts

```
Admin:
  Email: admin@friendmatch.app
  Password: admin123

Demo Users:
  yuki@example.com / password123
  sakura@example.com / password123
  haruka@example.com / password123
  etc.
```

## Key Features

### ✅ Implemented

1. **Event Series Management**
   - Admin can create series of events
   - Users automatically enrolled
   - Timeline view showing progress

2. **Photo Verification System**
   - Users upload: ID, selfie, profile photo
   - Admin reviews all three photos
   - Gender verification via profile photo
   - Approve/reject with reason

3. **RealRoots UI Design**
   - Warm beige background (#FAF7F5)
   - Large rounded cards (20-24px)
   - Black primary buttons
   - Bottom tab navigation
   - Japanese-first with EN toggle

4. **Mobile-First Design**
   - Bottom tab bar (5 tabs)
   - Touch-friendly sizes
   - Safe area inset support
   - Responsive layouts

5. **Localization**
   - Japanese default
   - English toggle in profile
   - Proper date formatting (1月7日format)
   - Natural Japanese copy

### 🚧 Mock/Future Work

- Authentication (currently no auth required)
- Image uploads (UI exists, no actual upload)
- Payment processing (shows "coming soon" modal)
- Real-time chat (currently static messages)
- Email notifications
- Push notifications

## Database Schema

### Key Models

- **User** - Authentication and profile
- **Profile** - Nickname, bio, photo
- **Verification** - ID + selfie + profile photo, status
- **EventSeries** - Container for event sequences
- **SeriesEnrollment** - User enrollment in a series
- **Event** - Individual gatherings (linked to series or standalone)
- **RSVP** - User event attendance
- **Group** - Cohort groupings
- **ChatThread** - Group conversations
- **Message** - Chat messages

## Development Commands

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Database commands
npx prisma studio          # Open database GUI
npx prisma db push         # Push schema changes
npx tsx prisma/seed.ts     # Seed database
npx prisma generate        # Regenerate client

# Type checking
npm run type-check
```

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project to Vercel
3. Add environment variables:
   ```
   DATABASE_URL=postgresql://... (use Vercel Postgres)
   NEXTAUTH_SECRET=<generate random string>
   NEXTAUTH_URL=https://your-domain.vercel.app
   ```
4. Deploy

Note: You'll need to migrate from SQLite to PostgreSQL for production:
1. Update `prisma/schema.prisma` datasource to `postgresql`
2. Run `npx prisma migrate dev`
3. Run seed script

### Other Platforms

The app is a standard Next.js app and can be deployed to:
- Railway
- Render
- Fly.io
- Your own VPS

Requirements:
- Node.js 18+
- PostgreSQL database (for production)
- Environment variables set

## File Structure

```
src/
├── app/                    # Next.js app router
│   ├── page.tsx           # Landing page
│   ├── app/               # User-facing app
│   │   ├── layout.tsx     # Shell with bottom nav
│   │   ├── page.tsx       # Home screen
│   │   ├── explore/       # Event browsing
│   │   ├── events/        # Event details
│   │   ├── experiences/   # Timeline view
│   │   ├── grads/         # Perks screen
│   │   ├── chat/          # Group chat
│   │   └── profile/       # Settings
│   └── admin/             # Admin interface
│       ├── page.tsx       # Dashboard
│       ├── series/        # Event series management
│       └── verifications/ # Photo review
├── components/
│   ├── ui/                # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── EventCard.tsx
│   │   ├── Timeline.tsx
│   │   └── AvatarStack.tsx
│   └── layout/            # Layout components
│       ├── BottomTabBar.tsx
│       └── Header.tsx
├── contexts/              # React contexts
│   └── LocaleContext.tsx  # Language state
├── lib/                   # Utilities
│   ├── i18n.ts            # Translations & date formatting
│   └── utils.ts           # Helper functions
└── hooks/                 # Custom hooks

prisma/
├── schema.prisma          # Database schema
└── seed.ts                # Seed script

public/                    # Static assets
└── images/                # Placeholder images
```

## Customization

### Change Colors

Edit `tailwind.config.ts`:

```typescript
colors: {
  background: {
    DEFAULT: '#FAF7F5', // Your color here
  },
  primary: {
    DEFAULT: '#1A1A1A',   // Button color
  },
}
```

### Add New Language

1. Edit `src/lib/i18n.ts`
2. Add new language key to `translations` object
3. Update `Locale` type
4. Add language option to profile settings

### Modify Event Series

Edit seed script at `prisma/seed.ts`:
- Change number of events (default: 7)
- Modify Tokyo locations
- Update event titles/descriptions
- Adjust scheduling (default: weekly)

## Troubleshooting

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Regenerate Prisma client
npx prisma generate
```

### Database Issues

```bash
# Reset database (⚠️ deletes all data)
rm -f prisma/dev.db
npx prisma db push
npx tsx prisma/seed.ts
```

### TypeScript Errors

```bash
# Check for type errors
npm run type-check

# Regenerate Prisma types
npx prisma generate
```

## Support

For issues or questions:
1. Check [UI_PARITY_CHECKLIST.md](./UI_PARITY_CHECKLIST.md) for UI implementation details
2. Review existing documentation in `/docs`
3. Check Prisma schema for database structure

## License

This project was created for FriendMatch MVP.
