interface IComment {
    displayName: string,
    displayImg: string,
    comment: string
}

export class Comment implements IComment {

    public displayImg: string;
    public displayName: string;
    public comment: string;



    constructor(comment: any) {
        this.displayImg = comment.displayImg;
        this.comment = comment.comment;
        this.displayName = comment.displayName;
    }
}

export default Comment;