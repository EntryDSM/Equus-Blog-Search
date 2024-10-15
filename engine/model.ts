import * as use from '@tensorflow-models/universal-sentence-encoder';

let cachedModel: any = null;
let cachedEmbeddings: { [key: string]: { embedding: number[], latitude: number, longitude: number } } = {};

export async function loadModel(): Promise<any> {
    if (!cachedModel) {
        cachedModel = await use.load();
        console.log('Universal Sentence Encoder model 로드.');
    }
    return cachedModel;
}

export async function generateTextEmbedding(model: any, text: string): Promise<number[]> {
    try {
        const embeddingTensor = await model.embed(text);
        const embeddingArray = (await embeddingTensor.array())[0];
        embeddingTensor.dispose();
        return embeddingArray;
    } catch (error) {
        console.error('임베딩 생성 중 에러:', error);
        throw new Error('임베딩 생성을 다시 하십시오.');
    }
}

export function convertEmbeddingToLatLon(embedding: number[]): { latitude: number, longitude: number } {
    const latitude = embedding[0] % 90;  // 위도 제한을 90도로 적용함.
    const longitude = embedding[1] % 180;  // 경도 제한을 180도로 적용함.
    return { latitude, longitude };
}

export const cachedEmbeddingsStore = cachedEmbeddings;
