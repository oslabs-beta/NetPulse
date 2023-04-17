import { toResourceMetrics } from './internal';
export function createExportMetricsServiceRequest(resourceMetrics) {
    return {
        resourceMetrics: resourceMetrics.map(metrics => toResourceMetrics(metrics)),
    };
}
//# sourceMappingURL=index.js.map