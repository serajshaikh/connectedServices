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
        console.log("➡️ File uploading into S3Bucket....")
        const httpStatusCode = await s3Obj.uploadObjectBucket(bucketName, fileName, body)
        if (httpStatusCode) {
            const sqsObj = new SqsConnection();
            const snsObj = new SnsConnection();
            const dynamodbObj = new DynamodbConnection();
            console.log("➡️ Message adding into sqs queue...")
            const sqsRes = await sqsObj.sendMsg({ email, queueUrl });
            if (sqsRes) {
                console.log("➡️ Message receiving from sqs queue... ")
                const sqsRecRes = await sqsObj.receiveMsg({ queueUrl });
                if (typeof sqsRecRes === 'string' && EmailValidator.validate(sqsRecRes)) {
                    console.log("➡️ Getting Email from sqs queue and SNS email being send....")
                    await snsObj.publish({ state: 1, subject, email, name, topicArn });
                }
            }
            console.log("➡️ Adding S3 Object reference to dynamodb table... ")
            // const tableID= Math.floor(Math.random()*1000).toString();
            const dynamodbRes = await dynamodbObj.connectS3ToDynamodb('1010', tableName, bucketName, fileName);
            if (dynamodbRes) {
                console.log("➡️ Message being added into sqs queue...")
                const sqsDynamoRes = await sqsObj.sendMsg({ email, queueUrl });
                if (sqsDynamoRes) {
                    console.log("➡️ SNS Email sending to subscriber...");
                    await snsObj.publish({ state: 3, subject, email, name, topicArn });
                    console.log("➡️ Data being extracting from s3 bucket using dynamodb table...");
                    const getData = await dynamodbObj.getItems("1010", tableName);
                    const s3Res = await s3Obj.getObjectsFromS3(getData.S3BucketName, getData.BucketKey);//buckerKey is the name of the object in s3 bucket
                    console.log(`--> S3 ${fileName} file data are...`);
                    console.log(s3Res);
                    console.log("➡️ Message Being received from sqs queue... ")
                    const sqsDynamoRecRes = await sqsObj.receiveMsg({ queueUrl });
                    if (typeof sqsDynamoRecRes === 'string' && EmailValidator.validate(sqsDynamoRecRes)) {
                        console.log("➡️ Getting Email from sqs queue and SNS email being send....")
                        await snsObj.publish({ state: 4, subject, email, name, topicArn });
                    }

                    console.log("🔥⚡Task Completed Successfully⚡🔥");
                }
            }


        }
    }
}

export { userController };