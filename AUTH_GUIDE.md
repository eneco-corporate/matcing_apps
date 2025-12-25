# Authentication Guide

Complete guide to the authentication system in FriendMatch.

## Overview

The app uses a simple email/password authentication system with session-based cookies. Sessions are stored using the existing `MagicLink` table (repurposed for session management).

## User Flow

### Registration
1. User visits `/auth/register`
2. Fills out form: nickname, email, birth year, password
3. System validates:
   - Email uniqueness
   - Password strength (8+ characters)
   - Age requirement (18+)
   - Password confirmation match
4. Creates user account with:
   - Profile (nickname, birth year)
   - Verification record (status: UNVERIFIED)
   - Default preferences
5. Auto-creates session and redirects to `/app`

### Login
1. User visits `/auth/login`
2. Enters email and password
3. System verifies credentials
4. Creates session cookie
5. Redirects to `/app`

### Logout
1. User clicks logout in `/app/profile`
2. System deletes session cookie
3. Redirects to home page

## API Endpoints

### POST /api/auth/register

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "secure123",
  "nickname": "Yuki",
  "birthYear": "1995"
}
```

**Response (Success):**
```json
{
  "success": true,
  "user": {
    "id": "cuid...",
    "email": "user@example.com"
  }
}
```

**Response (Error):**
```json
{
  "error": "このメールアドレスは既に登録されています"
}
```

**Status Codes:**
- 200: Success
- 400: Validation error
- 409: Email already exists
- 500: Server error

### POST /api/auth/login

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "secure123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "user": {
    "id": "cuid...",
    "email": "user@example.com",
    "nickname": "Yuki"
  }
}
```

**Response (Error):**
```json
{
  "error": "メールアドレスまたはパスワードが正しくありません"
}
```

**Status Codes:**
- 200: Success
- 400: Missing fields
- 401: Invalid credentials
- 403: Account inactive
- 500: Server error

### POST /api/auth/logout

**Response:**
Redirects to `/`

## Session Management

### Cookie Details
- **Name**: `session_token`
- **Duration**: 30 days
- **HttpOnly**: true (JavaScript cannot access)
- **Secure**: true in production
- **SameSite**: lax (CSRF protection)
- **Path**: /

### Session Storage
Sessions are stored in the `MagicLink` table:
- `token`: Session cookie value
- `userId`: Associated user ID
- `expiresAt`: Session expiration
- `used`: Always true for session cookies

### Helper Functions (`src/lib/auth.ts`)

```typescript
// Get current logged-in user
const user = await getSession();

// Require authentication (throws if not logged in)
const user = await requireAuth();

// Require verified user
const user = await requireVerified();

// Require admin access
const user = await requireAdmin();

// Create new session
await createSession(userId);

// Log out (delete session)
await logout();

// Hash password
const hash = await hashPassword('password');

// Verify password
const isValid = await verifyPassword('password', hash);
```

## Security Features

### Password Security
- Minimum 8 characters required
- Hashed using bcryptjs (10 rounds)
- Never stored or transmitted in plain text
- Confirmation required during registration

### Session Security
- HTTP-only cookies prevent XSS attacks
- Secure flag in production (HTTPS only)
- SameSite=lax prevents CSRF
- 30-day expiration
- Token stored securely in database

### Data Validation
- Email format validation
- Age verification (18+)
- Password strength requirements
- Email uniqueness checks
- XSS prevention through React escaping

## Test Accounts

Seeded test accounts for development:

```
Admin:
  Email: admin@friendmatch.app
  Password: admin123

Regular Users:
  Email: yuki@example.com
  Password: password123

  Email: sakura@example.com
  Password: password123
```

## Usage in Components

### Client Components

```typescript
'use client';

async function handleLogin(email: string, password: string) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (response.ok) {
    window.location.href = '/app';
  }
}
```

### Server Components

```typescript
import { getSession, requireAuth } from '@/lib/auth';

export default async function ProtectedPage() {
  // Optional: Get user if logged in
  const user = await getSession();

  // Required: Throw if not logged in
  const user = await requireAuth();

  // Required: Throw if not admin
  const admin = await requireAdmin();

  return <div>Welcome {user.email}</div>;
}
```

### API Routes

```typescript
import { requireAuth } from '@/lib/auth';

export async function POST(request: Request) {
  // Verify user is logged in
  const user = await requireAuth();

  // Use user.id, user.email, user.role
  // ...
}
```

## Future Enhancements

### Recommended Additions

1. **Password Reset**
   - Email-based password reset flow
   - Temporary reset tokens
   - Link expiration

2. **Email Verification**
   - Send verification email on registration
   - Verify email before full access
   - Resend verification option

3. **OAuth Integration**
   - Google Sign-In
   - Apple Sign-In
   - Social login options

4. **Two-Factor Authentication**
   - TOTP (Google Authenticator)
   - SMS verification
   - Backup codes

5. **Session Management**
   - View active sessions
   - Revoke specific sessions
   - "Log out all devices"

6. **Rate Limiting**
   - Prevent brute force attacks
   - Login attempt limits
   - IP-based throttling

7. **Security Events**
   - Login notifications
   - Suspicious activity alerts
   - Account recovery options

## Troubleshooting

### User Can't Log In
1. Verify email is correct
2. Check password is at least 8 characters
3. Ensure account status is ACTIVE
4. Check session cookie is being set
5. Verify browser allows cookies

### Session Expires Immediately
1. Check cookie settings (HttpOnly, Secure)
2. Verify expiresAt is in the future
3. Ensure domain/path matches
4. Check for cookie conflicts

### Registration Fails
1. Verify email is unique
2. Check password meets requirements
3. Ensure birth year makes user 18+
4. Check database connection
5. Review validation errors

## Database Schema

### User Table
```prisma
model User {
  id            String   @id @default(cuid())
  email         String   @unique
  passwordHash  String?
  role          String   @default("USER")
  status        String   @default("ACTIVE")
  emailVerified Boolean  @default(false)
  // ... relations
}
```

### Session Storage (MagicLink)
```prisma
model MagicLink {
  id        String   @id @default(cuid())
  userId    String
  token     String   @unique
  expiresAt DateTime
  used      Boolean  @default(false)
  // ... relations
}
```

## Migration from No-Auth

If your app previously had no authentication:

1. All existing users need to set passwords
2. Add password reset flow for migration
3. Send email to all users with setup link
4. Gracefully handle null passwordHash

## Production Checklist

Before deploying to production:

- [ ] Enable HTTPS
- [ ] Set secure cookie flag
- [ ] Use strong SESSION_SECRET
- [ ] Implement rate limiting
- [ ] Add email verification
- [ ] Set up password reset
- [ ] Configure CORS properly
- [ ] Add login monitoring
- [ ] Implement account lockout
- [ ] Set up security alerts

## Support

For authentication-related issues:
1. Check browser console for errors
2. Verify API responses in Network tab
3. Check server logs for auth failures
4. Review cookie settings in DevTools
5. Test with incognito mode
