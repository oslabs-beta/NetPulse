/*
    A tsconfig was added to this directory to turn off isolatedModules for this directory
    while leaving the global value of isolatedModules set to true. This is necessary as we
    are using SWC which requires isolatedModules.k
*/

const provider = require('./instrumentation');

provider.register();

require('./tracingServer');
// require('./mongooseSetup');
