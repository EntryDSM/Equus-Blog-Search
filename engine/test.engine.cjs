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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var tf = require("@tensorflow/tfjs-node");
var use = require("@tensorflow-models/universal-sentence-encoder");
// 명시적으로 TensorFlow.js 백엔드를 초기화
tf.setBackend('tensorflow');
tf.ready().then(function () {
    console.log('TensorFlow.js 백엔드가 준비되었습니다.');
});
// 코사인 유사도 계산 함수
function cosineSimilarity(vecA, vecB) {
    var dotProduct = tf.sum(tf.mul(vecA, vecB));
    var magnitudeA = tf.sqrt(tf.sum(tf.square(vecA)));
    var magnitudeB = tf.sqrt(tf.sum(tf.square(vecB)));
    return dotProduct.div(magnitudeA.mul(magnitudeB)).dataSync()[0];
}
// 메모리 사용량 로깅 함수
function logMemoryUsage() {
    var memoryUsage = process.memoryUsage();
    console.log("Node.js Memory Usage:\n    RSS: ".concat((memoryUsage.rss / 1024 / 1024).toFixed(2), " MB\n    Heap Total: ").concat((memoryUsage.heapTotal / 1024 / 1024).toFixed(2), " MB\n    Heap Used: ").concat((memoryUsage.heapUsed / 1024 / 1024).toFixed(2), " MB\n    External: ").concat((memoryUsage.external / 1024 / 1024).toFixed(2), " MB\n  "));
}
// CPU 사용량 로깅 함수
function logCpuUsage() {
    var startUsage = process.cpuUsage();
    setTimeout(function () {
        var endUsage = process.cpuUsage(startUsage);
        console.log("CPU Usage:\n      User: ".concat(endUsage.user / 1000000, " seconds\n      System: ").concat(endUsage.system / 1000000, " seconds\n    "));
    }, 1000);
}
// 문장 임베딩을 통해 벡터화하고 유사도 비교
function getClosestArticles(inputText, articles) {
    return __awaiter(this, void 0, void 0, function () {
        var model, sentences, embeddings, inputEmbedding, bestArticle, bestSimilarity, i, articleEmbedding, similarity, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, use.load()];
                case 1:
                    model = _a.sent();
                    console.log("Universal Sentence Encoder 모델이 로드되었습니다. 현재 자원 사용량:");
                    logMemoryUsage();
                    console.log("입력 텍스트:", inputText);
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    sentences = __spreadArray([inputText], articles, true);
                    return [4 /*yield*/, model.embed(sentences)];
                case 3:
                    embeddings = _a.sent();
                    console.log("임베딩 생성 완료");
                    inputEmbedding = embeddings.slice([0, 0], [1, -1]);
                    bestArticle = null;
                    bestSimilarity = -1;
                    for (i = 0; i < articles.length; i++) {
                        articleEmbedding = embeddings.slice([i + 1, 0], [1, -1]);
                        similarity = cosineSimilarity(inputEmbedding, articleEmbedding);
                        console.log("Article: \"".concat(articles[i].substring(0, 30), "...\", Similarity: ").concat(similarity));
                        if (similarity > bestSimilarity) {
                            bestSimilarity = similarity;
                            bestArticle = articles[i];
                        }
                    }
                    logMemoryUsage();
                    logCpuUsage();
                    return [2 /*return*/, bestArticle];
                case 4:
                    error_1 = _a.sent();
                    console.error("Error during processing:", error_1);
                    return [2 /*return*/, null];
                case 5: return [2 /*return*/];
            }
        });
    });
}
// 예제 글 목록
var articles = [
    "The quick brown fox jumps over the lazy dog.",
    "JavaScript is a versatile programming language.",
    "TensorFlow.js helps to run machine learning models in the browser.",
    "Artificial Intelligence and Machine Learning are transforming industries.",
    "Python is a popular language for data science and machine learning."
];
// 입력 텍스트를 변수로 정의
var text = "I want to learn about machine learning and AI.";
// 실행
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var relatedArticle;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getClosestArticles(text, articles)];
            case 1:
                relatedArticle = _a.sent();
                console.log("주제와 가장 근접한 글:", relatedArticle);
                return [2 /*return*/];
        }
    });
}); })();
