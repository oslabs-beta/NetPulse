const { type } = require('os');

//mock middleware to handle parsing mongoose requests
const parsePg = (req) => {
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
      endPoint: el.attributes.find((attr) => attr.key === 'db.name')?.value?.stringValue,
      requestMethod: el.attributes
        .find((attr) => attr.key === 'db.statement')
        ?.value?.stringValue.split(' ')[0],
      requestType: 'PostgreSQL',
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
                  { key: 'db.name', value: { stringValue: 'gooxohsq' } },
                  { key: 'db.statement', value: { stringValue: 'SELECT * from TABLE' } },
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
    const clientObj = parsePg(fakeReq)[0];
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
    const clientObj = parsePg(fakeReq)[0];
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
    const clientObj = parsePg(fakeReq)[0];
    expect(clientObj.spanId).toEqual('9asdv922as2');
    expect(clientObj.traceId).toEqual('5c263067fe3');
    expect(clientObj.startTime).toEqual(3323);
    expect(clientObj.duration).toEqual(2000);
    expect(clientObj.contentLength).toEqual(57);
    expect(clientObj.statusCode).toEqual(200);
    expect(clientObj.endPoint).toEqual('gooxohsq');
    expect(clientObj.requestMethod).toEqual('SELECT');
    expect(clientObj.requestType).toEqual('PostgreSQL');
  });
});
