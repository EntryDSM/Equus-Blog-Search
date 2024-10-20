import * as tf from '@tensorflow/tfjs-node';
import { emit } from './handler';
import logger from './log/logger';

export async function initializeBackend(): Promise<void> {
    emit('backendInitializing');
    await tf.ready();
    emit('backendInitialized');
    logger.info('TensorFlow 백엔드가 초기화되었습니다.');
}
