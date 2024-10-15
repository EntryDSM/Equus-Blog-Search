import { generateTextEmbedding, convertEmbeddingToLatLon, loadModel, embeddingsCacheStore } from './model';

export function calculateCosineSimilarity(vectorA: number[], vectorB: number[]): number {
    const dotProduct = vectorA.reduce((sum, value, index) => sum + value * vectorB[index], 0);
    const magnitudeA = Math.sqrt(vectorA.reduce((sum, value) => sum + value * value, 0));
    const magnitudeB = Math.sqrt(vectorB.reduce((sum, value) => sum + value * value, 0));
    return dotProduct / (magnitudeA * magnitudeB);
}

export async function getEmbeddingForText(model: any, text: string): Promise<number[]> {
    if (embeddingsCacheStore[text]) {
        return embeddingsCacheStore[text].embedding;
    }

    const embedding = await generateTextEmbedding(model, text);
    const latLon = convertEmbeddingToLatLon(embedding);
    embeddingsCacheStore[text] = { embedding, latitude: latLon.latitude, longitude: latLon.longitude };
    return embedding;
}

export async function calculateSimilarity(inputVector: number[], article: string, model: any): Promise<number | null> {
    let articleVector;

    if (embeddingsCacheStore[article]) {
        articleVector = embeddingsCacheStore[article].embedding;
    } else {
        try {
            articleVector = await generateTextEmbedding(model, article);
            const latLon = convertEmbeddingToLatLon(articleVector);
            embeddingsCacheStore[article] = { embedding: articleVector, latitude: latLon.latitude, longitude: latLon.longitude };
        } catch (error) {
            console.error(`임베딩 중 오류가 발생하였습니다. : "${article.substring(0, 30)}..."`, error);
            return null;
        }
    }

    return calculateCosineSimilarity(inputVector, articleVector);
}

export async function findMostSimilarArticle(inputText: string, articles: string[]): Promise<string | null> {
    const model = await loadModel();
    console.log('현재 리소스 사용량 :');

    const inputVector = await getEmbeddingForText(model, inputText);

    let mostSimilarArticle: string | null = null;
    let highestSimilarity = -1;

    for (const article of articles) {
        const similarity = await calculateSimilarity(inputVector, article, model);
        if (similarity !== null && similarity > highestSimilarity) {
            highestSimilarity = similarity;
            mostSimilarArticle = article;
        }
    }

    return mostSimilarArticle;
}
