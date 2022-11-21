import { PublishCommand, SNSClient } from "@aws-sdk/client-sns";

export class SnsConnection {
    snsClient = new SNSClient({ region: "us-east-1" });
    async publish(props: { state: number, subject: string, email: string, name: any, topicArn: string }) {

        var allSNSemail = {
            msg1: `Hi ${props.name} \n Message has been removed from  SQS queue \n Your email address is ${props.email}`,
            msg2: `Hi ${props.name} \n you have uploaded an object into S3 bucket \n Your email address is ${props.email}`,
            msg3: `Hi ${props.name} \n You DynamoDb table added the reference to s3 object bucket  \n Your email address is ${props.email}`,
            msg4:`Hi ${props.name} \n By fetching info of s3 bucket object from Dynamodb table and using this information you fetched all the content of that object from s3 bucket  \n Your email address is ${props.email}`,

        }
        var message:string;
        if(props.state===1){
            message=allSNSemail.msg1;
        }else if(props.state===2){
            message=allSNSemail.msg2;
        }else if(props.state===3){
            message=allSNSemail.msg3;
        }else{
            message=allSNSemail.msg4;
        }

        var params = {
            Subject: props.subject,
            Message: message,
            TopicArn: props.topicArn,
        };

        try {
            const data = await this.snsClient.send(new PublishCommand(params));
            console.log("--> SNS Email Send successfully --> httpStatusCode is: ", data.$metadata.httpStatusCode);
            return data.$metadata.httpStatusCode;
        } catch (err) {
            console.log("Error", err);
        }
    };
}
