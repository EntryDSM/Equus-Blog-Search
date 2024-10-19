export type LatLon = { latitude: number; longitude: number };
export type EmbeddingData = { embedding: number[]; latitude: number; longitude: number };
export type ContentData = { text: string; embeddingData: EmbeddingData };
