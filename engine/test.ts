import { loadModel } from './core/model/modelLoader';
import { generateTextEmbedding } from './core/function/main/embeddingGenerator';
import { initializeBackend } from './tfjs/initializeBackend';
import { calculateCosineSimilarity } from './core/function/utils/cosineSimilarity';
import logger from './log/logger';

async function main() {

    await initializeBackend();
    await loadModel();

    const contentsData = [
        { text: 'Decision trees are a type of model used for classification.', embeddingData: { embedding: [], latitude: 0, longitude: 0 } },
        { text: 'Clustering is a method used in unsupervised learning.', embeddingData: { embedding: [], latitude: 0, longitude: 0 } },
        { text: 'Decision trees are a type of model used for classification.', embeddingData: { embedding: [], latitude: 0, longitude: 0 } },
    ];

    for (const content of contentsData) {
        content.embeddingData.embedding = await generateTextEmbedding(content.text);
    }

    logger.info(`${contentsData[0].text}과 ${contentsData[1].text}의 유사도 ${calculateCosineSimilarity(contentsData[0].embeddingData.embedding, contentsData[1].embeddingData.embedding).toString()}`);
}

main().catch((error) => {
    logger.error('An error occurred during the execution of the main function.', error);
});
