# FriendMatch MVP - Architecture Documentation

## System Overview

FriendMatch is a server-rendered Next.js application using the App Router pattern with TypeScript and Tailwind CSS. The application follows a traditional monolithic architecture optimized for rapid MVP development.

```
┌─────────────────────────────────────────────────────────┐
│                     Browser (Client)                     │
│  - React Components (Server & Client)                   │
│  - Tailwind CSS Styling                                 │
└─────────────────┬───────────────────────────────────────┘
                  │ HTTP/HTTPS
┌─────────────────▼───────────────────────────────────────┐
│              Next.js App Router (Server)                │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Pages (Server Components)                       │   │
│  │  - Landing, Auth, Dashboard, Events, Admin      │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │  API Routes                                      │   │
│  │  - Authentication, RSVP, Verification, Admin    │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Business Logic Layer                           │   │
│  │  - Auth (lib/auth.ts)                           │   │
│  │  - Matching Algorithm (lib/matching.ts)         │   │
│  │  - Email (lib/email.ts)                         │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────┬───────────────────────────────────────┘
                  │ Prisma ORM
┌─────────────────▼───────────────────────────────────────┐
│                  SQLite Database                        │
│  - Users, Groups, Events, Messages, Reports             │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│                  Local File System                      │
│  - Verification uploads (ID images, selfies)            │
└─────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3
- **Components**: Custom React components (no UI library)
- **Forms**: Native HTML forms with server actions
- **State**: React hooks (useState, useEffect) for client components

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Next.js API Routes
- **Authentication**: Custom JWT sessions + magic links
- **ORM**: Prisma 5
- **Database**: SQLite (dev), PostgreSQL-ready
- **Email**: Nodemailer
- **File Upload**: Multipart form data → local filesystem

### Development
- **Package Manager**: npm
- **Type Checking**: TypeScript strict mode
- **Linting**: ESLint
- **Git**: Version control

## Directory Structure Explained

```
friendmatch-mvp/
├── prisma/
│   ├── schema.prisma          # Database schema (16 models)
│   ├── seed.ts               # Sample data for development
│   └── dev.db                # SQLite database file (gitignored)
│
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── layout.tsx       # Root layout with global styles
│   │   ├── page.tsx         # Landing page
│   │   │
│   │   ├── auth/            # Authentication
│   │   │   ├── page.tsx     # Login/signup form
│   │   │   └── verify/      # Magic link verification
│   │   │
│   │   ├── onboarding/      # Multi-step onboarding
│   │   │   └── page.tsx     # 4-step form with state management
│   │   │
│   │   ├── dashboard/       # User dashboard
│   │   │   └── page.tsx     # Server component with data fetching
│   │   │
│   │   ├── events/[id]/     # Dynamic event pages
│   │   │   └── page.tsx     # Event details, RSVP, prompts
│   │   │
│   │   ├── groups/[id]/     # Group pages (to be implemented)
│   │   ├── chat/[threadId]/ # Group chat (to be implemented)
│   │   │
│   │   ├── settings/        # User settings
│   │   │   ├── page.tsx     # Settings overview
│   │   │   └── verification/ # Verification upload
│   │   │
│   │   ├── admin/           # Admin panel
│   │   │   ├── page.tsx     # Admin dashboard with stats
│   │   │   ├── users/       # User management
│   │   │   ├── groups/      # Group management
│   │   │   └── reports/     # Report moderation
│   │   │
│   │   └── api/             # API routes
│   │       ├── auth/        # Authentication endpoints
│   │       ├── onboarding/  # Profile creation
│   │       ├── verification/ # ID upload & approval
│   │       ├── events/      # Event RSVP
│   │       └── admin/       # Admin actions
│   │
│   ├── components/          # Reusable UI components
│   │   ├── Button.tsx       # Primary/secondary/outline/danger variants
│   │   ├── Card.tsx         # Container with shadow and padding
│   │   ├── Modal.tsx        # Accessible modal with backdrop
│   │   ├── Stepper.tsx      # Multi-step progress indicator
│   │   ├── SafetyBanner.tsx # Safety guidelines display
│   │   ├── Input.tsx        # Form input with label and error
│   │   └── TagPicker.tsx    # Multi-select tag component
│   │
│   └── lib/                 # Utility libraries
│       ├── prisma.ts        # Singleton Prisma client
│       ├── auth.ts          # Session management, guards
│       ├── email.ts         # Email sending utilities
│       └── matching.ts      # Compatibility algorithm
│
├── public/                  # Static assets (images, fonts)
├── uploads/                 # User-uploaded files (gitignored)
│   └── verification/
│       └── [userId]/
│           ├── id_*.jpg
│           └── selfie_*.jpg
│
├── .env                     # Environment variables
├── .env.example            # Template for .env
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── tailwind.config.ts      # Tailwind customization
├── next.config.js          # Next.js configuration
├── README.md               # Project documentation
├── SETUP.md                # Setup instructions
└── ARCHITECTURE.md         # This file
```

## Data Flow Patterns

### 1. Server Component Data Fetching

Most pages use Server Components for optimal performance:

```typescript
// src/app/dashboard/page.tsx
export default async function DashboardPage() {
  const user = await requireAuth();  // Server-side auth check

  const groups = await prisma.group.findMany({
    where: { members: { some: { userId: user.id } } },
    include: { events: true }
  });

  return <div>{/* Render with data */}</div>;
}
```

**Benefits**:
- No client-side loading state
- SEO-friendly
- Smaller JavaScript bundle
- Direct database access

### 2. Form Submission with Server Actions

```typescript
// Client Component
'use client';
export default function OnboardingPage() {
  const handleSubmit = async () => {
    const res = await fetch('/api/onboarding', {
      method: 'POST',
      body: JSON.stringify(formData)
    });
    // Handle response
  };
}

