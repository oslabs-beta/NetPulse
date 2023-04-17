import type { Link } from '@opentelemetry/api';
import type { ReadableSpan, TimedEvent } from '@opentelemetry/sdk-trace-base';
import { IEvent, ILink, ISpan } from './types';
export declare function sdkSpanToOtlpSpan(span: ReadableSpan, useHex?: boolean): ISpan;
export declare function toOtlpLink(link: Link, useHex?: boolean): ILink;
export declare function toOtlpSpanEvent(timedEvent: TimedEvent): IEvent;
//# sourceMappingURL=internal.d.ts.map