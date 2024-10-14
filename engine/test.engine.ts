import * as tf from '@tensorflow/tfjs-node';
import * as use from '@tensorflow-models/universal-sentence-encoder';

tf.setBackend('tensorflow');
tf.ready().then(() => {
  console.log('TensorFlow.js 백엔드가 준비되었습니다.');
});

function cosineSimilarity(vecA: number[], vecB: number[]): number {
  const dotProduct = vecA.reduce((sum, a, idx) => sum + a * vecB[idx], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

function logMemoryUsage() {
  const memoryUsage = process.memoryUsage();
  console.log(`Node.js Memory Usage:
    RSS: ${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB
    Heap Total: ${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MB
    Heap Used: ${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB
    External: ${(memoryUsage.external / 1024 / 1024).toFixed(2)} MB
  `);
}

function logCpuUsage() {
  const startUsage = process.cpuUsage();
  setTimeout(() => {
    const endUsage = process.cpuUsage(startUsage);
    console.log(`CPU Usage:
      User: ${endUsage.user / 1000000} seconds
      System: ${endUsage.system / 1000000} seconds
    `);
  }, 1000);
}

async function getClosestArticles(inputText: string, articles: string[]): Promise<string | null> {
  const model = await use.load();
  
  console.log("Universal Sentence Encoder 모델이 로드되었습니다. 현재 자원 사용량:");
  logMemoryUsage();

  console.log("입력 텍스트:", inputText);

  try {
    const inputEmbedding = await model.embed(inputText);
    const inputVec = inputEmbedding.arraySync()[0];

    let bestArticle: string | null = null;
    let bestSimilarity = -1;

    for (const article of articles) {
      const articleEmbedding = await model.embed(article);
      const articleVec = articleEmbedding.arraySync()[0];

      const similarity = cosineSimilarity(inputVec, articleVec);
      console.log(`Article: "${article.substring(0, 30)}...", Similarity: ${similarity}`);
      if (similarity > bestSimilarity) {
        bestSimilarity = similarity;
        bestArticle = article;
      }
    }

    logMemoryUsage();
    logCpuUsage();

    return bestArticle;
  } catch (error) {
    console.error("Error during processing:", error);
    return null;
  }
}

// 예제 글 목록
const articles = [
  "The quick brown fox jumps over the lazy dog.",
  "JavaScript is a versatile programming language.",
  "TensorFlow.js helps to run machine learning models in the browser.",
  "Artificial Intelligence and Machine Learning are transforming industries.",
  "Python is a popular language for data science and machine learning."
];

// 입력 텍스트를 변수로 정의
const text = "I want to learn about machine learning and AI.";

// 실행
(async () => {
  const relatedArticle = await getClosestArticles(text, articles);
  console.log("주제와 가장 근접한 글:", relatedArticle);
})();
