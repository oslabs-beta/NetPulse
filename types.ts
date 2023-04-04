export interface DataType { 
    spanId: string;
    traceId: string;
    startTime: number;
    duration: number;
    packageSize: number | null;
    statusCode: number;
    endPoint: string;
    requestType: string;
}



