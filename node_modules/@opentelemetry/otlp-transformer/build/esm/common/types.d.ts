/** Properties of an InstrumentationScope. */
export interface IInstrumentationScope {
    /** InstrumentationScope name */
    name: string;
    /** InstrumentationScope version */
    version?: string;
}
/** Properties of a KeyValue. */
export interface IKeyValue {
    /** KeyValue key */
    key: string;
    /** KeyValue value */
    value: IAnyValue;
}
/** Properties of an AnyValue. */
export interface IAnyValue {
    /** AnyValue stringValue */
    stringValue?: string | null;
    /** AnyValue boolValue */
    boolValue?: boolean | null;
    /** AnyValue intValue */
    intValue?: number | null;
    /** AnyValue doubleValue */
    doubleValue?: number | null;
    /** AnyValue arrayValue */
    arrayValue?: IArrayValue;
    /** AnyValue kvlistValue */
    kvlistValue?: IKeyValueList;
    /** AnyValue bytesValue */
    bytesValue?: Uint8Array;
}
/** Properties of an ArrayValue. */
export interface IArrayValue {
    /** ArrayValue values */
    values: IAnyValue[];
}
/** Properties of a KeyValueList. */
export interface IKeyValueList {
    /** KeyValueList values */
    values: IKeyValue[];
}
//# sourceMappingURL=types.d.ts.map