# FriendMatch MVP - Setup Guide

## Quick Start (5 minutes)

Follow these steps to get the application running locally:

### Step 1: Install Dependencies

```bash
npm install
```

This will install all required packages including Next.js, Prisma, TypeScript, and Tailwind CSS.

### Step 2: Setup Database

```bash
# Generate Prisma client
npm run db:generate

# Create database and tables
npm run db:push
```

This creates a SQLite database file at `prisma/dev.db` with all necessary tables.

### Step 3: Seed Sample Data

```bash
npm run db:seed
```

This creates:
- An admin account (`admin@friendmatch.app` / `admin123`)
- 5 sample users (all password: `password123`)
- A sample group with 4 members
- A scheduled event with RSVPs
- Conversation prompts
- Sample chat messages

### Step 4: Start Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Step 5: Login and Explore

Try logging in with:
- **Admin**: `admin@friendmatch.app` / `admin123`
- **User**: `yuki@example.com` / `password123`

## What You'll See

### As a Regular User (yuki@example.com)

1. **Dashboard**: Shows your active group and upcoming events
2. **Group View**: See your cohort members and compatibility
3. **Event Details**: View event info, RSVP, and conversation prompts
4. **Profile Settings**: Update preferences and verification status

### As an Admin (admin@friendmatch.app)

1. **Admin Panel**: `/admin`
2. **User Management**: View all users and verification status
3. **Matching Control**: Manually trigger the matching algorithm
4. **Reports**: Review and moderate user reports

## Key Features to Test

### 1. New User Registration

```
1. Go to http://localhost:3000
2. Click "始める" (Get Started)
3. Choose signup and enter email/password
4. Complete 4-step onboarding:
   - Basic info (nickname, birth year)
   - Interests (select up to 5)
   - Lifestyle preferences
   - Matching settings (age, areas, times)
5. Upload verification documents
```

### 2. Matching Algorithm

```
As admin:
1. Login as admin
2. Go to /admin
3. Click "マッチング実行" (Run Matching)
4. Check console for results
5. New groups will be created based on compatibility scores
```

### 3. Event RSVP Flow

```
1. Login as verified user
2. Go to Dashboard
3. Click on an upcoming event
4. Click "参加する" (Join)
5. Access group chat (unlocked after RSVP)
6. Check-in at event time
```

### 4. Admin Verification

```
As admin:
1. Go to /admin
2. Click "本人確認審査" (Verification Review)
3. Review pending submissions
4. Approve or reject with reason
```

## Database Schema Overview

### User Journey Tables
- `User` → `Profile` → `Verification` → `Preference`
- User creates profile, submits verification, sets preferences

### Matching Flow
- `Preference` → **Matching Algorithm** → `Group` → `GroupMember`
- Algorithm scores compatibility and creates groups

### Event Flow
- `Group` → `Event` → `RSVP` → `Feedback`
- Groups have weekly events, users RSVP and provide feedback

### Communication
- `Group` → `ChatThread` → `Message`
- Each group has a chat thread for logistics

### Safety
- `Report` → Admin review → `AdminAuditLog`
- Users can report issues, admins moderate

## Customization Guide

### 1. Modify Matching Algorithm

Edit `src/lib/matching.ts`:

```typescript
// Adjust scoring weights
const scores = {
  age: 20,        // Change to adjust age importance
  area: 15,       // Geographic proximity
  interests: 20,  // Shared interests
  // ... etc
};
```

### 2. Add New Interests/Areas

Edit `src/app/onboarding/page.tsx`:

```typescript
const INTEREST_OPTIONS = [
  'カフェ巡り',
  'Your New Interest',  // Add here
  // ...
];

const AREA_OPTIONS = [
  '新宿',
  'Your New Area',  // Add here
  // ...
];
```

### 3. Customize Email Templates

Edit `src/lib/email.ts`:

```typescript
export async function sendMagicLinkEmail(email: string, token: string) {
  // Modify HTML template here
}
```

### 4. Add New Prompt Cards

```typescript
// In seed script or admin panel
await prisma.promptCard.create({
  data: {
    titleJa: '新しいプロンプト',
    titleEn: 'New Prompt',
    promptJa: 'あなたの質問は？',
    promptEn: 'Your question?',
    weekNumber: 1,
    category: 'ICEBREAKER',
  },
});
```

## Development Tips

### View Database

```bash
npm run db:studio
```

Opens Prisma Studio at [http://localhost:5555](http://localhost:5555) - a GUI for viewing and editing database records.

### Reset Database

```bash
rm prisma/dev.db
npm run db:push
npm run db:seed
```

### Check TypeScript

```bash
npx tsc --noEmit
```

### Format Code

```bash
npx prettier --write .
```

## Troubleshooting

### Database Errors

**Problem**: `Can't reach database server`

**Solution**:
```bash
rm -rf node_modules
npm install
npm run db:generate
npm run db:push
```

### Port Already in Use

**Problem**: `Port 3000 is already in use`

**Solution**:
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- -p 3001
```

### Magic Link Not Working

**Problem**: Magic links not sending

**Solution**: Check console output - in MVP mode, magic links are logged to console instead of being emailed. Look for:
```
======================
MAGIC LINK EMAIL (MVP MODE)
======================
To: user@example.com
Link: http://localhost:3000/auth/verify?token=...
======================
```

### File Upload Errors

**Problem**: Verification uploads failing

**Solution**: Ensure uploads directory exists:
```bash
mkdir -p uploads/verification
chmod 755 uploads
```

## Production Checklist

Before deploying to production:

- [ ] Change `JWT_SECRET` in `.env` to a strong random string
- [ ] Set up real SMTP credentials for emails
- [ ] Use cloud storage (S3, GCS) instead of local filesystem
- [ ] Add rate limiting to API routes
- [ ] Set up proper error tracking (Sentry)
- [ ] Enable HTTPS and secure cookies
- [ ] Add CSRF protection
- [ ] Set up database backups
- [ ] Add monitoring and logging
- [ ] Configure CDN for static assets
- [ ] Add cron job for automated matching
- [ ] Review and update CORS settings
- [ ] Add input validation and sanitization
- [ ] Set up staging environment
- [ ] Write end-to-end tests

## Architecture Decisions

### Why SQLite for MVP?

- Zero configuration
- Perfect for development
- Easy to migrate to PostgreSQL later
- File-based makes testing simple

### Why Magic Links?

- Better security (no password to compromise)
- Simpler UX
- Email verification built-in
- Common in Japanese apps

### Why No Real-time Chat?

- MVP scope management
- Simpler implementation
- Reduces server costs
- Refresh to get new messages is acceptable for logistics

### Why Local File Storage?

- MVP simplicity
- No external dependencies
- Easy to migrate to S3/GCS later

## Next Steps

After getting comfortable with the MVP:

1. **Add Real-time Features**: WebSocket for chat
2. **Implement Payments**: Stripe for event fees
3. **Enhanced Matching**: ML-based recommendations
4. **Mobile App**: React Native version
5. **Notifications**: Push notifications for events
6. **Advanced Admin**: More moderation tools
7. **Analytics**: User engagement tracking
8. **A/B Testing**: Experiment framework
9. **Multi-language**: Full i18n support
10. **API**: Public API for integrations

## Support

For issues or questions:
- Check the [README.md](README.md) for general information
- Review the code comments in key files
- Inspect database schema in `prisma/schema.prisma`
- Use Prisma Studio to explore data

## License

Proprietary - All rights reserved
