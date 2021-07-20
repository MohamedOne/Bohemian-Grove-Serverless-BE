import { HTTPResponse } from "../Global/DTO";

export const handler = async (event: any = {}): Promise<any> => {
    // Your code here

    const response = new HTTPResponse(200, "Hey look! A response!", event);

    return response;
}