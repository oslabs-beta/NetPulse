// import telemetry packages
const process = require("process");
const opentelemetry = require("@opentelemetry/sdk-node");
const { diag } = require("@opentelemetry/api");
const { HttpInstrumentation } = require("@opentelemetry/instrumentation-http");
const {
  OTLPTraceExporter,
} = require("@opentelemetry/exporter-trace-otlp-http");
// mongoose instrumentation
const {
  MongooseInstrumentation,
} = require("@opentelemetry/instrumentation-mongoose");
const mongoose = require("mongoose");
mongoose.set("debug", true);

//express configuration
const express = require("express");
const app = express();
const cors = require("cors");

//server response
const { ServerReponse } = require("http");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cors());

//import middleware
const otelController = require("./otelController");

// --- OPEN TELEMETRY SETUP --- //

const sdk = new opentelemetry.NodeSDK({
  traceExporter: new OTLPTraceExporter({
    url: "http://localhost:4000/", //export traces as http req to custom express server on port 400
  }),
  instrumentations: [
    new HttpInstrumentation({
      // res: @type ServerReponse from "http"
      responseHook: (span, res) => {
        span.setAttribute(
          "instrumentationLibrary",
          span.instrumentationLibrary.name
        );

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
        span.setAttribute(
          "contentLength",
          Buffer.byteLength(JSON.stringify(res.response))
        );
        span.setAttribute(
          "instrumentationLibrary",
          span.instrumentationLibrary.name
        );
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

//custom express server running on port 4000 to send data to front end
//otelEndpointHandler
app.use("/", otelController.parseTrace, (req, res) => {
  if (res.locals.clientData.length > 0)
    io.emit("message", JSON.stringify(res.locals.clientData));

  // console.log(res.locals.clientData);
  res.sendStatus(200);
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

// --- MONGOOSE SETUP (FOR TESTING) --- //

// v-- REPLACE THE EMPTY STRING WITH YOUR LOCAL/MLAB/ELEPHANTSQL URI
const myURI =
  "mongodb+srv://austinhoang14:austin95@cluster0.7adpryn.mongodb.net/test";

mongoose.set("strictQuery", true);

// TO-DO: Remove the below mongoose test code for production build
// connection to mongoDB using mongoose + test schema
mongoose
  .connect(myURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "movies",
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Error connecting to DB: ", err));

mongoose.models = {};

// deconstructed mongoose.Schema and mongoose.model
const { Schema, model } = mongoose;

// schema for movies
const movieSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  watched: {
    type: Boolean,
    default: false,
  },
});

// model for movies using movieSchema
const Movie = model("movie", movieSchema);

module.exports = Movie;
