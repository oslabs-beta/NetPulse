const provider = require('./instrumentation');

provider.register();

require('./tracingServer');
require('./mongooseSetup');
