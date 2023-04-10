const otelController = {};

//helper function - identifies strings with substrings that match array elements
const includesAny = (array, string) => {
  for (let i = 0; i < array.length; i++) {
    if (string.includes(array[i])) return true;
  }
  return false;
};

//middleware to handle parsing HTTP requests
const parseHTTP = (clientData, spans) => {
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
      duration: Math.floor(
        (el.endTimeUnixNano - el.startTimeUnixNano) / Math.pow(10, 6)
      ), //[ms]
      contentLength: (() => {
        const packageObj = el.attributes.find(
          (attr) => attr.key === "contentLength"
        );
        const size = packageObj ? packageObj.value.intValue : 0;
        return size;
      })(),
      statusCode: el.attributes.find((attr) => attr.key === "http.status_code")
        ?.value?.intValue,
      endPoint: el.attributes.find((attr) => attr.key === "http.url")?.value
        ?.stringValue,
      requestMethod: el.name,
      requestType: 'HTTPS',
    };

    //if the endpoint is an external api add it to client data array
    if (clientObj.endPoint) {
      if (!includesAny(ignoreEndpoints, clientObj.endPoint)) {
        clientData.push(clientObj);
      }
    }
  });
  return clientData;
};

//middleware to handle parsing mongoose requests
const parseMongoose = (clientData, spans) => {
  //iterate through array of OTLP objects pulling desired attri
  spans.forEach((el) => {
    //find package size of individual request
    let tempPackageSize;

    const clientObj = {
      spanId: el.spanId,
      traceId: el.traceId,
      startTime: Math.floor(el.startTimeUnixNano / Math.pow(10, 6)), //[ms]
      duration: Math.floor(
        (el.endTimeUnixNano - el.startTimeUnixNano) / Math.pow(10, 6)
      ), //[ms]
      contentLength: (() => {
        const packageObj = el.attributes.find(
          (attr) => attr.key === "contentLength"
        );
        const size = packageObj ? packageObj.value.intValue : 0;
        tempPackageSize = size;
        return size;
      })(),
      statusCode: tempPackageSize ? 200 : 404,
      endPoint: el.attributes.find(
        (attr) => attr.key === "db.mongodb.collection"
      )?.value?.stringValue,
      requestMethod: el.attributes.find((attr) => attr.key === "db.operation")
        ?.value?.stringValue,
      requestType: 'Mongoose',
    };
    clientData.push(clientObj);
  });
  return clientData;
};

//middleware to handle parsing pg requests
const parsePg = (clientData, spans) => {
  //iterate through array of OTLP objects pulling desired attri
  spans.forEach((el) => {
    //find package size of individual request
    let tempPackageSize;

    const clientObj = {
      spanId: el.spanId,
      traceId: el.traceId,
      startTime: Math.floor(el.startTimeUnixNano / Math.pow(10, 6)), //[ms]
      duration: Math.floor(
        (el.endTimeUnixNano - el.startTimeUnixNano) / Math.pow(10, 6)
      ), //[ms]
      contentLength: (() => {
        const packageObj = el.attributes.find(
          (attr) => attr.key === "contentLength"
        );
        const size = packageObj ? packageObj.value.intValue : 0;
        tempPackageSize = size;
        return size;
      })(),
      statusCode: tempPackageSize ? 200 : 404,
      endPoint: el.attributes.find(
        (attr) => attr.key === "db.name"
      )?.value?.stringValue,
      requestMethod: el.attributes.find((attr) => attr.key === "db.statement")
        ?.value?.stringValue.split(" ")[0],
      requestType: 'PostgreSQL',
    };
    clientData.push(clientObj);
  });
  return clientData;
};


otelController.parseTrace = (req, res, next) => {
  let clientData = [];
  const spans = req.body.resourceSpans[0].scopeSpans[0].spans;
  // console.log("in middleware");
  // console.log("DB SPAN ATTRIBUTES:", spans.attributes);

  const instrumentationLibrary = spans[0].attributes.find(
    (attr) => attr.key === "instrumentationLibrary"
  )?.value?.stringValue;

  // console.log("instrumentation library", instrumentationLibrary);

  //deconstruct OTLP body based on instrumentation library span was instrumented with
  // console.log("Instrumentation library: ",instrumentationLibrary);
  switch (instrumentationLibrary) {
    case "@opentelemetry/instrumentation-mongoose":
      clientData = parseMongoose(clientData, spans);
      break;
    case "@opentelemetry/instrumentation-http":
      clientData = parseHTTP(clientData, spans);
      break;
    case "@opentelemetry/instrumentation-pg":
      clientData = parsePg(clientData, spans);
      // console.dir(spans[0], {depth: null});
      break;
    default:
      // console.log("otelController parseTrace middleware hit default switch case","    ", instrumentationLibrary);
      break;
  }

  res.locals.clientData = clientData;
  return next();
};

module.exports = otelController;
