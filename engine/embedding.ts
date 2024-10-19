import * as use from '@tensorflow-models/universal-sentence-encoder';
import { LatLon, EmbeddingData, ArticleData } from './types';

let cachedModel: use.UniversalSentenceEncoder | null = null;
let embeddingsCache: Record<string, EmbeddingData> = {};

export async function loadModel(): Promise<use.UniversalSentenceEncoder> {
    if (!cachedModel) {
        cachedModel = await use.load();
        console.log('Universal Sentence Encoder 모델이 로드되었습니다.');
    }
    return cachedModel;
}

export async function generateTextEmbedding(
    text: string
): Promise<number[]> {
    if (!cachedModel) {
        throw new Error('모델이 로드되지 않았습니다.');
    }
    try {
        const embeddingTensor = await cachedModel.embed(text);
        const [embeddingArray] = await embeddingTensor.array();
        embeddingTensor.dispose();
        return embeddingArray;
    } catch (error) {
        console.error(`텍스트 "${text}"의 임베딩 생성 중 오류 발생.`, error);
        throw new Error('임베딩 생성에 실패했습니다.');
    }
}

export function calculateCosineSimilarity(vectorA: number[], vectorB: number[]): number {
    const dotProduct = vectorA.reduce((sum, value, index) => sum + value * vectorB[index], 0);
    const magnitudeA = Math.sqrt(vectorA.reduce((sum, value) => sum + value * value, 0));
    const magnitudeB = Math.sqrt(vectorB.reduce((sum, value) => sum + value * value, 0));
    return dotProduct / (magnitudeA * magnitudeB);
}

export async function findMostSimilarArticle(
    inputEmbedding: number[],
    articlesData: ArticleData[]
): Promise<string | null> {
    let mostSimilarArticle: string | null = null;
    let highestSimilarity = -1;

    for (const { text, embeddingData } of articlesData) {
        const similarity = calculateCosineSimilarity(inputEmbedding, embeddingData.embedding);
        if (similarity > highestSimilarity) {
            highestSimilarity = similarity;
            mostSimilarArticle = text;
        }
    }

    return mostSimilarArticle;
}

export function getCachedEmbedding(text: string): EmbeddingData | null {
    return embeddingsCache[text] || null;
}

export async function createEmbeddingAndCache(text: string): Promise<EmbeddingData> {
    const embedding = await generateTextEmbedding(text);
    const embeddingData: EmbeddingData = { embedding, latitude: 0, longitude: 0 };
    embeddingsCache[text] = embeddingData;
    return embeddingData;
}

export const embeddingsCacheStore = embeddingsCache;
