This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```


# 🔖 Bookmark Manager

A modern bookmark management web app built with Next.js, Supabase, and Tailwind CSS.

Users can securely log in with Google and manage their bookmarks in real-time across multiple tabs.

---

## 🚀 Features

- 🔐 Google Authentication (Supabase Auth)
- ➕ Add bookmarks
- ✏️ Edit bookmarks
- 🗑️ Delete bookmarks
- ⚡ Real-time sync across multiple tabs
- 🎨 Clean Facebook-style UI (Tailwind CSS)
- 🔒 Protected routes

---

## 🛠️ Tech Stack

- Next.js (App Router)
- Supabase (Database + Auth + Realtime)
- Tailwind CSS
- TypeScript

---

## 📸 Screenshots

### Login Page
Google sign-in authentication page.

### Dashboard
Bookmark management dashboard with CRUD functionality.

---

## ⚙️ Installation

Clone the repository:

```bash
git clone https://github.com/your-username/bookmark-manager.git
cd bookmark-manager
```

Install dependencies:

```bash
npm install
```

---

## 🔑 Setup Supabase

1. Create a project on Supabase
2. Enable Google Authentication
3. Create a `bookmarks` table:

```sql
create table bookmarks (
  id uuid primary key default uuid_generate_v4(),
  title text,
  url text,
  user_id uuid references auth.users on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
```

4. Set **Replica Identity = FULL** (for realtime delete support)

---

## 🔐 Environment Variables

Create a `.env.local` file in the root:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

---

## ▶️ Run the Project

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

---

## 🌍 Deployment

You can deploy easily on:

- Vercel (Recommended)
- Netlify
- Any Node.js hosting

Make sure to add environment variables in your deployment settings.

---

## 📌 Future Improvements

- Search functionality
- Dark mode
- Bookmark categories
- Favicon preview
- Drag & drop sorting

---

## Problem faced

1️⃣ Google OAuth Redirecting to localhost After Deployment

Problem:
After deploying to Vercel, Google login redirected to:

http://localhost:3000


instead of the production domain.

Cause:
Supabase Site URL was still set to localhost.

Solution:

Updated Site URL in Supabase Authentication settings.

Added production URL in Redirect URLs.

Verified correct OAuth callback URL in Google Cloud Console.

Result:
Login now correctly redirects to production domain.

2️⃣ Environment Variables Not Working in Production

Problem:
Application worked locally but failed after deployment.

Cause:
Environment variables were not added in Vercel dashboard.

Solution:

Added required environment variables in Vercel Project Settings.

Redeployed the application.

3️⃣ Git Push Error (src refspec main does not match any)

Problem:

src refspec main does not match any


Cause:
Branch mismatch (master vs main) and no initial commit.

Solution:

git add .
git commit -m "Initial commit"
git branch -M main
git push -u origin main

4️⃣ Input Text Not Fully Black

Problem:
Input text color was not fully black.

Cause:
Tailwind default styling override.

Solution:
Explicitly added:

class="text-black"

5️⃣ Realtime Updates Not Working Properly

Problem:
Database changes were not reflecting instantly in UI.

Cause:

Realtime not enabled in Supabase table.

Missing frontend subscription.

No proper cleanup of channel.

Solution:

Enabled Realtime in Supabase dashboard.

Subscribed to changes:

const channel = supabase
  .channel('realtime-channel')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'your_table_name' },
    (payload) => {
      fetchData()
    }
  )
  .subscribe()

return () => {
  supabase.removeChannel(channel)
}


Result:
UI updates instantly without page refresh.

📚 What I Learned

OAuth redirect handling in production

Environment-based configuration

Realtime database subscriptions

Deployment debugging

Branch management in Git

Importance of proper documentation

🔥 Key Concepts Implemented

Google OAuth Flow

Supabase Authentication

Realtime Database Subscriptions

Environment Variables Management

Production Deployment

State Management

🙌 Conclusion

This project helped me understand real-world authentication flow, deployment configuration, realtime updates, and debugging production-level issues.

## 👨‍💻 Author

Made with ❤️ by Hritik Paswab

---

## 📄 License

This project is open-source and available under the MIT License.


Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
