import 'module-alias/register';
import { parentPort, workerData } from 'worker_threads';
import { ChainHeightMonitor } from '../services/ChainHeightMonitor';
import { DataBase } from '../services/DataBase';
import * as config from '../config';

(async () => {
	await DataBase.connect(config.db.MONGODB_ENDPOINT);

	try {
		const monitor = new ChainHeightMonitor(workerData.interval);

		await monitor.start();
		parentPort?.postMessage('ChainHeightMonitor finished successfully');
	} catch (error) {
		parentPort?.postMessage(`ChainHeightMonitor encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}`);
	}
})();
