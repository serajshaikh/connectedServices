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
exports.SqsConnection = void 0;
const client_sqs_1 = require("@aws-sdk/client-sqs");
class SqsConnection {
    constructor() {
        this.sqsClient = new client_sqs_1.SQSClient({ region: "us-east-1" });
    }
    sendMsg(props) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const params = {
                    DelaySeconds: 10,
                    MessageAttributes: {
                        Title: {
                            DataType: "String",
                            StringValue: "SNS Email",
                        }
                    },
                    MessageBody: props.email,
                    QueueUrl: props.queueUrl
                };
                const data = yield this.sqsClient.send(new client_sqs_1.SendMessageCommand(params));
                console.log("--> Message added into SQS queue successfully --> httpStatusCode is: ", data.$metadata.httpStatusCode);
                // publish(props);
                return data.$metadata.httpStatusCode;
            }
            catch (err) {
                console.log("Error", err);
            }
        });
    }
    ;
    receiveMsg(props) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const params = {
                    AttributeNames: ["SentTimestamp"],
                    MaxNumberOfMessages: 10,
                    MessageAttributeNames: ["All"],
                    QueueUrl: props.queueUrl,
                    VisibilityTimeout: 10,
                    WaitTimeSeconds: 0,
                };
                const data = yield this.sqsClient.send(new client_sqs_1.ReceiveMessageCommand(params));
                if (data.Messages) {
                    console.log("--> Received Message from SQS queue is :", data.Messages[0].Body);
                    const email = data.Messages[0].Body;
                    var deleteParams = {
                        QueueUrl: props.queueUrl,
                        ReceiptHandle: data.Messages[0].ReceiptHandle,
                    };
                    try {
                        const data = yield this.sqsClient.send(new client_sqs_1.DeleteMessageCommand(deleteParams));
                        // publish(props);
                        console.log("--> Message deleted from SQS queue and --> httpStatusCode is :", data.$metadata.httpStatusCode);
                    }
                    catch (err) {
                        console.log("Error", err);
                    }
                    return data.Messages[0].Body;
                }
                else {
                    console.log("No messages to delete");
                }
                return data.$metadata.httpStatusCode;
            }
            catch (err) {
                console.log("Receive Error", err);
            }
        });
    }
    ;
}
exports.SqsConnection = SqsConnection;
//# sourceMappingURL=sqs-connection.js.map