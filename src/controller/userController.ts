import { S3Bucket } from "../model/s3-bucket";
import { SqsConnection } from "../model/sqs-connection";
import { SnsConnection } from "../model/sns-connection";
import { DynamodbConnection } from "../model/dynamodb-connection";
import * as EmailValidator from 'email-validator';
import dotenv from "dotenv";
dotenv.config();

// for extracting INFO from .env file
const bucketName: any = process.env.BUCKET_NAME;
const queueUrl: any = process.env.QUEUE_URL;
const topicArn: any = process.env.TOPIC_ARN;
const tableName: any = process.env.TABLE_NAME;
const resourceArn: any = process.env.S3_RESOURCE_ARN;

const userController = {
    apiCall: async (body: string) => {
        const JsonContents = JSON.parse(body);
        const email: string = JsonContents.email;
        const subject: string = JsonContents.subject;
        const status: number = JsonContents.status;
        const name = JsonContents.name;
        const fileName = "userData.json";

        const s3Obj = new S3Bucket();
        console.log("--> File being Uploaded into S3Bucket....")
        const httpStatusCode = await s3Obj.uploadObjectBucket(bucketName, fileName, body)
        if (httpStatusCode) {
            const sqsObj = new SqsConnection();
            const snsObj = new SnsConnection();
            const dynamodbObj = new DynamodbConnection();
            console.log("--> Message being added into sqs queue...")
            const sqsRes = await sqsObj.sendMsg({ email, queueUrl });
            if (sqsRes) {
                console.log("--> Message Being received from sqs queue... ")
                const sqsRecRes = await sqsObj.receiveMsg({ queueUrl });
                if (typeof sqsRecRes === 'string' && EmailValidator.validate(sqsRecRes)) {
                    console.log("--> Getting Email from sqs queue and SNS email being send....")
                    await snsObj.publish({ state: 1, subject, email, name, topicArn });
                }
            }

        }
    }
}

export { userController };