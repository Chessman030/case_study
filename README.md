# CTF Case Study Round 2

This folder contains a Next.js app copied from the original capture-the-flag site and adjusted for round 2.

## What changed

- Two text-only questions
- 10 marks per question
- 2 hour timer
- Login and signup flow kept the same
- Results stored in MongoDB only

## Setup

1. Install dependencies
   ```bash
   npm install
   ```

2. Create your local env file
   - Copy `.env.local.example` to `.env.local`
   - Replace `<YOUR_PASSWORD_HERE>` with your MongoDB password

3. Run the app
   ```bash
   npm run dev
   ```