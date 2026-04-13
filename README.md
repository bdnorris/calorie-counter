# Calorie Counter

A personal calorie tracking app built with Vue 3, Supabase, and Netlify Functions.

## User management

There is no self-service registration. Users must be created manually in the Supabase dashboard:

1. Go to your Supabase project → **Authentication** → **Users**
2. Click **Add user** → **Create new user**
3. Enter the user's email and a password
4. Make sure **"Auto Confirm User"** is checked (or email confirmation is disabled — see below)

### Disable email confirmation

Since users are created manually, email confirmation should be turned off:

1. Go to **Authentication** → **Providers** → **Email**
2. Toggle off **"Confirm email"**
3. Save

## Setup

### 1. Supabase

- Create a Supabase project
- Run `supabase-schema.sql` in the Supabase **SQL Editor**
- Disable email confirmation (see above)

### 2. Environment variables

Copy `.env.example` to `.env.local` and fill in your Supabase keys:

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
SUPABASE_URL=...
SUPABASE_SERVICE_KEY=...
```

Add the same four variables to your **Netlify site → Environment variables**.

### 3. Local development

Install [Netlify CLI](https://docs.netlify.com/cli/get-started/) globally if you haven't:

```sh
npm install -g netlify-cli
```

Link to your Netlify site:

```sh
netlify link
```

Start the dev server (runs Vite + Netlify Functions together on port 8888):

```sh
netlify dev
```

### 4. Deploy

Push to your repository. Netlify will detect `netlify.toml` and build automatically.

## Type-check

```sh
npm run type-check
```
