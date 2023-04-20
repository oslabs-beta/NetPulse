// open telemetry packages
const { NodeTracerProvider, SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-node');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { MongooseInstrumentation } = require('@opentelemetry/instrumentation-mongoose');
const { PgInstrumentation } = require('@opentelemetry/instrumentation-pg');
const dotenv = require('dotenv');

dotenv.config();

// --- OPEN TELEMETRY SETUP --- //

const nodeProvider = new NodeTracerProvider();

registerInstrumentations({
  instrumentations: [
    new HttpInstrumentation({
      // @ts-ignore
      responseHook: (span, res) => {
        span.setAttribute('instrumentationLibrary', span.instrumentationLibrary.name);

        // Get the length of the 8-bit byte array. Size indicated the number of bytes of data
        let size = 0;
        // @ts-ignore
        res.on('data', (chunk) => {
          size += chunk.length;
        });

        res.on('end', () => {
          span.setAttribute('contentLength', size);
        });
      },
    }),
    new MongooseInstrumentation({
      // @ts-ignore
      responseHook: (span, res) => {
        span.setAttribute('contentLength', Buffer.byteLength(JSON.stringify(res.response)));
        // @ts-ignore
        span.setAttribute('instrumentationLibrary', span.instrumentationLibrary.name);
      },
    }),
    new PgInstrumentation({
      // @ts-ignore
      responseHook: (span, res) => {
        span.setAttribute('contentLength', Buffer.byteLength(JSON.stringify(res.data.rows)));
        // @ts-ignore
        span.setAttribute('instrumentationLibrary', span.instrumentationLibrary.name);
      },
    }),
  ],
});

// export traces to port 4000
const traceExporter = new OTLPTraceExporter({
  url: 'http://localhost:4000/', // export traces as http req to custom express server on port 400
});

nodeProvider.addSpanProcessor(new SimpleSpanProcessor(traceExporter));

module.exports = nodeProvider;
