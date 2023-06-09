# NetPulse: Next.js Server Side Observability

## Getting Started

1. Install the following two NetPulse npm packages:

```bash
npm install @netpulse/tracing @netpulse/dashboard
```

2. Create a `tracing.js` file in the root directory of your project.

3. Add the following code to `tracing.js`:

```bash
const tracing = require('@netpulse/tracing');
tracing();
```

4. Inside the app or pages directory (depending on if you are using beta) create a file `Dashboard.tsx` and add the following code:

```bash
'use client';
import dynamic from 'next/dynamic';
const DashboardUI = dynamic(() => import('@netpulse/dashboard'), { ssr: false });
export default function Home() {
    return <DashboardUI/>;
}
```

5. Finally, in your package.json add the following start script:

```bash
"tracing": "node --require ./tracing.js & ./node_modules/.bin/next dev"
```

You can now run your Next.js application:

```bash
npm run tracing
```

Open [http://localhost:3000/Dashboard](http://localhost:3000/Dashboard) in the browser to view traces related to server side api calls and NoSQL / SQL database calls.

## Notes

API Compatibility:

- node-fetch
- xmlHttpRequest
- Node HTTP

_Note: The current version of Next.js (13.2.4) uses an older version of node-fetch. As such, node-fetch (>=3.3.1) must be manually installed and imported into components that require monitoring of fetch calls_

Database Compatibility:

- MongoDB (Mongoose): >=5.9.7 <7
- Postgresql (Pg): >=8 <9

## Coming soon

As an open source project we are open to pull requests or feature requests from the developer community!

Currently prioritized features:

- Dashboard containerization through DockerHub
- Compatiblity with additional databases / drivers
- Compatability with native [Next.js fetch](https://beta.nextjs.org/docs/data-fetching/fundamentals)
- Build tool update for better compatibility with ES modules (Non-dynamic import of Dashboard)