// API Route (Server)
export async function POST(request: NextRequest) {
  const user = await requireAuth();
  const data = await request.json();
  await prisma.profile.create({ data: { ...data, userId: user.id } });
  return NextResponse.json({ success: true });
}
```

### 3. File Upload Pattern

```typescript
// Client: FormData submission
const formData = new FormData();
formData.append('idImage', file);

await fetch('/api/verification/submit', {
  method: 'POST',
  body: formData  // No Content-Type header (automatic multipart)
});

// Server: File handling
const formData = await request.formData();
const file = formData.get('idImage') as File;
const buffer = Buffer.from(await file.arrayBuffer());
await writeFile(path, buffer);
```

## Authentication Flow

### Magic Link Flow

```
1. User enters email
   ↓
2. POST /api/auth/magic-link
   ↓
3. Create MagicLink record with token
   ↓
4. Send email (or log to console in dev)
   ↓
5. User clicks link: /auth/verify?token=xxx
   ↓
6. Server verifies token, marks as used
   ↓
7. Create session cookie
   ↓
8. Redirect to dashboard
```

### Password Flow

```
1. User enters email + password
   ↓
2. POST /api/auth/password
   ↓
3. Hash password with bcrypt
   ↓
4. Create/verify User record
   ↓
5. Create session token
   ↓
6. Set HTTP-only cookie
   ↓
7. Return success → client redirects
```

### Session Management

```typescript
// Creating session
const token = crypto.randomBytes(32).toString('hex');
cookies().set('session_token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  path: '/',
});

// Checking session
const token = cookies().get('session_token')?.value;
const session = await prisma.magicLink.findUnique({
  where: { token },
  include: { user: true }
});

// Guards
export async function requireAuth() {
  const user = await getSession();
  if (!user) throw new Error('Unauthorized');
  return user;
}

export async function requireVerified() {
  const user = await requireAuth();
  if (user.verification?.status !== 'VERIFIED') {
    throw new Error('Verification required');
  }
  return user;
}

