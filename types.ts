export interface DataType {
  spanId: string;
  traceId: string;
  startTime: number;
  duration: number;
  endTime: number;
  contentLength: number | null;
  statusCode: number;
  endPoint: string;
  requestType: string;
}
