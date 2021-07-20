export class HTTPResponse {
    public statusCode: number;
    public body: string;
    public headers: any;
    
    constructor(statusCode: number, ...body: any) {
        this.statusCode = statusCode;
        this.body = JSON.stringify(body);
        this.headers = { "Content-Type": "application/json" }
    }
}