import 'module-alias/register';
import { parentPort, workerData } from 'worker_threads';
import { GeolocationMonitor } from '../services/GeolocationMonitor';
import { DataBase } from '../services/DataBase';
import * as config from '../config';

(async () => {
	await DataBase.connect(config.db.MONGODB_ENDPOINT);

	try {
		const monitor = new GeolocationMonitor(workerData.interval);

		await monitor.start();
		parentPort?.postMessage('GeolocationMonitor finished successfully');
	} catch (error) {
		if (error instanceof Error) {
			parentPort?.postMessage(`GeolocationMonitor encountered an error: ${error.message}`);
		} else {
			parentPort?.postMessage('GeolocationMonitor encountered an unknown error');
		}
	}
})();
