import { MetricData, ResourceMetrics, ScopeMetrics } from '@opentelemetry/sdk-metrics';
import { IMetric, IResourceMetrics, IScopeMetrics } from './types';
export declare function toResourceMetrics(resourceMetrics: ResourceMetrics): IResourceMetrics;
export declare function toScopeMetrics(scopeMetrics: ScopeMetrics[]): IScopeMetrics[];
export declare function toMetric(metricData: MetricData): IMetric;
//# sourceMappingURL=internal.d.ts.map