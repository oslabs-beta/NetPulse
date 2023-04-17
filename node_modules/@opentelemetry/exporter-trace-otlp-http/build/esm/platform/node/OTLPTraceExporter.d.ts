import { ReadableSpan, SpanExporter } from '@opentelemetry/sdk-trace-base';
import { OTLPExporterNodeBase } from '@opentelemetry/otlp-exporter-base';
import { OTLPExporterNodeConfigBase } from '@opentelemetry/otlp-exporter-base';
import { IExportTraceServiceRequest } from '@opentelemetry/otlp-transformer';
/**
 * Collector Trace Exporter for Node
 */
export declare class OTLPTraceExporter extends OTLPExporterNodeBase<ReadableSpan, IExportTraceServiceRequest> implements SpanExporter {
    constructor(config?: OTLPExporterNodeConfigBase);
    convert(spans: ReadableSpan[]): IExportTraceServiceRequest;
    getDefaultUrl(config: OTLPExporterNodeConfigBase): string;
}
//# sourceMappingURL=OTLPTraceExporter.d.ts.map