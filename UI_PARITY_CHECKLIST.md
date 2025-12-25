# UI Parity Checklist - RealRoots Design Implementation

This document explains how the RealRoots UI patterns from the reference screenshots have been implemented in the FriendMatch app.

## Design Tokens Implementation

### Colors
✅ **Background**: Warm off-white/light beige (`#FAF7F5`)
✅ **Cards**: White with subtle shadow
✅ **Primary CTA**: Black buttons with white text
✅ **Pastel Accents**: Pink, blue, green, yellow variants for different card types
✅ **Status Colors**: Red for unconfirmed, green for confirmed

**Implementation**: `tailwind.config.ts` - Extended theme with custom color palette

### Typography
✅ **Large Airy Headings**: 28px, 24px, 20px with generous line height
✅ **Medium-Weight Body**: 15px-17px with 1.6 line height
✅ **Japanese Font Stack**: Hiragino Kaku Gothic ProN, Hiragino Sans, Meiryo

**Implementation**: `tailwind.config.ts` - Custom fontSize tokens, `globals.css` - Font stack

### Spacing & Layout
✅ **Big Rounded Corners**: 20-24px for cards
✅ **Generous White Space**: Consistent padding and gaps
✅ **Subtle Borders**: 1px neutral borders
✅ **Light Shadows**: Subtle card elevation

**Implementation**: `tailwind.config.ts` - borderRadius and boxShadow tokens

## Component Library

### Buttons (`src/components/ui/Button.tsx`)
✅ Primary: Black background, white text, full-width option
✅ Secondary: Light gray background
✅ Outline: Border with transparent background
✅ Ghost: Minimal styling for subtle actions

### Cards (`src/components/ui/Card.tsx`)
✅ Standard Card: White background, rounded-card (20px), subtle shadow
✅ HeroCard: Image with gradient overlay support
✅ SectionCard: Card with title and optional badge
✅ Padding variants: none, sm, md, lg

### Badges (`src/components/ui/Badge.tsx`)
✅ Pill shape with rounded-pill (999px)
✅ DateBadge: Overlays on images showing "1月7日"
✅ StatusBadge: Red "未確認", green "確認済み"
✅ FilterBadge: With count bubble

### EventCard (`src/components/ui/EventCard.tsx`)
✅ Hero image with date badge overlay
✅ Title, description (2 lines max)
✅ Meta row with time + location icons
✅ Rounded corners with hover shadow effect

### Timeline (`src/components/ui/Timeline.tsx`)
✅ Vertical line with circle/lock icons
✅ Active item with filled background
✅ Locked items with lock icon
✅ Date format: "1月7日(水)"

### AvatarStack (`src/components/ui/AvatarStack.tsx`)
✅ Overlapping avatars with "+N" bubble
✅ Initials fallback for missing photos
✅ White border for separation

### BottomTabBar (`src/components/layout/BottomTabBar.tsx`)
✅ 5 tabs: Home, Explore, Chat, Perks, Profile
✅ Line icons with labels
✅ Active state darker with thicker stroke
✅ Safe area inset support

## Screen Implementations

### A) Explore (Event List) - `/app/explore`
✅ Header: "探す"
✅ Filter controls: FilterBadge with count, Reset button
✅ Event cards in vertical list
  - Hero image with rounded corners
  - Date badge overlay (top-left)
  - Title, description (2 lines)
  - Time + location meta row
✅ Tapping card navigates to detail

**File**: `src/app/app/explore/page.tsx`

### B) Home Screen - `/app`
✅ Greeting: "こんにちは、{nickname}"
✅ Upcoming event hero card
  - Image with gradient
  - Title overlay
  - Location + date/time at bottom
✅ "日程が合わない？" light bar card
✅ Personality test section
  - "無料" badge
  - Pastel card background
  - "診断する" button
✅ Action cards
  - "参加確認" with "未確認" badge
  - "自己紹介を追加"
  - "友だちを招待（無料）"

**File**: `src/app/app/page.tsx`

### C) Event Detail - `/app/events/[id]`
✅ App bar: Back arrow, status pill on right
✅ Hero image with date badge
✅ Title + description
✅ Meta row (time + location icons)
✅ "参加済み" section with avatar stack
✅ "詳細" section with long text
✅ Bottom sticky CTA
  - "参加を確定する" (primary)
  - "日程変更" (secondary)

**File**: `src/app/app/events/[id]/page.tsx`

### D) Experiences/Series Timeline - `/app/experiences`
✅ Title: "体験プラン"
✅ Vertical timeline with circles and locks
✅ Active item filled light beige
✅ Locked items white with lock icon
✅ Date format: "1月7日(水)"
✅ Subtitle: Event type

**File**: `src/app/app/experiences/page.tsx`

