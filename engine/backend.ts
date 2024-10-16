import * as tf from '@tensorflow/tfjs-node';

let maxMemoryUsage = {
	rss: 0,
	heapTotal: 0,
	heapUsed: 0,
	external: 0,
};

let maxCpuUsage = {
	user: 0,
	system: 0,
};

export async function initializeBackend(): Promise<void> {
	await tf.ready();
	console.log('TensorFlow 백엔드가 초기화되었습니다.');
}

export function logMemoryUsage(): void {
	const memoryUsage = process.memoryUsage();

	maxMemoryUsage.rss = Math.max(maxMemoryUsage.rss, memoryUsage.rss);
	maxMemoryUsage.heapTotal = Math.max(maxMemoryUsage.heapTotal, memoryUsage.heapTotal);
	maxMemoryUsage.heapUsed = Math.max(maxMemoryUsage.heapUsed, memoryUsage.heapUsed);
	maxMemoryUsage.external = Math.max(maxMemoryUsage.external, memoryUsage.external);

	console.log(`\nNode.js 메모리 사용량:
  RSS: ${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB
  Heap Total: ${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MB
  Heap Used: ${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB
  External: ${(memoryUsage.external / 1024 / 1024).toFixed(2)} MB
  `);

	console.log(`최고 메모리 사용량:
  RSS: ${(maxMemoryUsage.rss / 1024 / 1024).toFixed(2)} MB
  Heap Total: ${(maxMemoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MB
  Heap Used: ${(maxMemoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB
  External: ${(maxMemoryUsage.external / 1024 / 1024).toFixed(2)} MB
  `);
}

let lastCpuUsage = process.cpuUsage();

export function logCpuUsage(): void {
	const LOG_DELAY_MS = 1000;

	setTimeout(() => {
		const currentCpuUsage = process.cpuUsage(lastCpuUsage);
		lastCpuUsage = process.cpuUsage();

		maxCpuUsage.user = Math.max(maxCpuUsage.user, currentCpuUsage.user);
		maxCpuUsage.system = Math.max(maxCpuUsage.system, currentCpuUsage.system);

		console.log(`\nCPU 사용량 (최근 1초):
  User: ${(currentCpuUsage.user / 1_000_000).toFixed(2)} 초
  System: ${(currentCpuUsage.system / 1_000_000).toFixed(2)} 초
  `);

		console.log(`최고 CPU 사용량:
  User: ${(maxCpuUsage.user / 1_000_000).toFixed(2)} 초
  System: ${(maxCpuUsage.system / 1_000_000).toFixed(2)} 초
  `);
	}, LOG_DELAY_MS);
}

export function startLoggingResources(intervalMs: number = 5000): void {
	setInterval(() => {
		logMemoryUsage();
		logCpuUsage();
	}, intervalMs);
}
