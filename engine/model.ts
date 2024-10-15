import * as use from '@tensorflow-models/universal-sentence-encoder';

let cachedModel: any = null;
let embeddingsCache: { [key: string]: { embedding: number[], latitude: number, longitude: number } } = {};

export async function loadModel(): Promise<any> {
    if (!cachedModel) {
        cachedModel = await use.load();
        console.log('Universal Sentence Encoder 모델이 성공적으로 로드되었습니다.');
    }
    return cachedModel;
}

export async function generateTextEmbedding(model: any, text: string): Promise<number[]> {
    try {
        const embeddingTensor = await model.embed(text);
        const [embeddingArray] = await embeddingTensor.array();
        embeddingTensor.dispose();
        return embeddingArray;
    } catch (error) {
        console.error('텍스트 임베딩 생성 중 오류 발생:', error);
        throw new Error('임베딩 생성을 다시 시도하십시오.');
    }
}

export function convertEmbeddingToLatLon(embedding: number[]): { latitude: number, longitude: number } {
    const latitude = embedding[0] % 90;
    const longitude = embedding[1] % 180;
    return { latitude, longitude };
}

export const embeddingsCacheStore = embeddingsCache;
