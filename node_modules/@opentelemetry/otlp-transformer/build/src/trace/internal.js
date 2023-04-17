"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toOtlpSpanEvent = exports.toOtlpLink = exports.sdkSpanToOtlpSpan = void 0;
const core_1 = require("@opentelemetry/core");
const internal_1 = require("../common/internal");
const core = require("@opentelemetry/core");
function sdkSpanToOtlpSpan(span, useHex) {
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
        startTimeUnixNano: (0, core_1.hrTimeToNanoseconds)(span.startTime),
        endTimeUnixNano: (0, core_1.hrTimeToNanoseconds)(span.endTime),
        attributes: (0, internal_1.toAttributes)(span.attributes),
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
exports.sdkSpanToOtlpSpan = sdkSpanToOtlpSpan;
function toOtlpLink(link, useHex) {
    var _a;
    return {
        attributes: link.attributes ? (0, internal_1.toAttributes)(link.attributes) : [],
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
exports.toOtlpLink = toOtlpLink;
function toOtlpSpanEvent(timedEvent) {
    return {
        attributes: timedEvent.attributes
            ? (0, internal_1.toAttributes)(timedEvent.attributes)
            : [],
        name: timedEvent.name,
        timeUnixNano: (0, core_1.hrTimeToNanoseconds)(timedEvent.time),
        droppedAttributesCount: timedEvent.droppedAttributesCount || 0,
    };
}
exports.toOtlpSpanEvent = toOtlpSpanEvent;
//# sourceMappingURL=internal.js.map