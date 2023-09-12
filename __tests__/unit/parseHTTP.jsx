const { type } = require('os');

//identifies strings with substrings that match array elements
const includesAny = (array, string) => {
  for (let i = 0; i < array.length; i++) {
    if (string.includes(array[i])) return true;
  }
  return false;
};

//mock middleware to handle parsing HTTP requests
const parseHTTP = (req) => {
  const clientData = [];
  const spans = req.body.resourceSpans[0].scopeSpans[0].spans;
  const ignoreEndpoints = ['localhost', 'socket', 'nextjs']; //endpoints to ignore

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
        const packageObj = el.attributes.find((attr) => attr.key === 'contentLength');
        const size = packageObj ? packageObj.value.intValue : 0;
        return size;
      })(),
      statusCode: el.attributes.find((attr) => attr.key === 'http.status_code')?.value?.intValue,
      endPoint: el.attributes.find((attr) => attr.key === 'http.url')?.value?.stringValue,
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
                  { key: 'http.request_content_length_uncompressed', value: { intValue: 53 } },
                  { key: 'http.url', value: { stringValue: 'https://swapi.dev/api/people/4' } },
                  { key: 'http.status_code', value: { intValue: 200 } },
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

//testing overlapping string / array helper function
describe('Testing includesAny helper function.', () => {
  test('Identifies overlapping substrings and array elements.', () => {
    const ignoreEndpoints = ['localhost', 'socket', 'nextjs'];
    const testOne = 'https://swapi.dev/api/people/4';
    const testTwo = 'https://localhost:4000';
    expect(includesAny(ignoreEndpoints, testOne)).toEqual(false);
    expect(includesAny(ignoreEndpoints, testTwo)).toEqual(true);
  });

  test('Handles an empty array.', () => {
    const emptyArray = [];
    const testString = 'https://swapi.dev/api/people/4';
    expect(includesAny(emptyArray, testString)).toEqual(false);
  });

  test('Handles an empty string.', () => {
    const ignoreEndpoints = ['localhost', 'socket', 'nextjs'];
    expect(includesAny(ignoreEndpoints, '')).toEqual(false);
  });
});

//testing parseHTTP handler
describe('Testing parseHTTP output.', () => {
  test('Request body is deconstructed correctly.', () => {
    const clientObj = parseHTTP(fakeReq)[0];
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
    const clientObj = parseHTTP(fakeReq)[0];
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
    const clientObj = parseHTTP(fakeReq)[0];
    expect(clientObj.spanId).toEqual('9asdv922as2');
    expect(clientObj.traceId).toEqual('5c263067fe3');
    expect(clientObj.startTime).toEqual(3323);
    expect(clientObj.duration).toEqual(2000);
    expect(clientObj.contentLength).toEqual(57);
    expect(clientObj.statusCode).toEqual(200);
    expect(clientObj.endPoint).toEqual('https://swapi.dev/api/people/4');
    expect(clientObj.requestMethod).toEqual('GET');
    expect(clientObj.requestType).toEqual('HTTPS');
  });

  test('Handles an empty spans array.', () => {
    const emptySpansReq = {
      body: {
        resourceSpans: [
          {
            scopeSpans: [
              {
                spans: [],
              },
            ],
          },
        ],
      },
    };
    expect(parseHTTP(emptySpansReq)).toEqual([]);
  });
});
