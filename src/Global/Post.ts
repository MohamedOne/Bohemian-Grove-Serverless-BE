interface IPost {
    displayImg: string,
    displayName: string,
    userName: string,
    postBody: string,
    likes: string[],
    dataKey: string,
    comments: string[]
}

export class Post implements IPost {

    public displayImg: string;
    public displayName: string;
    public userName: string;
    public postBody: string;
    public likes: string[];
    public dataKey: string;
    public comments: string[];
    public postImg: string;


    constructor(post: any) {
        this.userName = post.userName;
        this.dataKey = post.dataKey;
        this.displayName = post.displayName;
        this.displayImg = post.displayImg;
        this.postBody = post.postBody;
        this.postImg = post.postImg;
        this.comments = post.comments;
        this.likes = post.likes;
    }
}

export default Post;