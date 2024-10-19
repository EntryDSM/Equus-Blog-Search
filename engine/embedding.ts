import * as use from '@tensorflow-models/universal-sentence-encoder';
import { emit } from './handler';
import { ContentData } from './types';

let cachedModel: use.UniversalSentenceEncoder | null = null;
let embeddingsCache: Record<string, number[]> = {};

export async function loadModel(): Promise<use.UniversalSentenceEncoder> {
    if (!cachedModel) {
        emit('modelLoading');
        cachedModel = await use.load();
        emit('modelLoaded', cachedModel);
    }
    return cachedModel;
}

export async function generateTextEmbedding(text: string): Promise<number[]> {
    if (embeddingsCache[text]) {
        emit('embeddingCacheHit', { text, embedding: embeddingsCache[text] });
        return embeddingsCache[text];
    }

    if (!cachedModel) {
        throw new Error('모델이 로드되지 않았습니다.');
    }

    try {
        emit('embeddingGenerationStarted', text);
        const embeddingTensor = await cachedModel.embed(text);
        const [embeddingArray] = await embeddingTensor.array();
        embeddingTensor.dispose();
        
        embeddingsCache[text] = embeddingArray;

        emit('embeddingGenerated', { text, embeddingArray });
        return embeddingArray;
    } catch (error) {
        emit('embeddingGenerationFailed', { text, error });
        throw new Error('임베딩 생성에 실패했습니다.');
    }
}

export function calculateCosineSimilarity(vectorA: number[], vectorB: number[]): number {
    const dotProduct = vectorA.reduce((sum, value, index) => sum + value * vectorB[index], 0);
    const magnitudeA = Math.sqrt(vectorA.reduce((sum, value) => sum + value * value, 0));
    const magnitudeB = Math.sqrt(vectorB.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magnitudeA * magnitudeB);
}
