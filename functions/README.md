# Firebase Functions

This folder contains the server side of the platform implemented as
[Firebase Cloud Functions](https://firebase.google.com/docs/functions)
written in TypeScript.

## Directory layout

```
functions/
├── src/        # TypeScript sources
│   ├── auth/   # Authentication triggers
│   ├── database/   # Firestore triggers for accounts and listings
│   ├── functions/  # HTTPS callable/HTTP functions
│   └── utils/      # Shared utilities
├── test/       # Mocha unit tests
├── package.json
├── tsconfig.json
└── tsconfig.test.json
```

`src/index.ts` exports all triggers and HTTP functions so Firebase can
load them.

## Required configuration

Some functions rely on runtime configuration that must be provided via
`firebase functions:config:set` or environment variables.

- **Gmail credentials** – `submitLead` in
  `src/functions/contactform.ts` sends email using Nodemailer. Set:

  ```bash
  firebase functions:config:set \
    gmail.email="you@example.com" \
    gmail.password="app-password"
  ```

- **Google Maps API key** – `src/utils/geocoding.ts` uses the Maps API.
  Provide it with:

  ```bash
  firebase functions:config:set google.apikey="YOUR_API_KEY"
  ```

  or set the environment variable `GOOGLE_API_KEY` when running locally.

## Build and test

Install dependencies and compile the TypeScript to `lib/`:

```bash
npm --prefix functions install
npm --prefix functions run build
```

Run the unit tests:

```bash
npm --prefix functions test
```

From the repository root you can also run `npm run test` which executes
Angular and functions tests together.
