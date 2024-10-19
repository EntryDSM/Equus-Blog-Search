import * as tf from '@tensorflow/tfjs-node';
import { loadModel, generateTextEmbedding, findMostSimilarArticle, getCachedEmbedding, createEmbeddingAndCache } from './embedding';
import { initializeBackend } from './backend';
import { ArticleData } from './types';
import * as readline from 'readline';

async function processInput(rl: readline.Interface, articlesData: ArticleData[]) {
    rl.question('비교할 텍스트를 입력하세요 (종료하려면 "exit" 입력): ', async (inputText) => {
        if (inputText.toLowerCase() === 'exit') {
            console.log('프로그램을 종료합니다.');
            rl.close();
            return;
        }

        let inputEmbeddingData = getCachedEmbedding(inputText);

        if (!inputEmbeddingData) {
            inputEmbeddingData = await createEmbeddingAndCache(inputText);
        }

        const mostSimilarArticle = await findMostSimilarArticle(inputEmbeddingData.embedding, articlesData);

        if (mostSimilarArticle) {
            console.log('가장 유사한 기사:', mostSimilarArticle);
        } else {
            console.log('유사한 기사를 찾을 수 없습니다.');
        }

        processInput(rl, articlesData);
    });
}

async function main() {
    await initializeBackend();
    await loadModel();

    const articlesData: ArticleData[] = [
        { text: 'Machine learning is a method of data analysis that automates analytical model building.', embeddingData: { embedding: [], latitude: 0, longitude: 0 } },
        { text: 'Artificial intelligence (AI) refers to the simulation of human intelligence in machines.', embeddingData: { embedding: [], latitude: 0, longitude: 0 } },
        { text: 'Deep learning is part of a broader family of machine learning methods based on artificial neural networks.', embeddingData: { embedding: [], latitude: 0, longitude: 0 } },
        { text: 'Neural networks are a set of algorithms, modeled loosely after the human brain, designed to recognize patterns.', embeddingData: { embedding: [], latitude: 0, longitude: 0 } },
        { text: 'Natural language processing (NLP) is a field of AI that gives machines the ability to read and understand human language.', embeddingData: { embedding: [], latitude: 0, longitude: 0 } },
        { text: 'Support vector machines are supervised learning models used for classification and regression analysis.', embeddingData: { embedding: [], latitude: 0, longitude: 0 } },
        { text: 'A decision tree is a decision support tool that uses a tree-like model of decisions and their possible consequences.', embeddingData: { embedding: [], latitude: 0, longitude: 0 } },
        { text: 'Clustering is a type of unsupervised learning that involves grouping data points into clusters.', embeddingData: { embedding: [], latitude: 0, longitude: 0 } },
        { text: 'Reinforcement learning is an area of machine learning concerned with how agents ought to take actions in an environment.', embeddingData: { embedding: [], latitude: 0, longitude: 0 } },
        { text: 'Linear regression is a linear approach to modeling the relationship between a dependent variable and one or more independent variables.', embeddingData: { embedding: [], latitude: 0, longitude: 0 } }
    ];

    for (const article of articlesData) {
        const cachedEmbedding = getCachedEmbedding(article.text);
        if (cachedEmbedding) {
            article.embeddingData = cachedEmbedding;
        } else {
            const embedding = await generateTextEmbedding(article.text);
            article.embeddingData.embedding = embedding;
        }
    }

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    processInput(rl, articlesData);
}

main().catch((error) => {
    console.error('오류 발생:', error);
});
