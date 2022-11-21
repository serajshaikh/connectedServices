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
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3Bucket = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
class S3Bucket {
    constructor() {
        this.s3Client = new client_s3_1.S3Client({ region: "us-east-1" });
    }
    // uploading object into s3 bucket
    uploadObjectBucket(bucketName, key, BODY) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const results = yield this.s3Client.send(new client_s3_1.PutObjectCommand({ Bucket: bucketName, Key: key, Body: BODY }));
                console.log("--> Successfully Uploaded data in S3 --> httpStatusCode is: ", results.$metadata.httpStatusCode);
                // console.log("Results is", results);
                return results.$metadata.httpStatusCode;
            }
            catch (err) {
                console.log("Error", err);
            }
        });
    }
    ;
    // get all content from an object from s3 bucket
    getObjectsFromS3(bucketName, key) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const streamToString = (stream) => new Promise((resolve, reject) => {
                    const chunks = [];
                    stream.on("data", (chunk) => chunks.push(chunk));
                    stream.on("error", reject);
                    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
                });
                const { Body } = yield this.s3Client.send(new client_s3_1.GetObjectCommand({ Bucket: bucketName, Key: key, }));
                console.log("--> Successfully linked S3 to dynamoDb");
                const bodyContents = yield streamToString(Body);
                return bodyContents;
            }
            catch (err) {
                return err;
            }
        });
    }
}
exports.S3Bucket = S3Bucket;
//# sourceMappingURL=s3-bucket.js.map