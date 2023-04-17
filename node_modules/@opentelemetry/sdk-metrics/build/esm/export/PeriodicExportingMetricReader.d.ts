import { MetricReader } from './MetricReader';
import { PushMetricExporter } from './MetricExporter';
export declare type PeriodicExportingMetricReaderOptions = {
    /**
     * The backing exporter for the metric reader.
     */
    exporter: PushMetricExporter;
    /**
     * An internal milliseconds for the metric reader to initiate metric
     * collection.
     */
    exportIntervalMillis?: number;
    /**
     * Milliseconds for the async observable callback to timeout.
     */
    exportTimeoutMillis?: number;
};
/**
 * {@link MetricReader} which collects metrics based on a user-configurable time interval, and passes the metrics to
 * the configured {@link PushMetricExporter}
 */
export declare class PeriodicExportingMetricReader extends MetricReader {
    private _interval?;
    private _exporter;
    private readonly _exportInterval;
    private readonly _exportTimeout;
    constructor(options: PeriodicExportingMetricReaderOptions);
    private _runOnce;
    private _doRun;
    protected onInitialized(): void;
    protected onForceFlush(): Promise<void>;
    protected onShutdown(): Promise<void>;
}
//# sourceMappingURL=PeriodicExportingMetricReader.d.ts.map