interface IComment {
    author: string,
    displayImg: string,
    comment: string
}

export class Comment implements IComment {

    public displayImg: string;
    public author: string;
    public comment: string;



    constructor(comment: any,) {
        this.displayImg = comment.userName;
        this.comment = comment.comment;
        this.author = comment.author;
    }
}

export default Comment;