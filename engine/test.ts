import { loadModel, generateTextEmbedding } from './embedding';
import { initializeBackend } from './backend';
import * as readline from 'readline';

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

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
}

main().catch((error) => {
    console.error('오류 발생:', error);
});
