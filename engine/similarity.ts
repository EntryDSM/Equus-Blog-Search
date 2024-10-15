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
    let inputLatLon;

    if (cachedEmbeddingsStore[inputText]) {
        inputVector = cachedEmbeddingsStore[inputText].embedding;
        inputLatLon = { latitude: cachedEmbeddingsStore[inputText].latitude, longitude: cachedEmbeddingsStore[inputText].longitude };
    } else {
        inputVector = await generateTextEmbedding(model, inputText);
        inputLatLon = convertEmbeddingToLatLon(inputVector);
        cachedEmbeddingsStore[inputText] = { embedding: inputVector, latitude: inputLatLon.latitude, longitude: inputLatLon.longitude };
    }

    let mostSimilarArticle: string | null = null;
    let highestSimilarity = -1;

    const articleVectors = await Promise.all(articles.map(async (article) => {
        if (cachedEmbeddingsStore[article]) {
            return cachedEmbeddingsStore[article];
        } else {
            try {
                const embedding = await generateTextEmbedding(model, article);
                const latLon = convertEmbeddingToLatLon(embedding);
                cachedEmbeddingsStore[article] = { embedding, latitude: latLon.latitude, longitude: latLon.longitude };
                return cachedEmbeddingsStore[article];
            } catch (error) {
                console.error(`임베딩 중 오류가 발생하였습니다. : "${article.substring(0, 30)}..."`, error);
                return null;
            }
        }
    }));

    for (let i = 0; i < articles.length; i++) {
        const articleData = articleVectors[i];
        if (articleData) {
            const similarity = calculateCosineSimilarity(inputVector, articleData.embedding);
            if (similarity > highestSimilarity) {
                highestSimilarity = similarity;
                mostSimilarArticle = articles[i];
            }
        }
    }

    return mostSimilarArticle;
}
