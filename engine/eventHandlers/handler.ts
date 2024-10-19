import { loadModel, generateTextEmbedding } from '../embedding';

export async function handleArticleAddedEvent(article: { id: string; text: string }) {
    try {
        await loadModel(); 
        const embedding = await generateTextEmbedding(article.text);
        
        console.log(`기사 ID: ${article.id}의 임베딩:`, embedding);

    } catch (error) {
        console.error('임베딩 생성 중 오류가 발생했습니다:', error);
    }
}
