# 🚀 FriendMatch MVP - Quick Start Guide

Get your women-only friendship matching app running in **5 minutes**.

## Prerequisites

- Node.js 18+ installed
- Terminal/Command Line access

## 🏃‍♀️ Fast Setup (Copy & Paste)

Open your terminal and run these commands:

```bash
# Navigate to project
cd /Users/natsukikomatsu/Documents/matcing_apps

# Install dependencies (1-2 minutes)
npm install

# Generate database client
npm run db:generate

# Create database and tables
npm run db:push

# Add sample data
npm run db:seed

# Start the app
npm run dev
```

## ✅ Verify It's Working

1. **Open your browser**: [http://localhost:3000](http://localhost:3000)

2. **You should see**: Beautiful landing page with "新しい友達との本物のつながり"

3. **Test login**:
   - Click "始める" (Get Started)
   - Email: `yuki@example.com`
   - Password: `password123`
   - Click login

4. **You should see**: User dashboard with sample group

## 👤 Test Accounts

### Regular User (Verified)
- **Email**: `yuki@example.com`
- **Password**: `password123`
- **Has**: Active group, upcoming event

### Admin User
- **Email**: `admin@friendmatch.app`
- **Password**: `admin123`
- **Access**: Admin panel at `/admin`

### Other Test Users
All have password: `password123`
- `sakura@example.com`
- `haruka@example.com`
- `mio@example.com`
- `aoi@example.com`

## 🎯 What to Try

### As Regular User (yuki@example.com)

1. **View Dashboard** → See your group and events
2. **View Event** → Click on upcoming event
3. **Settings** → Check verification status
4. **Profile** → See your interests and preferences

### As Admin (admin@friendmatch.app)

1. **Go to** `/admin`
2. **See Stats** → Total users, verified users, active groups
3. **Run Matching** → Click "マッチング実行" button
4. **View Users** → See all registered users

### Test Complete Flow

1. **Logout** (if logged in)
2. **Click** "始める"
3. **Signup** with new email
4. **Complete Onboarding** (4 steps):
   - Basic info (nickname, birth year)
   - Interests (select up to 5)
   - Lifestyle preferences
   - Matching settings
5. **Upload Verification** (ID + selfie)
6. **Wait for Admin Approval** (login as admin to approve)

## 🗂️ Project Structure

```
matcing_apps/
├── src/
│   ├── app/              ← All pages and API routes
│   ├── components/       ← Reusable UI components
│   └── lib/             ← Business logic
├── prisma/
│   ├── schema.prisma    ← Database models
│   └── seed.ts          ← Sample data
├── README.md            ← Full documentation
├── SETUP.md             ← Detailed setup guide
├── ARCHITECTURE.md      ← Technical deep dive
└── This file            ← Quick start
```

## 📱 Key Pages to Visit

| URL | Description | Login Required |
|-----|-------------|----------------|
| `/` | Landing page | No |
| `/auth` | Login/Signup | No |
| `/dashboard` | User dashboard | Yes |
| `/onboarding` | Profile setup | Yes |
| `/settings` | User settings | Yes |
| `/settings/verification` | ID upload | Yes |
| `/events/[id]` | Event details | Yes |
| `/admin` | Admin panel | Admin only |

## 🛠️ Useful Commands

```bash
# Start development server
npm run dev

# View database in GUI
npm run db:studio

# Reset database
rm prisma/dev.db
npm run db:push
npm run db:seed

# Check for errors
npm run lint

# Build for production
npm run build
npm start
```

## 🐛 Common Issues

### Port 3000 already in use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- -p 3001
```

### Database errors
```bash
# Clean rebuild
rm -rf node_modules prisma/dev.db
npm install
npm run db:generate
npm run db:push
npm run db:seed
```

### Can't login
- Make sure you ran `npm run db:seed`
- Check console for errors
- Try password reset flow

## 📚 Learn More

- **Features Overview**: See [README.md](README.md)
- **Setup Details**: See [SETUP.md](SETUP.md)
- **Architecture**: See [ARCHITECTURE.md](ARCHITECTURE.md)
- **Project Summary**: See [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)

## 🎉 What You Get

After following this quick start, you'll have:

✅ Full-featured friendship matching app running locally
✅ Sample users and groups to explore
✅ Admin panel to manage the platform
✅ Complete authentication system
✅ Working matching algorithm
✅ Event RSVP system
✅ Safety features (verification, reporting)
✅ Responsive mobile-friendly UI

## 🚢 Next Steps

1. **Explore the App** → Click around, test features
2. **Read Documentation** → Understand the architecture
3. **Customize** → Adjust interests, areas, prompts
4. **Deploy** → Follow production checklist in SETUP.md

## 💡 Pro Tips

- Use **Prisma Studio** (`npm run db:studio`) to view/edit database
- Check **console logs** for magic link tokens in development
- **Cmd/Ctrl + Click** on components to jump to definition
- Read **inline comments** in code for explanations

## 🆘 Need Help?

1. Check [SETUP.md](SETUP.md) troubleshooting section
2. Review [ARCHITECTURE.md](ARCHITECTURE.md) for how things work
3. Look at code comments in `src/` files
4. Check Prisma schema in `prisma/schema.prisma`

---

**Ready to build amazing friendships!** 🎊

The app is designed to be safe, inclusive, and optimized for Japanese UX norms. Start exploring and customizing it to match your vision!
