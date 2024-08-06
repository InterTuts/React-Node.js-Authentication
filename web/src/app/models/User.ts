export interface UserEmail {
    email: string;
}

export interface UserBasic {
    email: string;
    password: string;
}

export interface UserToken {
    token: string;
}

export interface UserNewPassword {
    code?: string;
    password: string;
    repeatPassword: string;
}

export interface UserSocial {
    email: string;
    social_id: string;
}

export interface User {
    id: string;
    email: string;
}