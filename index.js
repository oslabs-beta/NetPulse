//start monitoring
function startOtel() {
  const clientPort = 3000;
  const serverPort = 4000;

  //open telemetry packages
  const { NodeTracerProvider, SimpleSpanProcessor } = require("@opentelemetry/sdk-trace-node");
  const { registerInstrumentations } = require("@opentelemetry/instrumentation");
  const { HttpInstrumentation } = require("@opentelemetry/instrumentation-http");
  const { OTLPTraceExporter } = require("@opentelemetry/exporter-trace-otlp-http");

  //mongoose instrumentation
  const { MongooseInstrumentation } = require("@opentelemetry/instrumentation-mongoose");

  //pg instrumentation
  const { PgInstrumentation } = require("@opentelemetry/instrumentation-pg");

  // --- OPEN TELEMETRY SETUP --- //

  const provider = new NodeTracerProvider();

  //register instruments
  //inject custom custom attributes for package size and instrumentation library used
  //for use in otleController middlware
  registerInstrumentations({
    instrumentations: [
      new HttpInstrumentation({
        responseHook: (span, res) => {
          span.setAttribute("instrumentationLibrary", span.instrumentationLibrary.name);

          // Get the length of the 8-bit byte array. Size indicated the number of bytes of data
          let size = 0;
          res.on("data", (chunk) => {
            size += chunk.length;
          });

          res.on("end", () => {
            span.setAttribute("contentLength", size);
          });
        },
      }),
      new MongooseInstrumentation({
        responseHook: (span, res) => {
          span.setAttribute("contentLength", Buffer.byteLength(JSON.stringify(res.response)));
          span.setAttribute("instrumentationLibrary", span.instrumentationLibrary.name);
        },
      }),
      new PgInstrumentation({
        responseHook: (span, res) => {
          span.setAttribute("contentLength", Buffer.byteLength(JSON.stringify(res.data.rows)));
          span.setAttribute("instrumentationLibrary", span.instrumentationLibrary.name);
        },
      }),
    ],
  });

  //export traces to custom express server running on port 4000
  const traceExporter = new OTLPTraceExporter({
    url: `http://localhost:${serverPort}`, //export traces as http req to custom express server on port 400
  });

  //add exporter to provider / register provider
  provider.addSpanProcessor(new SimpleSpanProcessor(traceExporter));
  provider.register();

  // --- EXPRESS SERVER / SOCKET SETUP --- //

  //express configuration
  const express = require("express");
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const otelController = require("./otelController"); //import middleware

  //custom express server running on port 4000 to send data to front end dashboard
  app.use("/", otelController.parseTrace, (req, res) => {
    if (res.locals.clientData.length > 0) io.emit("message", JSON.stringify(res.locals.clientData));
    res.sendStatus(200);
  });

  //start custom express server on port 4000
  const server = app
    .listen(serverPort, () => {
      console.log(`Custom trace listening server on port ${serverPort}`);
    })
    .on("error", function (err) {
      process.once("SIGUSR2", function () {
        process.kill(process.pid, "SIGUSR2");
      });
      process.on("SIGINT", function () {
        // this is only called on ctrl+c, not restart
        process.kill(process.pid, "SIGINT");
      });
    });

  //create socket running on top of express server + enable cors
  const io = require("socket.io")(server, {
    cors: {
      origin: `http://localhost:3000`,
      credentials: true,
    },
  });
}

module.exports = startOtel;
