"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var tf = require("@tensorflow/tfjs-node");
var use = require("@tensorflow-models/universal-sentence-encoder");
tf.setBackend('tensorflow');
var cachedModel = null;
var cachedEmbeddings = {};
function initializeBackend() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, tf.ready()];
                case 1:
                    _a.sent();
                    console.log('TensorFlow.js 백엔드가 준비되었습니다.');
                    return [2 /*return*/];
            }
        });
    });
}
function loadModel() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!!cachedModel) return [3 /*break*/, 2];
                    return [4 /*yield*/, use.load()];
                case 1:
                    cachedModel = _a.sent();
                    console.log('Universal Sentence Encoder 모델이 로드되었습니다.');
                    _a.label = 2;
                case 2: return [2 /*return*/, cachedModel];
            }
        });
    });
}
function calculateCosineSimilarity(vectorA, vectorB) {
    var dotProduct = vectorA.reduce(function (sum, value, index) { return sum + value * vectorB[index]; }, 0);
    var magnitudeA = Math.sqrt(vectorA.reduce(function (sum, value) { return sum + value * value; }, 0));
    var magnitudeB = Math.sqrt(vectorB.reduce(function (sum, value) { return sum + value * value; }, 0));
    return dotProduct / (magnitudeA * magnitudeB);
}
function logMemoryUsage() {
    var memoryUsage = process.memoryUsage();
    console.log("Node.js Memory Usage:\n    RSS: ".concat((memoryUsage.rss / 1024 / 1024).toFixed(2), " MB\n    Heap Total: ").concat((memoryUsage.heapTotal / 1024 / 1024).toFixed(2), " MB\n    Heap Used: ").concat((memoryUsage.heapUsed / 1024 / 1024).toFixed(2), " MB\n    External: ").concat((memoryUsage.external / 1024 / 1024).toFixed(2), " MB\n  "));
}
function logCpuUsage() {
    var startUsage = process.cpuUsage();
    var LOG_DELAY_MS = 1000;
    setTimeout(function () {
        var endUsage = process.cpuUsage(startUsage);
        console.log("CPU Usage:\n      User: ".concat((endUsage.user / 1000000).toFixed(2), " seconds\n      System: ").concat((endUsage.system / 1000000).toFixed(2), " seconds\n    "));
    }, LOG_DELAY_MS);
}
function generateTextEmbedding(model, text) {
    return __awaiter(this, void 0, void 0, function () {
        var embeddingTensor, embeddingArray, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, model.embed(text)];
                case 1:
                    embeddingTensor = _a.sent();
                    return [4 /*yield*/, embeddingTensor.array()];
                case 2:
                    embeddingArray = (_a.sent())[0];
                    embeddingTensor.dispose();
                    return [2 /*return*/, embeddingArray];
                case 3:
                    error_1 = _a.sent();
                    console.error('임베딩 생성 중 오류 발생:', error_1);
                    throw new Error('임베딩 생성에 실패했습니다. 입력 텍스트를 확인하거나 다시 시도해주세요.');
                case 4: return [2 /*return*/];
            }
        });
    });
}
function convertEmbeddingToLatLon(embedding) {
    var latitude = embedding[0] % 90; // 90도 제한 적용
    var longitude = embedding[1] % 180; // 180도 제한 적용
    return { latitude: latitude, longitude: longitude };
}
function findMostSimilarArticle(inputText, articles) {
    return __awaiter(this, void 0, void 0, function () {
        var model, inputVector, inputLatLon, mostSimilarArticle, highestSimilarity, articleVectors, i, articleData, similarity, error_2;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, loadModel()];
                case 1:
                    model = _a.sent();
                    console.log('현재 자원 사용량:');
                    logMemoryUsage();
                    console.log('입력 텍스트:', inputText);
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 7, , 8]);
                    inputVector = void 0;
                    inputLatLon = void 0;
                    if (!cachedEmbeddings[inputText]) return [3 /*break*/, 3];
                    inputVector = cachedEmbeddings[inputText].embedding;
                    inputLatLon = { latitude: cachedEmbeddings[inputText].latitude, longitude: cachedEmbeddings[inputText].longitude };
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, generateTextEmbedding(model, inputText)];
                case 4:
                    inputVector = _a.sent();
                    inputLatLon = convertEmbeddingToLatLon(inputVector);
                    console.log('입력 텍스트 임베딩:', inputVector);
                    cachedEmbeddings[inputText] = { embedding: inputVector, latitude: inputLatLon.latitude, longitude: inputLatLon.longitude };
                    _a.label = 5;
                case 5:
                    mostSimilarArticle = null;
                    highestSimilarity = -1;
                    return [4 /*yield*/, Promise.all(articles.map(function (article) { return __awaiter(_this, void 0, void 0, function () {
                            var embedding, latLon, error_3;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!cachedEmbeddings[article]) return [3 /*break*/, 1];
                                        return [2 /*return*/, cachedEmbeddings[article]];
                                    case 1:
                                        _a.trys.push([1, 3, , 4]);
                                        return [4 /*yield*/, generateTextEmbedding(model, article)];
                                    case 2:
                                        embedding = _a.sent();
                                        latLon = convertEmbeddingToLatLon(embedding);
                                        console.log("\uBB38\uC11C: \"".concat(article.substring(0, 30), "...\", \uC784\uBCA0\uB529:"), embedding);
                                        console.log("\uBB38\uC11C: \"".concat(article.substring(0, 30), "...\", \uC704\uB3C4: ").concat(latLon.latitude, ", \uACBD\uB3C4: ").concat(latLon.longitude));
                                        cachedEmbeddings[article] = { embedding: embedding, latitude: latLon.latitude, longitude: latLon.longitude };
                                        return [2 /*return*/, cachedEmbeddings[article]];
                                    case 3:
                                        error_3 = _a.sent();
                                        console.error("\uBB38\uC11C \uC784\uBCA0\uB529 \uC0DD\uC131 \uC911 \uC624\uB958 \uBC1C\uC0DD (\uBB38\uC11C: \"".concat(article.substring(0, 30), "...\")"), error_3);
                                        return [2 /*return*/, null];
                                    case 4: return [2 /*return*/];
                                }
                            });
                        }); }))];
                case 6:
                    articleVectors = _a.sent();
                    for (i = 0; i < articles.length; i++) {
                        articleData = articleVectors[i];
                        if (articleData) {
                            similarity = calculateCosineSimilarity(inputVector, articleData.embedding);
                            console.log("Article: \"".concat(articles[i].substring(0, 30), "...\", Similarity: ").concat(similarity));
                            if (similarity > highestSimilarity) {
                                highestSimilarity = similarity;
                                mostSimilarArticle = articles[i];
                            }
                        }
                    }
                    logMemoryUsage();
                    logCpuUsage();
                    return [2 /*return*/, mostSimilarArticle];
                case 7:
                    error_2 = _a.sent();
                    console.error('입력 텍스트 임베딩 생성 중 오류 발생:', error_2);
                    return [2 /*return*/, null];
                case 8: return [2 /*return*/];
            }
        });
    });
}
// 실행 함수
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var articles, inputText, relatedArticle;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, initializeBackend()];
                case 1:
                    _a.sent();
                    articles = [
                        'The quick brown fox jumps over the lazy dog.',
                        'JavaScript is a versatile programming language.',
                        'TensorFlow.js helps to run machine learning models in the browser.',
                        'Artificial Intelligence and Machine Learning are transforming industries.',
                        'Python is a popular language for data science and machine learning.'
                    ];
                    inputText = 'javascript programming language';
                    return [4 /*yield*/, findMostSimilarArticle(inputText, articles)];
                case 2:
                    relatedArticle = _a.sent();
                    console.log('주제와 가장 근접한 글:', relatedArticle);
                    return [2 /*return*/];
            }
        });
    });
}
run();
