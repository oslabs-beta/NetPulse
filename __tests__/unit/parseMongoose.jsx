const { type } = require('os');

//mock middleware to handle parsing mongoose requests
const parseMongoose = (req) => {
  const clientData = [];
  const spans = req.body.resourceSpans[0].scopeSpans[0].spans;

  //iterate through array of OTLP objects pulling desired attri
  spans.forEach((el) => {
    //find package size of individual request
    let tempPackageSize;

    const clientObj = {
      spanId: el.spanId,
      traceId: el.traceId,
      startTime: Math.floor(el.startTimeUnixNano / Math.pow(10, 6)), //[ms]
      duration: Math.floor((el.endTimeUnixNano - el.startTimeUnixNano) / Math.pow(10, 6)), //[ms]
      contentLength: (() => {
        const packageObj = el.attributes.find((attr) => attr.key === 'contentLength');
        const size = packageObj ? packageObj.value.intValue : 0;
        tempPackageSize = size;
        return size;
      })(),
      statusCode: tempPackageSize ? 200 : 404,
      endPoint: el.attributes.find((attr) => attr.key === 'db.mongodb.collection')?.value
        ?.stringValue,
      requestMethod: el.attributes.find((attr) => attr.key === 'db.operation')?.value?.stringValue,
      requestType: 'Mongoose',
    };
    clientData.push(clientObj);
  });
  return clientData;
};

//create mock request body representing typical otel export data
const fakeReq = {
  body: {
    resourceSpans: [
      {
        scopeSpans: [
          {
            spans: [
              {
                spanId: '9asdv922as2',
                traceId: '5c263067fe3',
                startTimeUnixNano: 3323112231,
                endTimeUnixNano: 5323112231,
                name: 'GET',
                attributes: [
                  { key: 'db.mongodb.collection', value: { stringValue: 'Movies' } },
                  { key: 'db.operation', value: { stringValue: 'find' } },
                  { key: 'contentLength', value: { intValue: 57 } },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
};

//testing otelEndpointHandler handler
describe('Testing parseMongoose output.', () => {
  test('Request body is deconstructed correctly.', () => {
    const clientObj = parseMongoose(fakeReq)[0];
    expect(clientObj.spanId).not.toBe(undefined);
    expect(clientObj.traceId).not.toBe(undefined);
    expect(clientObj.startTime).not.toBe(undefined);
    expect(clientObj.duration).not.toBe(undefined);
    expect(clientObj.contentLength).not.toBe(undefined);
    expect(clientObj.statusCode).not.toBe(undefined);
    expect(clientObj.endPoint).not.toBe(undefined);
    expect(clientObj.requestMethod).not.toBe(undefined);
    expect(clientObj.requestType).not.toBe(undefined);
  });

  test('Data is of the correct type.', () => {
    const clientObj = parseMongoose(fakeReq)[0];
    expect(typeof clientObj.spanId).toEqual('string');
    expect(typeof clientObj.traceId).toEqual('string');
    expect(typeof clientObj.startTime).toEqual('number');
    expect(typeof clientObj.duration).toEqual('number');
    expect(typeof clientObj.contentLength).toEqual('number');
    expect(typeof clientObj.statusCode).toEqual('number');
    expect(typeof clientObj.endPoint).toEqual('string');
    expect(typeof clientObj.requestMethod).toEqual('string');
    expect(typeof clientObj.requestType).toEqual('string');
  });

  test('Data has correct values.', () => {
    const clientObj = parseMongoose(fakeReq)[0];
    expect(clientObj.spanId).toEqual('9asdv922as2');
    expect(clientObj.traceId).toEqual('5c263067fe3');
    expect(clientObj.startTime).toEqual(3323);
    expect(clientObj.duration).toEqual(2000);
    expect(clientObj.contentLength).toEqual(57);
    expect(clientObj.statusCode).toEqual(200);
    expect(clientObj.endPoint).toEqual('Movies');
    expect(clientObj.requestMethod).toEqual('find');
    expect(clientObj.requestType).toEqual('Mongoose');
  });

  test('Handles missing contentLength attribute.', () => {
    const modifiedReq = JSON.parse(JSON.stringify(fakeReq)); // Deep copy
    const attrIndex = modifiedReq.body.resourceSpans[0].scopeSpans[0].spans[0].attributes.findIndex(
      (attr) => attr.key === 'contentLength'
    );
    modifiedReq.body.resourceSpans[0].scopeSpans[0].spans[0].attributes.splice(attrIndex, 1);

    const clientObj = parseMongoose(modifiedReq)[0];
    expect(clientObj.contentLength).toEqual(0);
    expect(clientObj.statusCode).toEqual(404);
  });

  test('Handles multiple spans.', () => {
    const modifiedReq = JSON.parse(JSON.stringify(fakeReq)); // Deep copy
    modifiedReq.body.resourceSpans[0].scopeSpans[0].spans.push({
      spanId: 'testSpanId',
      traceId: 'testTraceId',
      startTimeUnixNano: 3323112231,
      endTimeUnixNano: 5323112231,
      name: 'GET',
      attributes: [
        { key: 'db.mongodb.collection', value: { stringValue: 'Actors' } },
        { key: 'db.operation', value: { stringValue: 'list' } },
        { key: 'contentLength', value: { intValue: 100 } },
      ],
    });

    const results = parseMongoose(modifiedReq);
    expect(results).toHaveLength(2);
    expect(results[1].endPoint).toEqual('Actors');
    expect(results[1].requestMethod).toEqual('list');
    expect(results[1].contentLength).toEqual(100);
  });

  test('Handles missing db.mongodb.collection attribute.', () => {
    const modifiedReq = JSON.parse(JSON.stringify(fakeReq)); // Deep copy
    const attrIndex = modifiedReq.body.resourceSpans[0].scopeSpans[0].spans[0].attributes.findIndex(
      (attr) => attr.key === 'db.mongodb.collection'
    );
    modifiedReq.body.resourceSpans[0].scopeSpans[0].spans[0].attributes.splice(attrIndex, 1);

    const clientObj = parseMongoose(modifiedReq)[0];
    expect(clientObj.endPoint).toBe(undefined);
  });

  test('Handles missing db.operation attribute.', () => {
    const modifiedReq = JSON.parse(JSON.stringify(fakeReq)); // Deep copy
    const attrIndex = modifiedReq.body.resourceSpans[0].scopeSpans[0].spans[0].attributes.findIndex(
      (attr) => attr.key === 'db.operation'
    );
    modifiedReq.body.resourceSpans[0].scopeSpans[0].spans[0].attributes.splice(attrIndex, 1);

    const clientObj = parseMongoose(modifiedReq)[0];
    expect(clientObj.requestMethod).toBe(undefined);
  });
});
