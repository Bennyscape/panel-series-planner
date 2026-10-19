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

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Supabase authentication

Copy `.env.example` to `.env.local` and set the Supabase project URL and
publishable key. The legacy anon key environment variable is also accepted for
existing local setups.

Enable email/password authentication and email confirmation in Supabase Auth.
Add `http://localhost:3000/auth/callback` and the deployed app's matching
`/auth/callback` URL to the Auth redirect URL allowlist.

To enable Google sign-in:

1. Create a Google OAuth web client in Google Cloud and configure its consent
   screen and `openid`, email, and profile scopes.
2. Add the Supabase Auth callback URL shown in the Google provider settings as
   an authorized redirect URI in Google Cloud.
3. Enable the Google provider in Supabase Auth and enter the Google client ID
   and secret.
4. Add the local and deployed app origins to the Google OAuth authorized
   JavaScript origins and to the Supabase Auth redirect URL allowlist.

The Google provider must be enabled in the Supabase dashboard for the button to
complete sign-in. New users receive the `pending` role from the database
profile trigger.

The Phase 9 migration and first-admin bootstrap SQL are prepared under
`supabase/`; neither has been applied to the live project.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
