import { toResourceMetrics } from './internal';
export function createExportMetricsServiceRequest(resourceMetrics) {
    return {
        resourceMetrics: resourceMetrics.map(function (metrics) { return toResourceMetrics(metrics); }),
    };
}
//# sourceMappingURL=index.js.map