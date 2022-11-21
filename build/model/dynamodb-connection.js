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
exports.DynamodbConnection = void 0;
const { GetItemCommand, PutItemCommand, DeleteItemCommand, ScanCommand, UpdateItemCommand, DynamoDBClient, DescribeImportCommand } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");
class DynamodbConnection {
    constructor() {
        this.db = new DynamoDBClient({ region: "us-east-1" });
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
    // getting the item from table
    getItems(ID, TableName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const params = {
                    TableName: TableName,
                    Key: marshall({ ID: ID }),
                };
                const { Item } = yield this.db.send(new GetItemCommand(params));
                console.log("Successfully fetched information from DynamoDb");
                return unmarshall(Item);
            }
            catch (e) {
                console.error(e);
                return `There was an error fetching the data`;
            }
        });
    }
    // connecting s3 bucket to dynamodb by passing s3bucketName and bucketKey
    connectS3ToDynamodb(ID, tableName, bucketName, key) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const params = {
                    TableName: tableName,
                    Item: {
                        ID: { S: ID },
                        S3BucketName: { S: bucketName },
                        BucketKey: { S: key },
                    },
                };
                const data = yield this.db.send(new PutItemCommand(params));
                console.log("Successfully added s3 bucket reference into DynamoDB");
                return data.$metadata.httpStatusCode;
            }
            catch (e) {
                console.error(e);
                return `Error Putting data into table${e}`;
            }
        });
    }
}
exports.DynamodbConnection = DynamodbConnection;
//# sourceMappingURL=dynamodb-connection.js.map