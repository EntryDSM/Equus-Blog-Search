import { initializeBackend, logMemoryUsage, logCpuUsage } from './backend';
import { findMostSimilarArticle } from './similarity';

async function run(): Promise<void> {
    await initializeBackend();

    const articles = [
        'The quick brown fox jumps over the lazy dog.',
        'JavaScript is a versatile programming language.',
        'TensorFlow.js helps to run machine learning models in the browser.',
        'Artificial Intelligence and Machine Learning are transforming industries.',
        'Python is a popular language for data science and machine learning.'
    ];

    const inputText = 'javascript programming language';
    const relatedArticle = await findMostSimilarArticle(inputText, articles);

    console.log('가장 유사한 문장:', relatedArticle);

    logMemoryUsage();
    logCpuUsage();
}

run();
