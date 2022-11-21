import { SQSClient, ReceiveMessageCommand, DeleteMessageCommand, SendMessageCommand } from "@aws-sdk/client-sqs";


export class SqsConnection {
    sqsClient = new SQSClient({ region: "us-east-1" });


    async sendMsg(props: { email: string, queueUrl: string }) {
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
            const data = await this.sqsClient.send(new SendMessageCommand(params));
            console.log("--> Message added into SQS queue successfully --> httpStatusCode is: ", data.$metadata.httpStatusCode);
            // publish(props);
            return data.$metadata.httpStatusCode;
        } catch (err) {
            console.log("Error", err);
        }
    };


    async receiveMsg(props: { queueUrl: string }) {

        try {
            const params = {
                AttributeNames: ["SentTimestamp"],
                MaxNumberOfMessages: 10,
                MessageAttributeNames: ["All"],
                QueueUrl: props.queueUrl,
                VisibilityTimeout: 10,
                WaitTimeSeconds: 0,
            };

            const data = await this.sqsClient.send(new ReceiveMessageCommand(params));
            if (data.Messages) {
                console.log("--> Received Message from SQS queue is :", data.Messages[0].Body);
                const email=data.Messages[0].Body;
                var deleteParams = {
                    QueueUrl: props.queueUrl,
                    ReceiptHandle: data.Messages[0].ReceiptHandle,
                };

                try {
                    const data = await this.sqsClient.send(new DeleteMessageCommand(deleteParams));
                    // publish(props);
                    console.log("--> Message deleted from SQS queue and --> httpStatusCode is :", data.$metadata.httpStatusCode);
                } catch (err) {
                    console.log("Error", err);
                }
                return data.Messages[0].Body;
            } else {
                console.log("No messages to delete");
            }
            return data.$metadata.httpStatusCode;
        } catch (err) {
            console.log("Receive Error", err);
        }
    };

}   