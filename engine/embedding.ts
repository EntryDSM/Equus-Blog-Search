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
    model: use.UniversalSentenceEncoder,
    text: string
): Promise<number[]> {
    try {
        const embeddingTensor = await model.embed(text);
        const [embeddingArray] = await embeddingTensor.array();
        embeddingTensor.dispose();
        return embeddingArray;
    } catch (error) {
        console.error(`Error generating embedding for text: "${text}".`, error);
        throw new Error('임베딩 생성을 다시 시도하십시오.');
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

export async function processEmbeddings(
    inputText: string,
    articles: string[],
    model: use.UniversalSentenceEncoder
): Promise<{ inputEmbedding: number[]; articlesData: ArticleData[] }> {
    const inputEmbedding = await getEmbeddingArray(inputText, model);
    const articlesData = await processArticlesEmbeddings(articles, model);
    return { inputEmbedding, articlesData };
}

async function processArticlesEmbeddings(
    articles: string[],
    model: use.UniversalSentenceEncoder
): Promise<ArticleData[]> {
    return await Promise.all(
        articles.map(async (article) => {
            const embeddingData = await getEmbedding(article, model);
            return { text: article, embeddingData };
        })
    );
}

async function getEmbedding(text: string, model: use.UniversalSentenceEncoder): Promise<EmbeddingData> {
    const cachedEmbedding = getCachedEmbedding(text);
    if (cachedEmbedding) {
        return cachedEmbedding;
    }
    return await createEmbeddingAndCache(text, model);
}

async function getEmbeddingArray(text: string, model: use.UniversalSentenceEncoder): Promise<number[]> {
    const embeddingData = await getEmbedding(text, model);
    return embeddingData.embedding;
}

function getCachedEmbedding(text: string): EmbeddingData | null {
    return embeddingsCache[text] || null;
}

async function createEmbeddingAndCache(text: string, model: use.UniversalSentenceEncoder): Promise<EmbeddingData> {
    const embedding = await generateTextEmbedding(model, text);
    const embeddingData: EmbeddingData = { embedding, latitude: 0, longitude: 0 };
    embeddingsCache[text] = embeddingData;
    return embeddingData;
}


export const embeddingsCacheStore = embeddingsCache;
