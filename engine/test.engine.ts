import * as tf from '@tensorflow/tfjs-node';
import * as use from '@tensorflow-models/universal-sentence-encoder';

tf.setBackend('tensorflow');

let cachedModel: any = null;
let cachedEmbeddings: { [key: string]: { embedding: number[], latitude: number, longitude: number } } = {};

async function initializeBackend(): Promise<void> {
  await tf.ready();
  console.log('TensorFlow.js 백엔드가 준비되었습니다.');
}

async function loadModel(): Promise<any> {
  if (!cachedModel) {
    cachedModel = await use.load();
    console.log('Universal Sentence Encoder 모델이 로드되었습니다.');
  }
  return cachedModel;
}

function calculateCosineSimilarity(vectorA: number[], vectorB: number[]): number {
  const dotProduct = vectorA.reduce((sum, value, index) => sum + value * vectorB[index], 0);
  const magnitudeA = Math.sqrt(vectorA.reduce((sum, value) => sum + value * value, 0));
  const magnitudeB = Math.sqrt(vectorB.reduce((sum, value) => sum + value * value, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

function logMemoryUsage(): void {
  const memoryUsage = process.memoryUsage();
  console.log(`Node.js Memory Usage:
    RSS: ${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB
    Heap Total: ${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MB
    Heap Used: ${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB
    External: ${(memoryUsage.external / 1024 / 1024).toFixed(2)} MB
  `);
}

function logCpuUsage(): void {
  const startUsage = process.cpuUsage();
  const LOG_DELAY_MS = 1000;

  setTimeout(() => {
    const endUsage = process.cpuUsage(startUsage);
    console.log(`CPU Usage:
      User: ${(endUsage.user / 1_000_000).toFixed(2)} seconds
      System: ${(endUsage.system / 1_000_000).toFixed(2)} seconds
    `);
  }, LOG_DELAY_MS);
}

async function generateTextEmbedding(model: any, text: string): Promise<number[]> {
  try {
    const embeddingTensor = await model.embed(text);
    const embeddingArray = (await embeddingTensor.array())[0];
    embeddingTensor.dispose();
    return embeddingArray;
  } catch (error) {
    console.error('임베딩 생성 중 오류 발생:', error);
    throw new Error('임베딩 생성에 실패했습니다. 입력 텍스트를 확인하거나 다시 시도해주세요.');
  }
}

function convertEmbeddingToLatLon(embedding: number[]): { latitude: number, longitude: number } {
  const latitude = embedding[0] % 90; // 90도 제한 적용
  const longitude = embedding[1] % 180; // 180도 제한 적용
  return { latitude, longitude };
}

async function findMostSimilarArticle(inputText: string, articles: string[]): Promise<string | null> {
  const model = await loadModel();
  console.log('현재 자원 사용량:');
  logMemoryUsage();

  console.log('입력 텍스트:', inputText);

  try {
    let inputVector;
    let inputLatLon;
    if (cachedEmbeddings[inputText]) {
      inputVector = cachedEmbeddings[inputText].embedding;
      inputLatLon = { latitude: cachedEmbeddings[inputText].latitude, longitude: cachedEmbeddings[inputText].longitude };
    } else {
      inputVector = await generateTextEmbedding(model, inputText);
      inputLatLon = convertEmbeddingToLatLon(inputVector);
      console.log('입력 텍스트 임베딩:', inputVector);
      cachedEmbeddings[inputText] = { embedding: inputVector, latitude: inputLatLon.latitude, longitude: inputLatLon.longitude };
    }

    let mostSimilarArticle: string | null = null;
    let highestSimilarity = -1;

    const articleVectors = await Promise.all(articles.map(async (article) => {
      if (cachedEmbeddings[article]) {
        return cachedEmbeddings[article];
      } else {
        try {
          const embedding = await generateTextEmbedding(model, article);
          const latLon = convertEmbeddingToLatLon(embedding);
          console.log(`문서: "${article.substring(0, 30)}...", 위도: ${latLon.latitude}, 경도: ${latLon.longitude}`);
          cachedEmbeddings[article] = { embedding, latitude: latLon.latitude, longitude: latLon.longitude };
          return cachedEmbeddings[article];
        } catch (error) {
          console.error(`문서 임베딩 생성 중 오류 발생 (문서: "${article.substring(0, 30)}...")`, error);
          return null;
        }
      }
    }));

    for (let i = 0; i < articles.length; i++) {
      const articleData = articleVectors[i];
      if (articleData) {
        const similarity = calculateCosineSimilarity(inputVector, articleData.embedding);
        console.log(`Article: "${articles[i].substring(0, 30)}...", Similarity: ${similarity}`);

        if (similarity > highestSimilarity) {
          highestSimilarity = similarity;
          mostSimilarArticle = articles[i];
        }
      }
    }

    logMemoryUsage();
    logCpuUsage();

    return mostSimilarArticle;
  } catch (error) {
    console.error('입력 텍스트 임베딩 생성 중 오류 발생:', error);
    return null;
  }
}

// 실행 함수
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

  console.log('주제와 가장 근접한 글:', relatedArticle);
}

run();