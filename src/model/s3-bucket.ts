import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";

export class S3Bucket {
    private s3Client: S3Client = new S3Client({ region: "us-east-1" });

    // uploading object into s3 bucket
    async uploadObjectBucket(bucketName: string, key: string, BODY: string) {
        try {
            const results = await this.s3Client.send(new PutObjectCommand({ Bucket: bucketName, Key: key, Body: BODY }));
            console.log("--> Successfully Uploaded data in S3 --> httpStatusCode is: ", results.$metadata.httpStatusCode);
            // console.log("Results is", results);
            return results.$metadata.httpStatusCode;
        } catch (err) {
            console.log("Error", err);
        }
    };

    // get all content from an object from s3 bucket
    async getObjectsFromS3(bucketName: string, key: string) {
        try {
            const streamToString = (stream: any) =>
                new Promise((resolve, reject) => {
                    const chunks: any[] = [];
                    stream.on("data", (chunk: any) => chunks.push(chunk));
                    stream.on("error", reject);
                    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
                });
            const { Body } = await this.s3Client.send(new GetObjectCommand({ Bucket: bucketName, Key: key, }));
            console.log("--> Successfully linked S3 to dynamoDb");
            const bodyContents = await streamToString(Body);
            return bodyContents;

        } catch (err) {
            return err;
        }
    }
}