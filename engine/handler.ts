import { loadModel, generateTextEmbedding } from './embedding';
import logger from './logger';

const eventListeners: Record<string, Function[]> = {};

export function on(event: string, listener: Function) {
    if (!eventListeners[event]) {
        eventListeners[event] = [];
    }
    eventListeners[event].push(listener);
}

export function emit(event: string, data?: any) {
    if (eventListeners[event]) {
        eventListeners[event].forEach(listener => listener(data));
    }
}

export async function handleContentAddedEvent(content: { id: string; text: string }) {
    try {
        emit('modelLoading');
        const model = await loadModel();
        emit('modelLoaded', model);

        const embedding = await generateTextEmbedding(content.text);
        emit('embeddingGenerated', { contentId: content.id, embedding });

        logger.info(`콘텐츠 ID: ${content.id} 임베딩:`, embedding);
    } catch (error) {
        logger.error('임베딩 생성 중 오류 발생:', error);
    }
}

on('embeddingCacheHit', ({ text, embedding }) => {
    logger.info(`텍스트 "${text}"에 대한 캐시 적중. 캐시된 임베딩 사용.`);
});

on('modelLoading', () => {
    logger.info('모델을 로드 중...');
});

on('modelLoaded', (model) => {
    logger.info('모델이 로드되었습니다:', model);
});

on('embeddingGenerated', (data) => {
    logger.info(`콘텐츠 ID ${data.contentId}에 대한 임베딩이 생성되었습니다:`, data.embedding);
});
