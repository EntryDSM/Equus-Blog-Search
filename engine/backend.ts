import * as tf from '@tensorflow/tfjs-node';

export async function initializeBackend(): Promise<void> {
	await tf.ready();
}

export function logMemoryUsage(): void {
	const memoryUsage = process.memoryUsage();
	console.log(`Node JS 메모리 사용량:
    	RSS: ${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB
      	Heap Total: ${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MB
      	Heap Used: ${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB
      	External: ${(memoryUsage.external / 1024 / 1024).toFixed(2)} MB
    `);
}

export function logCpuUsage(): void {
	const startUsage = process.cpuUsage();
	const LOG_DELAY_MS = 1000;

	setTimeout(() => {
			const endUsage = process.cpuUsage(startUsage);
			console.log(`CPU 사용량:
        	User: ${(endUsage.user / 1_000_000).toFixed(2)} seconds
        	System: ${(endUsage.system / 1_000_000).toFixed(2)} seconds
      	`);
	}, LOG_DELAY_MS);
}
