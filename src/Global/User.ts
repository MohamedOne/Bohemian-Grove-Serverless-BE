export interface IUser {
    dataKey: string;
    displayName: string;
    email: string;
    profileImg: string;
    dataType: string;
}

export class User implements IUser {

    public dataKey: string;
    public displayName: string;
    public email: string;
    public profileImg: string;
    public dataType: string;

    // eslint-disable-next-line max-len
    constructor(user: any) {
        this.dataKey = user.dataKey;
        this.displayName = user.displayName
        this.email = user.email;
        this.profileImg = user.profileImg;
        this.dataType = "user"
    }
}
export default User;