### E) Grads/Membership Perks - `/app/grads`
✅ Header: "特典" + "✨ 会員限定" pill
✅ Subtitle: "シリーズ完走後のコミュニティ特典"
✅ Price line: "年額 ¥xx,xxx｜いつでも解約"
✅ Perk cards alternating:
  - Photo cards with hero images
  - Illustration cards with pastel backgrounds
  - Title + description
✅ Bottom fixed CTA: "年額プランに参加する"
✅ Modal: "近日公開" for MVP

**File**: `src/app/app/grads/page.tsx`

### F) Chat - `/app/chat`
✅ List of group chats
✅ Chat bubbles UI
  - Own messages: Black background, white text (right-aligned)
  - Other messages: White background, border (left-aligned)
✅ Time stamps below messages
✅ Report button in header
✅ Input with send button

**Files**: `src/app/app/chat/page.tsx`, `src/app/app/chat/[id]/page.tsx`

### G) Profile/Settings - `/app/profile`
✅ Profile card with avatar
✅ Verification status card
  - Status badge
  - Upload UI for unverified users
✅ Language toggle (JP/EN)
  - Globe icon
  - Current language shown
✅ "利用ガイドライン" link
✅ Logout button (red text)

**File**: `src/app/app/profile/page.tsx`

## Admin Screens

### Admin Dashboard - `/admin`
✅ Grid of admin sections
✅ Icon cards for different functions
✅ Badge count for pending items
✅ Links to event series, verifications, users, analytics

**File**: `src/app/admin/page.tsx`

### Event Series Creation - `/admin/series/create`
✅ Form for series info
✅ Multiple event inputs
✅ Add/remove events dynamically
✅ Date + time pickers
✅ Bottom action bar with cancel/submit

**File**: `src/app/admin/series/create/page.tsx`

### Photo Verification - `/admin/verifications`
✅ List of pending verifications
✅ User info cards
✅ Image preview thumbnails (ID, selfie, profile photo)
✅ "詳細を確認して審査" button

### Verification Review - `/admin/verifications/[userId]`
✅ User information display
✅ Three image sections:
  - ID image
  - Selfie
  - Profile photo for gender verification
✅ Checklist card
✅ Bottom action bar: Reject / Approve
✅ Reject modal with reason input

**Files**: `src/app/admin/verifications/page.tsx`, `src/app/admin/verifications/[userId]/page.tsx`

## Localization (i18n)

✅ Default language: Japanese
✅ EN toggle in settings
✅ Date formats:
  - Badge: "1月7日"
  - List: "2026年1月7日・18:30"
  - Weekday: "1月7日(水)"
✅ Natural Japanese copy (not stiff)
✅ Translation dictionary in `src/lib/i18n.ts`
✅ Context provider in `src/contexts/LocaleContext.tsx`

## Mobile-First & Responsive

✅ Bottom tab bar for mobile navigation
✅ Safe area inset support
✅ Touch-friendly button sizes (min 44px)
✅ Responsive grid layouts
✅ Max-width containers (screen-xl)
✅ Proper text truncation and line clamping

## Iconography

✅ Lucide React icons throughout
✅ Consistent stroke width (2 for active, 1.5-2 for inactive)
✅ Icon sizing: 16px (sm), 20px (md), 24px (lg)
✅ Icons paired with labels for clarity

## Performance

✅ Static generation where possible
✅ Image optimization ready (public folder structure)
✅ Skeleton loaders structure (can be added)
✅ Fast build times
✅ Minimal JavaScript bundle

## Database & Seeding

✅ Prisma schema with event series support
✅ Verification with photo field for gender check
✅ Seed script creates:
  - Admin user
  - 10 demo users
  - Event series with 7 events
  - Tokyo locations (渋谷, 新宿, 恵比寿, 六本木, 吉祥寺, etc.)
  - Sample chat messages
  - RSVPs and enrollments

## Not Implemented (Future Work)

⏳ Actual authentication system (magic link or OAuth)
⏳ Real image uploads (currently mock UI)
⏳ Actual payment integration (Stripe/Square)
⏳ Real-time chat with WebSocket
⏳ Push notifications
⏳ Email notifications
⏳ Advanced matching algorithm
⏳ Analytics dashboard
⏳ Automated testing

## Summary

The implementation successfully replicates the RealRoots UI design language with:
- ✅ Warm, inviting color palette
- ✅ Large rounded cards with subtle shadows
- ✅ Japanese-first localization with EN toggle
- ✅ Mobile-first bottom tab navigation
- ✅ Comprehensive component library
- ✅ All major screens implemented
- ✅ Admin interfaces for event series and verification
- ✅ Seeded data for immediate testing

The app is now runnable end-to-end with seed data and maintains strong UI parity with the reference design.
