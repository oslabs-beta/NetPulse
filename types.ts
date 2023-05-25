export interface DataType {
  spanId: string;
  traceId: string;
  startTime: number;
  duration: number;
  contentLength: number | null;
  statusCode: number;
  endPoint: string;
  requestType: string;
  requestMethod: string;
}

export interface SideBarProps {
  resetData: () => void; 
}