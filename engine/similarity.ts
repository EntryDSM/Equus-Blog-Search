import { generateTextEmbedding, convertEmbeddingToLatLon, loadModel, cachedEmbeddingsStore } from './model';

export function calculateCosineSimilarity(vectorA: number[], vectorB: number[]): number {
    const dotProduct = vectorA.reduce((sum, value, index) => sum + value * vectorB[index], 0);
    const magnitudeA = Math.sqrt(vectorA.reduce((sum, value) => sum + value * value, 0));
    const magnitudeB = Math.sqrt(vectorB.reduce((sum, value) => sum + value * value, 0));
    return dotProduct / (magnitudeA * magnitudeB);
}

export async function findMostSimilarArticle(inputText: string, articles: string[]): Promise<string | null> {
    const model = await loadModel();
    console.log('현재 리소스 사용량 :');

    let inputVector;
    if (cachedEmbeddingsStore[inputText]) {
        inputVector = cachedEmbeddingsStore[inputText].embedding;
    } else {
        inputVector = await generateTextEmbedding(model, inputText);
        const latLon = convertEmbeddingToLatLon(inputVector);
        cachedEmbeddingsStore[inputText] = { embedding: inputVector, latitude: latLon.latitude, longitude: latLon.longitude };
    }

    let mostSimilarArticle: string | null = null;
    let highestSimilarity = -1;

    for (let i = 0; i < articles.length; i++) {
        const article = articles[i];
        let articleVector;

        if (cachedEmbeddingsStore[article]) {
            articleVector = cachedEmbeddingsStore[article].embedding;
        } else {
            try {
                articleVector = await generateTextEmbedding(model, article);
                const latLon = convertEmbeddingToLatLon(articleVector);
                cachedEmbeddingsStore[article] = { embedding: articleVector, latitude: latLon.latitude, longitude: latLon.longitude };
            } catch (error) {
                console.error(`임베딩 중 오류가 발생하였습니다. : "${article.substring(0, 30)}..."`, error);
                continue;
            }
        }

        const similarity = calculateCosineSimilarity(inputVector, articleVector);
        if (similarity > highestSimilarity) {
            highestSimilarity = similarity;
            mostSimilarArticle = article;
        }
    }

    return mostSimilarArticle;
}
