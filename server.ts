//import telemetry packages 
const process = require('process');
const opentelemetry = require('@opentelemetry/sdk-node');
const { ConsoleSpanExporter } = require('@opentelemetry/sdk-trace-base');
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');
const { OTLPTraceExporter } = require("@opentelemetry/exporter-trace-otlp-http");

//import express packages
const express = require('express');
const app = express();
const cors = require('cors');

//express configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// --- OPEN TELEMETRY SETUP --- //

//define sdk
const sdk = new opentelemetry.NodeSDK({
  traceExporter: new OTLPTraceExporter({
    url: "http://localhost:4000/" //export traces as http req to custom express server on port 400
  }),
  instrumentations: [new HttpInstrumentation()] //add http instrumentation 
});

//start sdk
sdk.start();

//gracefully shut down SDK on process exit
process.on('SIGTERM', () => {
  sdk.shutdown()
    .then(() => console.log('Tracing terminated'))
    .catch((error) => console.log('Error terminating tracing', error))
    .finally(() => process.exit(0));
});

// --- EXPRESS SERVER / SOCKET SETUP --- //

//custom express server running on port 4000 to send data to front end
app.use('/',(req,res)=>{

  const clientData = [];
  const spans = req.body.resourceSpans[0].scopeSpans[0].spans;

  //add select span data to clientData array through deconstration of span elements
  //TODO - match with typescript interface 
  //TODO - deconstruct based on key not on array position as traces are inconsistant
  spans.forEach((el)=>{
    const clientObj = {};
    clientObj.id = el.spanID;
    clientObj.startTime = el.startTimeUnixNano;
    clientObj.endTime = el.endTimeUnixNano;
    clientObj.packageSize = el.attributes[6].value.intValue; //bytes
    clientObj.statusCode = el.attributes[13] ? el.attributes[13].value.intValue : null;
    clientObj.endPoint = el.attributes[0].value.stringValue;
    clientObj.requestType = el.name;
    clientData.push(clientObj);
  });

  io.emit('message',JSON.stringify(clientData)); //send clientData to frontend through socket 
  res.status(200).end(); //end request response cycle
})

//start custom express server on port 4000
const server = app.listen(4000, () => {
  console.log(`Custom trace listening server on port 4000`);
});

//create socket running on top of express server (port 4000) + enable cors 
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000',
    credentials: true
  }
});



