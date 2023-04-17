import { InstrumentationBase, InstrumentationNodeModuleDefinition } from '@opentelemetry/instrumentation';
import type * as pgTypes from 'pg';
import type * as pgPoolTypes from 'pg-pool';
import { PgInstrumentationConfig } from './types';
export declare class PgInstrumentation extends InstrumentationBase {
    static readonly COMPONENT = "pg";
    static readonly BASE_SPAN_NAME: string;
    constructor(config?: PgInstrumentationConfig);
    protected init(): (InstrumentationNodeModuleDefinition<typeof pgTypes> | InstrumentationNodeModuleDefinition<typeof pgPoolTypes>)[];
    setConfig(config?: PgInstrumentationConfig): void;
    getConfig(): PgInstrumentationConfig;
    private _getClientConnectPatch;
    private _getClientQueryPatch;
    private _getPoolConnectPatch;
}
//# sourceMappingURL=instrumentation.d.ts.map