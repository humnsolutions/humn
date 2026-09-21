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

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Contact form email

Submissions to `/contact` are POSTed to `src/app/api/contact/route.ts`, which delivers
them by email to `site.email` (see `src/lib/site.ts`) using [Resend](https://resend.com).
Replies go straight back to the visitor, because the submitter's address is set as
`replyTo`.

Required environment variable, in `.env.local` (not committed):

| Variable | Required | Purpose |
| --- | --- | --- |
| `RESEND_API_KEY` | Yes | API key from https://resend.com/api-keys |
| `CONTACT_FROM_EMAIL` | No | Sender. Defaults to `HUMN Website <onboarding@resend.dev>` |

Until a domain is verified at https://resend.com/domains, Resend only permits sending
from `onboarding@resend.dev` and only to the address the Resend account was created
with — so sign up with the address you want leads delivered to.

If `RESEND_API_KEY` is missing or Resend rejects the send, the route logs the failure
(including the lead) and returns an error, so the form tells the visitor to email
directly rather than pretending the message was delivered.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
