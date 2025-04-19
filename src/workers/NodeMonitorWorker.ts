import 'module-alias/register';
import { parentPort, workerData } from 'worker_threads';
import { NodeMonitor } from '../services/NodeMonitor';
import { DataBase } from '../services/DataBase';
import * as config from '../config';

(async () => {
	await DataBase.connect(config.db.MONGODB_ENDPOINT);
	try {
		const monitor = await new NodeMonitor(workerData.interval).init();

		await monitor.start();
		parentPort?.postMessage('NodeMonitor finished successfully');
	} catch (error) {
		if (error instanceof Error) {
			parentPort?.postMessage(`NodeMonitor encountered an error: ${error.message}`);
		} else {
			parentPort?.postMessage('NodeMonitor encountered an unknown error');
		}
	}
})();
