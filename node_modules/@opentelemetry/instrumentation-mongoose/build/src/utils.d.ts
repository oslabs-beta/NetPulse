import { SpanAttributes, Span } from '@opentelemetry/api';
import type { Collection } from 'mongoose';
import { MongooseResponseCustomAttributesFunction } from './types';
export declare function getAttributesFromCollection(collection: Collection): SpanAttributes;
export declare function handlePromiseResponse(execResponse: any, span: Span, responseHook?: MongooseResponseCustomAttributesFunction, moduleVersion?: string | undefined): any;
export declare function handleCallbackResponse(callback: Function, exec: Function, originalThis: any, span: Span, responseHook?: MongooseResponseCustomAttributesFunction, moduleVersion?: string | undefined): any;
//# sourceMappingURL=utils.d.ts.map