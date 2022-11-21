"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const s3_bucket_1 = require("../model/s3-bucket");
const sqs_connection_1 = require("../model/sqs-connection");
const sns_connection_1 = require("../model/sns-connection");
const dynamodb_connection_1 = require("../model/dynamodb-connection");
const EmailValidator = __importStar(require("email-validator"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// for extracting INFO from .env file
const bucketName = process.env.BUCKET_NAME;
const queueUrl = process.env.QUEUE_URL;
const topicArn = process.env.TOPIC_ARN;
const tableName = process.env.TABLE_NAME;
const resourceArn = process.env.S3_RESOURCE_ARN;
const userController = {
    apiCall: (body) => __awaiter(void 0, void 0, void 0, function* () {
        const JsonContents = JSON.parse(body);
        const email = JsonContents.email;
        const subject = JsonContents.subject;
        const status = JsonContents.status;
        const name = JsonContents.name;
        const fileName = "userData.json";
        const s3Obj = new s3_bucket_1.S3Bucket();
        console.log("--> File being Uploaded into S3Bucket....");
        const httpStatusCode = yield s3Obj.uploadObjectBucket(bucketName, fileName, body);
        if (httpStatusCode) {
            const sqsObj = new sqs_connection_1.SqsConnection();
            const snsObj = new sns_connection_1.SnsConnection();
            const dynamodbObj = new dynamodb_connection_1.DynamodbConnection();
            console.log("--> Message being added into sqs queue...");
            const sqsRes = yield sqsObj.sendMsg({ email, queueUrl });
            if (sqsRes) {
                console.log("--> Message Being received from sqs queue... ");
                const sqsRecRes = yield sqsObj.receiveMsg({ queueUrl });
                if (typeof sqsRecRes === 'string' && EmailValidator.validate(sqsRecRes)) {
                    console.log("--> Getting Email from sqs queue and SNS email being send....");
                    yield snsObj.publish({ state: 1, subject, email, name, topicArn });
                }
            }
        }
    })
};
exports.userController = userController;
//# sourceMappingURL=userController.js.map