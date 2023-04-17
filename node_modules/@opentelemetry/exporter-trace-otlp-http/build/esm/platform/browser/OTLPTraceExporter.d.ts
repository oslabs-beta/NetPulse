import { ReadableSpan, SpanExporter } from '@opentelemetry/sdk-trace-base';
import { OTLPExporterConfigBase, OTLPExporterBrowserBase } from '@opentelemetry/otlp-exporter-base';
import { IExportTraceServiceRequest } from '@opentelemetry/otlp-transformer';
/**
 * Collector Trace Exporter for Web
 */
export declare class OTLPTraceExporter extends OTLPExporterBrowserBase<ReadableSpan, IExportTraceServiceRequest> implements SpanExporter {
    constructor(config?: OTLPExporterConfigBase);
    convert(spans: ReadableSpan[]): IExportTraceServiceRequest;
    getDefaultUrl(config: OTLPExporterConfigBase): string;
}
//# sourceMappingURL=OTLPTraceExporter.d.ts.map