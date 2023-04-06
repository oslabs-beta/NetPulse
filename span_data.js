const spanData = [
  {
    traceId: "c580670b2bea883fc14b205e1f36c3eb",
    spanId: "b1db59b8f1d937fb",
    name: "POST",
    kind: 2,
    startTimeUnixNano: 1680708325476000000,
    endTimeUnixNano: 1680708325479506000,
    attributes: [
      {
        key: "http.url",
        value: { stringValue: "http://localhost:4000/" },
      },
      { key: "http.host", value: { stringValue: "localhost:4000" } },
      { key: "net.host.name", value: { stringValue: "localhost" } },
      { key: "http.method", value: { stringValue: "POST" } },
      { key: "http.scheme", value: { stringValue: "http" } },
      { key: "http.target", value: { stringValue: "/" } },
      {
        key: "http.request_content_length_uncompressed",
        value: { intValue: 3419 },
      },
      { key: "http.flavor", value: { stringValue: "1.1" } },
      { key: "net.transport", value: { stringValue: "ip_tcp" } },
      { key: "net.host.ip", value: { stringValue: "::1" } },
      { key: "net.host.port", value: { intValue: 4000 } },
      { key: "net.peer.ip", value: { stringValue: "::1" } },
      { key: "net.peer.port", value: { intValue: 64572 } },
      { key: "http.status_code", value: { intValue: 200 } },
      { key: "http.status_text", value: { stringValue: "OK" } },
    ],
    droppedAttributesCount: 0,
    events: [],
    droppedEventsCount: 0,
    status: { code: 0 },
    links: [],
    droppedLinksCount: 0,
  },
  {
    traceId: "e48bbec42f6ef4716b8bcf40084ee899",
    spanId: "75bb1157f302bf33",
    name: "POST",
    kind: 2,
    startTimeUnixNano: 1680708326196000000,
    endTimeUnixNano: 1680708326199364600,
    attributes: [
      {
        key: "http.url",
        value: { stringValue: "http://localhost:4000/" },
      },
      { key: "http.host", value: { stringValue: "localhost:4000" } },
      { key: "net.host.name", value: { stringValue: "localhost" } },
      { key: "http.method", value: { stringValue: "POST" } },
      { key: "http.scheme", value: { stringValue: "http" } },
      { key: "http.target", value: { stringValue: "/" } },
      {
        key: "http.request_content_length_uncompressed",
        value: { intValue: 5621 },
      },
      { key: "http.flavor", value: { stringValue: "1.1" } },
      { key: "net.transport", value: { stringValue: "ip_tcp" } },
      { key: "net.host.ip", value: { stringValue: "::1" } },
      { key: "net.host.port", value: { intValue: 4000 } },
      { key: "net.peer.ip", value: { stringValue: "::1" } },
      { key: "net.peer.port", value: { intValue: 64573 } },
      { key: "http.status_code", value: { intValue: 200 } },
      { key: "http.status_text", value: { stringValue: "OK" } },
    ],
    droppedAttributesCount: 0,
    events: [],
    droppedEventsCount: 0,
    status: { code: 0 },
    links: [],
    droppedLinksCount: 0,
  },
];

const packageObj = spanData[0].attributes.find(
  (obj) => obj.key === "http.request_content_length_uncompressed"
);

console.log(packageObj);
