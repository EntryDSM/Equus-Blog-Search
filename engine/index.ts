import { initializeBackend, startLoggingResources } from './backend';
import { loadModel, processEmbeddings, findMostSimilarArticle } from './embedding';

async function main() {
    try {
        await initializeBackend();

        startLoggingResources();

        const model = await loadModel();

        const inputText = "Machine learning is a subset of artificial intelligence focused on building systems that learn from data.";
        const articles = [
            "Article 1: The football team secured a victory with a stunning goal in the final minute of the match.",
            "Article 2: Basketball players need to maintain a high level of physical fitness and agility to succeed on the court.",
            "Article 3: Tennis requires not only physical strength but also strategic thinking to outmaneuver the opponent.",
            "Article 4: The marathon runner broke the world record by finishing the race in under two hours.",
            "Article 5: Baseball is a sport that demands quick reflexes and precise hand-eye coordination.",
            "Article 6: Swimming is an excellent full-body workout that improves endurance and strength.",
            "Article 7: Ice hockey players wear protective gear to stay safe during fast-paced, physical games.",
            "Article 8: Golf is a sport that combines skill, precision, and patience to achieve success on the green.",
            "Article 9: Cycling is a popular activity that promotes cardiovascular health and environmental sustainability.",
            "Article 10: Volleyball requires teamwork and quick reflexes, as players must react rapidly to the ball.",
            "Article 11: Machine learning is best!",
        ];


        const { inputEmbedding, articlesData } = await processEmbeddings(inputText, articles, model);

        const mostSimilar = await findMostSimilarArticle(inputEmbedding, articlesData);

        console.log(`\nMost Similar Article: ${mostSimilar}`);
    } catch (error) {
        console.error('An error occurred while running the application:', error);
    }
}

main();
