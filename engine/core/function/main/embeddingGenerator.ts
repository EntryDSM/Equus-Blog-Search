import { getCachedModel } from '../../model/modelLoader';
import { emit } from '../../../event/handler';
import logger from '../../../log/logger';

let embeddingsCache: Record<string, number[]> = {};

export async function generateTextEmbedding(text: string): Promise<number[]> {
    if (embeddingsCache[text]) {
        emit('embeddingCacheHit', { text, embedding: embeddingsCache[text] });
        logger.info(`텍스트 "${text}"에 대한 임베딩을 캐시에서 찾았습니다.`);
        return embeddingsCache[text];
    }

    const cachedModel = getCachedModel();
    if (!cachedModel) {
        throw logger.error('모델이 로드되지 않았습니다.');
    }

    try {
        emit('embeddingGenerationStarted', text);
        const embeddingTensor = await cachedModel.embed(text);
        const [embeddingArray] = await embeddingTensor.array();
        embeddingTensor.dispose();
        
        embeddingsCache[text] = embeddingArray;

        emit('embeddingGenerated', { text, embeddingArray });
        logger.info(`텍스트 "${text}"에 대한 임베딩을 생성했습니다.`);
        return embeddingArray;
    } catch (error) {
        emit('embeddingGenerationFailed', { text, error });
        throw new logger.error('임베딩 생성에 실패했습니다.');
    }
}