export async function requireAdmin() {
  const user = await requireAuth();
  if (user.role !== 'ADMIN') {
    throw new Error('Admin access required');
  }
  return user;
}
```

## Matching Algorithm Deep Dive

### Scoring System

Located in [src/lib/matching.ts](src/lib/matching.ts:21)

```typescript
async function calculateCompatibilityScore(
  user1: UserWithPreference,
  user2: UserWithPreference
): Promise<number> {
  let score = 0;
  const maxScore = 100;

  // 1. Age (20 points)
  if (withinPreferredRange) score += 20;
  else if (within5Years) score += 10;

  // 2. Area overlap (15 points)
  score += min(15, areaOverlap * 5);

  // 3. Time availability (15 points)
  score += min(15, timeOverlap * 3);

  // 4. Interests (20 points)
  score += min(20, interestOverlap * 4);

  // 5. Lifestyle (15 points)
  if (drinkingMatch) score += 5;
  if (smokingMatch) score += 5;
  if (conversationMatch) score += 5;

  // 6. Quiet mode (10 points)
  if (quietModeMatch) score += 10;

  // 7. Boundaries (5 points)
  if (boundariesRespected) score += 5;

  return min(maxScore, score);
}
```

### Group Formation Algorithm

```typescript
async function runMatchingAlgorithm(minSize = 4, maxSize = 6) {
  // 1. Get all available verified users
  const users = await prisma.user.findMany({
    where: {
      verification: { status: 'VERIFIED' },
      groupMemberships: { none: { isActive: true } }
    }
  });

  // 2. Greedy matching
  const matched = new Set();
  const groups = [];

  for (const user of users) {
    if (matched.has(user.id)) continue;

    // 3. Find best matches for this user
    const matches = await findMatchesForUser(user.id);

    // 4. Form group
    const members = [user.id];
    for (const match of matches) {
      if (members.length >= maxSize) break;
      if (!matched.has(match.userId)) {
        members.push(match.userId);
      }
    }

    // 5. Create group if meets minimum size
    if (members.length >= minSize) {
      const groupId = await createGroupFromMatches(members);
      groups.push(groupId);
      members.forEach(id => matched.add(id));
    }
  }

  return { groups, waitlisted: users.length - matched.size };
}
```

### Extending the Algorithm

To add ML-based matching:

```typescript
// 1. Collect training data
const trainingData = await prisma.feedback.findMany({
  include: {
    user: { include: { preferences: true } },
    event: {
      include: {
        group: {
          include: {
            members: {
              include: {
                user: { include: { preferences: true } }
              }
            }
          }
        }
      }
    }
  }
});

// 2. Extract features
const features = trainingData.map(feedback => ({
  ageGap: calculateAgeGap(feedback.user, feedback.event.group.members),
  areaOverlap: calculateAreaOverlap(...),
  interestOverlap: calculateInterestOverlap(...),
  // ... etc
  label: feedback.wantToContinue ? 1 : 0  // Target variable
}));

// 3. Train model (using external ML library)
const model = trainModel(features);

// 4. Use in scoring
async function calculateCompatibilityScore(user1, user2) {
  const features = extractFeatures(user1, user2);
  return model.predict(features) * 100;  // Scale to 0-100
}
```

## Database Schema Relationships

### Core Entity Relationships

```
User (1) ──────── (1) Profile
  │
  ├─────────────── (1) Verification
  │
  ├─────────────── (1) Preference
  │
  ├─────────────── (*) GroupMember
  │                      │
  │                      └── (*) Group
  │                             │
  │                             ├── (*) Event
  │                             │      │
  │                             │      ├── (*) RSVP
  │                             │      │
  │                             │      ├── (*) Feedback
  │                             │      │
  │                             │      └── (*) EventPromptAssignment
  │                             │                │
  │                             │                └── (*) PromptCard
  │                             │
  │                             └── (*) ChatThread
  │                                       │
  │                                       └── (*) Message
  │
  ├─────────────── (*) Report (as reporter)
  │
  ├─────────────── (*) Report (as reported user)
  │
  └─────────────── (*) MagicLink
```

### Key Indexes

```prisma
// User lookups
@@index([email])
@@index([status])

