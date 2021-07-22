export interface IUser {
    userName: string;
    displayName: string;
    email?: string;
    password?: string;
    profileImg: string;
}

export class User implements IUser {

    public userName: string;
    public displayName: string;
    public email?: string;
    public password?: string;
    public profileImg: string;

    // eslint-disable-next-line max-len
    constructor(userNameOrObject: string | any, displayName?: string, profileImg?: string, email?: string) {
        if (typeof userNameOrObject == 'string') {
            this.userName = userNameOrObject;
            this.displayName = displayName || '';
            this.profileImg = profileImg || '';
            if (email) this.email = email;

        } else {
            this.userName = userNameOrObject.userName;
            this.displayName = userNameOrObject.displayName;
            this.profileImg = userNameOrObject.profileImg;
            if (userNameOrObject.email) this.email = userNameOrObject.email;
        }
    }
}
export default User;