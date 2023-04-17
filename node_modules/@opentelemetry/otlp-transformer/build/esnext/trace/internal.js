import { hrTimeToNanoseconds } from '@opentelemetry/core';
import { toAttributes } from '../common/internal';
import * as core from '@opentelemetry/core';
export function sdkSpanToOtlpSpan(span, useHex) {
    var _a;
    const ctx = span.spanContext();
    const status = span.status;
    const parentSpanId = useHex
        ? span.parentSpanId
        : span.parentSpanId != null
            ? core.hexToBase64(span.parentSpanId)
            : undefined;
    return {
        traceId: useHex ? ctx.traceId : core.hexToBase64(ctx.traceId),
        spanId: useHex ? ctx.spanId : core.hexToBase64(ctx.spanId),
        parentSpanId: parentSpanId,
        traceState: (_a = ctx.traceState) === null || _a === void 0 ? void 0 : _a.serialize(),
        name: span.name,
        // Span kind is offset by 1 because the API does not define a value for unset
        kind: span.kind == null ? 0 : span.kind + 1,
        startTimeUnixNano: hrTimeToNanoseconds(span.startTime),
        endTimeUnixNano: hrTimeToNanoseconds(span.endTime),
        attributes: toAttributes(span.attributes),
        droppedAttributesCount: span.droppedAttributesCount,
        events: span.events.map(toOtlpSpanEvent),
        droppedEventsCount: span.droppedEventsCount,
        status: {
            // API and proto enums share the same values
            code: status.code,
            message: status.message,
        },
        links: span.links.map(link => toOtlpLink(link, useHex)),
        droppedLinksCount: span.droppedLinksCount,
    };
}
export function toOtlpLink(link, useHex) {
    var _a;
    return {
        attributes: link.attributes ? toAttributes(link.attributes) : [],
        spanId: useHex
            ? link.context.spanId
            : core.hexToBase64(link.context.spanId),
        traceId: useHex
            ? link.context.traceId
            : core.hexToBase64(link.context.traceId),
        traceState: (_a = link.context.traceState) === null || _a === void 0 ? void 0 : _a.serialize(),
        droppedAttributesCount: link.droppedAttributesCount || 0,
    };
}
export function toOtlpSpanEvent(timedEvent) {
    return {
        attributes: timedEvent.attributes
            ? toAttributes(timedEvent.attributes)
            : [],
        name: timedEvent.name,
        timeUnixNano: hrTimeToNanoseconds(timedEvent.time),
        droppedAttributesCount: timedEvent.droppedAttributesCount || 0,
    };
}
//# sourceMappingURL=internal.js.map