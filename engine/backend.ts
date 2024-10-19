import * as tf from '@tensorflow/tfjs-node';
import { emit } from './handler';

export async function initializeBackend(): Promise<void> {
    emit('backendInitializing');
    await tf.ready();
    emit('backendInitialized');
    console.log('TensorFlow 백엔드가 초기화되었습니다.');
}
