// import telemetry packages
const process = require("process");
const opentelemetry = require("@opentelemetry/sdk-node");
const { HttpInstrumentation } = require("@opentelemetry/instrumentation-http");
const { OTLPTraceExporter } = require("@opentelemetry/exporter-trace-otlp-http");
const { ServerResponse } = require("http");

//express configuration
const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cors());

// --- OPEN TELEMETRY SETUP --- //

const sdk = new opentelemetry.NodeSDK({
  traceExporter: new OTLPTraceExporter({
    url: "http://localhost:4000/", //export traces as http req to custom express server on port 400
  }),
  instrumentations: [
    new HttpInstrumentation({
      /*
       * res: @type ServerReponse from "http"
       */
      responseHook: (span, res) => {
        // Get the length of the 8-bit byte array. Size indicated the number of bytes of data
        let size = 0;
        res.on("data", (chunk) => {
          size += chunk.length;
        });

        res.on("end", () => {
          span.setAttribute("content_length", size);
        });
      },
    }),
  ],
  // TODO: add database instrumentation
});

sdk.start();

//gracefully shut down SDK on process exit
process.on("SIGTERM", () => {
  sdk
    .shutdown()
    .then(() => console.log("Tracing terminated"))
    .catch((error) => console.log("Error terminating tracing", error))
    .finally(() => process.exit(0));
});

// --- EXPRESS SERVER / SOCKET SETUP --- //

//identifies strings with substrings that match array elements
const includesAny = (array, string) => {
  for (let i = 0; i < array.length; i++) {
    if (string.includes(array[i])) return true;
  }
  return false;
};

//custom express server running on port 4000 to send data to front end
//otelEndpointHandler
app.use("/", (req, res) => {
  const clientData = [];
  // console.dir(req.body.resourceSpans[0].scopeSpans[0].spans, { depth: null });
  const spans = req.body.resourceSpans[0].scopeSpans[0].spans;
  const ignoreEndpoints = ["localhost", "socket", "nextjs"]; //endpoints to ignore

  //add specific span data to clientData array through deconstruction of span elements
  //spans is an array of span objects
  //attributes is an array of nested object with one key-value pair per array element
  //ex: attributes = [{key: 'http.url', value: {stringValue: 'wwww.api.com/'}}...]
  //el.attributes.find finds the array element with a matching key desired and returns the unnested value if
  //exists or null if doesn't exist
  spans.forEach((el) => {
    const clientObj = {
      spanId: el.spanId,
      traceId: el.traceId,
      startTime: Math.floor(el.startTimeUnixNano / Math.pow(10, 6)), //[ms]
      duration: Math.floor((el.endTimeUnixNano - el.startTimeUnixNano) / Math.pow(10, 6)), //[ms]
      contentLength: (() => {
        const packageObj = el.attributes.find((attr) => attr.key === "content_length");
        const size = packageObj ? packageObj.value.intValue : 0;
        return size;
      })(),
      statusCode: el.attributes.find((attr) => attr.key === "http.status_code")?.value?.intValue,
      endPoint: el.attributes.find((attr) => attr.key === "http.url")?.value?.stringValue,
      requestType: el.name,
    };

    //if the endpoint is an external api add it to client data array
    if (clientObj.endPoint) {
      if (!includesAny(ignoreEndpoints, clientObj.endPoint)) {
        clientData.push(clientObj);
      }
    }
  });
  console.log(clientData);
  if (clientData.length > 0) io.emit("message", JSON.stringify(clientData));
  res.status(200).end();
});

//start custom express server on port 4000
const server = app
  .listen(4000, () => {
    console.log(`Custom trace listening server on port 4000`);
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

//create socket running on top of express server (port 4000) + enable cors
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});