// Verification filtering
@@index([userId])
@@index([status])

// Group queries
@@index([groupId])
@@index([status])

// Event queries
@@index([scheduledAt])
@@index([status])

// Chat pagination
@@index([threadId])
@@index([createdAt])

// Reports
@@index([status])
@@index([category])
```

## Security Considerations

### 1. Authentication

- **Session Tokens**: 32-byte random hex (cryptographically secure)
- **Password Hashing**: bcrypt with salt rounds = 10
- **Cookie Settings**:
  - `httpOnly: true` (XSS protection)
  - `secure: true` in production (HTTPS only)
  - `sameSite: 'lax'` (CSRF protection)
  - `path: '/'` (site-wide)

### 2. Authorization

```typescript
// Page-level guards
const user = await requireAuth();        // Any authenticated user
const user = await requireVerified();    // Verified users only
const user = await requireAdmin();       // Admins only

// Resource-level checks
const isMember = group.members.some(m => m.userId === user.id);
if (!isMember) throw new Error('Forbidden');
```

### 3. Input Validation

```typescript
// API routes
const { email, password } = await request.json();

if (!email || !isValidEmail(email)) {
  return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
}

if (password.length < 8) {
  return NextResponse.json({ error: 'Password too short' }, { status: 400 });
}

// Use Zod for complex validation
import { z } from 'zod';

const schema = z.object({
  nickname: z.string().min(1).max(50),
  birthYear: z.number().min(1950).max(2010),
  interests: z.array(z.string()).max(5),
});

const validated = schema.parse(data);  // Throws if invalid
```

### 4. SQL Injection

Prisma provides automatic parameterization:

```typescript
// SAFE - Prisma escapes all inputs
await prisma.user.findMany({
  where: { email: userInput }  // Automatically parameterized
});

// NEVER do raw SQL with user input
// UNSAFE: await prisma.$queryRaw`SELECT * FROM users WHERE email = ${userInput}`
```

### 5. File Upload Security

```typescript
// Validate file type
const allowedTypes = ['image/jpeg', 'image/png'];
if (!allowedTypes.includes(file.type)) {
  throw new Error('Invalid file type');
}

// Validate file size
if (file.size > 5 * 1024 * 1024) {  // 5MB
  throw new Error('File too large');
}

// Use random filenames
const filename = `${crypto.randomUUID()}.${ext}`;

// Store outside public directory
const path = `/uploads/verification/${userId}/${filename}`;
// NOT /public/uploads/...
```

## Performance Optimizations

### 1. Database Query Optimization

```typescript
// BAD - N+1 query problem
const groups = await prisma.group.findMany();
for (const group of groups) {
  const members = await prisma.groupMember.findMany({
    where: { groupId: group.id }
  });
}

// GOOD - Single query with include
const groups = await prisma.group.findMany({
  include: {
    members: {
      include: {
        user: {
          include: {
            profile: true
          }
        }
      }
    }
  }
});
```

### 2. Server Component Caching

```typescript
// Revalidate every hour
export const revalidate = 3600;

export default async function DashboardPage() {
  const data = await fetchData();  // Cached for 1 hour
  return <div>{/* ... */}</div>;
}
```

### 3. Image Optimization

```typescript
import Image from 'next/image';

<Image
  src="/profile.jpg"
  width={200}
  height={200}
  alt="Profile"
  loading="lazy"  // Lazy load images
  quality={85}     // Optimize quality
/>
```

## Error Handling

### API Routes

```typescript
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    // ... business logic
    return NextResponse.json({ success: true });
  } catch (error: any) {
    // Known errors
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Please log in' }, { status: 401 });
    }

    // Unknown errors
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
```

### Client Components

```typescript
const [error, setError] = useState('');

