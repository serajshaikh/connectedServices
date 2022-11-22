const { GetItemCommand, PutItemCommand, DeleteItemCommand, ScanCommand, UpdateItemCommand, DynamoDBClient, DescribeImportCommand } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");

export class DynamodbConnection {
    db = new DynamoDBClient({ region: "us-east-1" });

    // getting the item from table
    async getItems(ID: string, TableName: any) {
        try {
            const params = {
                TableName: TableName,
                Key: marshall({ ID: ID }),
            };
            const { Item } = await this.db.send(new GetItemCommand(params));
            console.log("--> Successfully fetched information from DynamoDb")
            return unmarshall(Item);
        } catch (e) {
            console.error(e);
            return `There was an error fetching the data`;
        }

    }

    // connecting s3 bucket to dynamodb by passing s3bucketName and bucketKey
    async connectS3ToDynamodb(ID: string, tableName: string, bucketName: string, key: string) {
        try {
            const params = {
                TableName: tableName,
                Item: {
                    ID: { S: ID },
                    S3BucketName: { S: bucketName },
                    BucketKey: { S: key },
                },
            };
            const data = await this.db.send(new PutItemCommand(params));
            console.log("--> Successfully added s3 bucket reference into DynamoDB");
            return data.$metadata.httpStatusCode;
        } catch (e) {
            console.error(e);
            return `Error Putting data into table${e}`
        }
    }

    /*
        async putItems(data: any{ }, TableName: any) {
            try {
                const params = {
                    TableName: TableName,
                    Item: marshall(data),
                };
                await this.db.send(new PutItemCommand(params));
                return data;
            } catch (e) {
                console.error(e);
                return `Error Putting data into table id is ${data.ID} from ${TableName} error is ${e}`
            }
    
        }
         
            async deleteItems(ID:string, TableName:any) {
                try {
                    const params = {
                        TableName: TableName,
                        Key: marshall({ ID: ID }),
                    };
                    const deletedItem = await this.db.send(new DeleteItemCommand(params));
                    return deletedItem;
                } catch (e) {
                    console.error(e);
                    return `Error Putting data into table id is ${ID} from ${TableName} error is ${e}`
                }
        
            }
        
            async updateItems(ID:string, TableName:any, body:Object, objKeys:any[]) {
        
                try {
                    console.log("Body Element is ", body);
                    console.log("objectKeys are:", objKeys);
                    const params = {
                        TableName: TableName,
                        Key: marshall({ ID: ID }),
                        UpdateExpression: `SET ${objKeys.map((_, index) => `#key${index} = :value${index}`).join(", ")}`,
                        ExpressionAttributeNames: objKeys.reduce((acc, key, index) => ({
                            ...acc,
                            [`#key${index}`]: key,
                        }), {}),
                        ExpressionAttributeValues: marshall(objKeys.reduce((acc, key, index) => ({
                            ...acc,
                            [`:value${index}`]: body[key],
                        }), {})),
                    };
                    const updatedItem = await this.db.send(new UpdateItemCommand(params));
                    return updatedItem;
                } catch (e) {
                    console.error(e);
                    return `Error Putting data into table id is ${ID} from ${TableName} error is ${e}`
                }
        
            }
            async listAItems(ID:string, TableName:any) {
                try {
                    const params = {
                        TableName: TableName
                    };
                    const allListedItem = await this.db.send(new ScanCommand(params));
                    return allListedItem.Items.map((item) => unmarshall(item));
                } catch (e) {
                    console.error(e);
                    return `Error Putting data into table id is ${ID} from ${TableName} error is ${e}`
                }
        
            } */
}
