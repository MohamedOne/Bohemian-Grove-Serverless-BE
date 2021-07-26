import { APIGatewayProxyEvent } from "aws-lambda";
import { HTTPResponse } from "../Global/DTO";
import { ddbDocClient as dynamo} from "../Global/DynamoDB";
import { PutObjectCommand, PutObjectCommandInput, S3Client } from "@aws-sdk/client-s3";
import parser from "lambda-multipart-parser";

const s3 = new S3Client({region: "us-east-2"});

export const handler = async (event: APIGatewayProxyEvent): Promise<HTTPResponse> => {
    const formData = await parser.parse(event);

    const key = event.requestContext.authorizer?.claims.username;

    const params: PutObjectCommandInput = {
        Bucket: process.env.S3_USER_BUCKET,
        Key: key,
        Body: formData.files[0].content,
        ContentType: formData.files[0].contentType,
        ACL: "public-read"
    };

    try {
        const data = await s3.send(new PutObjectCommand(params));
        return new HTTPResponse(200, data, formData, event);
    } catch (err) {
        return new HTTPResponse(400, err, formData, event);
    }
}