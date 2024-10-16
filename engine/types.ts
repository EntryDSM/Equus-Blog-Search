export type LatLon = { latitude: number; longitude: number };
export type EmbeddingData = { embedding: number[]; latitude: number; longitude: number };
export type ArticleData = { text: string; embeddingData: EmbeddingData };