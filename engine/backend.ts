import * as tf from '@tensorflow/tfjs-node';

export async function initializeBackend(): Promise<void> {
	await tf.ready();
	console.log('TensorFlow 백엔드가 초기화되었습니다.');
}