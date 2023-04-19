# NetPulse: Next.js Server Side Observability

## Getting Started

1. Install the following two NetPulse npm packages:

```bash
npm install @netpulse/tracing @netpulse/dashboard
```

2. Create an `instrument.js` file in the root directory of your project.

3. Add the following code to `instrument.js`:

```bash
const tracing = require('@netpulse/dashboard');
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

Finally, in your package.json add the following start script:

```bash
"instrument": "node --require ./instrument.js ./node_modules/.bin/next dev"
```

You can now run your Next.js application:

```bash
npm run instrument
```

Open [http://localhost:3000/Dashboard](http://localhost:3000/Dashboard) in the browser to view traces related to server side api calls and NoSQL / SQL database calls.

## Note

API Compatibility:

- Node Fetch

Database Compatibility:

- MongoDB(Mongoose): >= 5.9.7 <7
- Postgresql(Pg): >= 8 <9

## Going forward

As an open source project we are open to pull requests or feature requests from the developer community!

Planned Features:

- Dashboard containerization through DockerHub
- Compatiblity with more databases / drivers
- Compatability with native [Next.js fetch](https://beta.nextjs.org/docs/data-fetching/fundamentals)
- Non dynamic package imports