try {
  const res = await fetch('/api/endpoint');
  if (!res.ok) {
    const data = await res.json();
    setError(data.error || 'An error occurred');
    return;
  }
  // Success
} catch (err) {
  setError('Network error. Please try again.');
}
```

## Testing Strategy

### Unit Tests (Future)

```typescript
// lib/matching.test.ts
describe('calculateCompatibilityScore', () => {
  it('returns 100 for perfect match', () => {
    const user1 = createMockUser({ age: 25, interests: ['yoga'] });
    const user2 = createMockUser({ age: 26, interests: ['yoga'] });
    expect(calculateCompatibilityScore(user1, user2)).toBe(100);
  });
});
```

### Integration Tests (Future)

```typescript
// app/api/auth/password.test.ts
describe('POST /api/auth/password', () => {
  it('creates new user on signup', async () => {
    const res = await fetch('/api/auth/password', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
        mode: 'signup'
      })
    });
    expect(res.status).toBe(200);
    const user = await prisma.user.findUnique({
      where: { email: 'test@example.com' }
    });
    expect(user).not.toBeNull();
  });
});
```

## Deployment Architecture

### Production Recommendations

```
┌─────────────────────────────────────────────────────────┐
│                  Vercel / Netlify                        │
│  - Next.js hosting                                       │
│  - Edge functions                                        │
│  - CDN for static assets                                │
└─────────────────┬───────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────┐
│            PostgreSQL (Supabase / Railway)              │
│  - Production database                                  │
│  - Automated backups                                    │
│  - Connection pooling                                   │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│               S3 / Google Cloud Storage                 │
│  - User uploads (ID, selfies)                           │
│  - Image optimization                                   │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│               SendGrid / Postmark                       │
│  - Transactional emails                                 │
│  - Magic links                                          │
└─────────────────────────────────────────────────────────┘
```

## Monitoring & Observability

### Logging

```typescript
// Structured logging
console.log(JSON.stringify({
  level: 'info',
  message: 'User logged in',
  userId: user.id,
  timestamp: new Date().toISOString(),
}));

// Error tracking (integrate Sentry)
import * as Sentry from '@sentry/nextjs';

try {
  // ...
} catch (error) {
  Sentry.captureException(error);
  throw error;
}
```

### Metrics

```typescript
// Track key metrics
await trackEvent('user_signup', { userId: user.id });
await trackEvent('group_created', { groupId: group.id, size: members.length });
await trackEvent('event_rsvp', { eventId: event.id, userId: user.id });
```

## Future Extensions

### 1. Real-time Chat

```typescript
// Use Socket.io or Pusher
import { Server } from 'socket.io';

const io = new Server(server);

io.on('connection', (socket) => {
  socket.on('join_thread', (threadId) => {
    socket.join(threadId);
  });

  socket.on('send_message', async (data) => {
    const message = await prisma.message.create({ data });
    io.to(data.threadId).emit('new_message', message);
  });
});
```

### 2. Push Notifications

```typescript
// Use Firebase Cloud Messaging
import admin from 'firebase-admin';

await admin.messaging().send({
  token: user.fcmToken,
  notification: {
    title: '新しいイベント',
    body: '次のイベントが予定されています',
  },
  data: {
    eventId: event.id,
  },
});
```

### 3. Payment Integration

```typescript
// Stripe integration
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const session = await stripe.checkout.sessions.create({
  line_items: [{
    price: 'price_xxx',
    quantity: 1,
  }],
  mode: 'payment',
  success_url: `${baseUrl}/events/${eventId}?success=true`,
  cancel_url: `${baseUrl}/events/${eventId}?canceled=true`,
});
```

## Conclusion

This architecture is designed for:
- **Rapid MVP development**: Minimal dependencies, clear patterns
- **Type safety**: TypeScript throughout
- **Scalability**: Easy to migrate to PostgreSQL, add Redis caching
- **Maintainability**: Clear separation of concerns, documented patterns
- **Security**: Authentication, authorization, input validation built-in
- **Extensibility**: Well-structured for adding features

The monolithic approach is appropriate for MVP scale. As the application grows, consider:
- Microservices for matching algorithm (compute-heavy)
- Separate service for file storage/processing
- CDN for static assets and images
- Redis for caching and sessions
- Message queue for async jobs (matching, emails)
