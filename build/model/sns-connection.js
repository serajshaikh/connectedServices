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
exports.SnsConnection = void 0;
const client_sns_1 = require("@aws-sdk/client-sns");
class SnsConnection {
    constructor() {
        this.snsClient = new client_sns_1.SNSClient({ region: "us-east-1" });
    }
    publish(props) {
        return __awaiter(this, void 0, void 0, function* () {
            var allSNSemail = {
                msg1: `Hi ${props.name} \n Message has been removed from  SQS queue \n Your email address is ${props.email}`,
                msg2: `Hi ${props.name} \n you have uploaded an object into S3 bucket \n Your email address is ${props.email}`,
                msg3: `Hi ${props.name} \n You DynamoDb table added the reference to s3 object bucket  \n Your email address is ${props.email}`,
                msg4: `Hi ${props.name} \n By fetching info of s3 bucket object from Dynamodb table and using this information you fetched all the content of that object from s3 bucket  \n Your email address is ${props.email}`,
            };
            var message;
            if (props.state === 1) {
                message = allSNSemail.msg1;
            }
            else if (props.state === 2) {
                message = allSNSemail.msg2;
            }
            else if (props.state === 3) {
                message = allSNSemail.msg3;
            }
            else {
                message = allSNSemail.msg4;
            }
            var params = {
                Subject: props.subject,
                Message: message,
                TopicArn: props.topicArn,
            };
            try {
                const data = yield this.snsClient.send(new client_sns_1.PublishCommand(params));
                console.log("--> SNS Email Send successfully --> httpStatusCode is: ", data.$metadata.httpStatusCode);
                return data.$metadata.httpStatusCode;
            }
            catch (err) {
                console.log("Error", err);
            }
        });
    }
    ;
}
exports.SnsConnection = SnsConnection;
//# sourceMappingURL=sns-connection.js.map