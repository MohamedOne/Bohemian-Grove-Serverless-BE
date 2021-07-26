interface IComment {
    body: string,
    timeStamp: string,
    userName: string
}

export class Comment implements IComment {

    public userName: string;
    public body: string;
    public timeStamp: number;



    constructor(post: any,) {
        this.userName = post.userName;
        this.timeStamp = post.postTime;
        this.body = post.postBody;
    }
}

export default Comment;