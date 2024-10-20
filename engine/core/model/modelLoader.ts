import * as use from '@tensorflow-models/universal-sentence-encoder';
import { emit } from '../../event/handler';

let cachedModel: use.UniversalSentenceEncoder | null = null;

export async function loadModel(): Promise<use.UniversalSentenceEncoder> {
    if (!cachedModel) {
        emit('modelLoading');
        cachedModel = await use.load();
        emit('modelLoaded', cachedModel);
    }
    return cachedModel;
}

export function getCachedModel(): use.UniversalSentenceEncoder | null {
    return cachedModel;
}
