export interface SignUpModel {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    userRole?: string;
}

export interface CurrentUserModel {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    role?: string;
    token?: any;
    activate?: number;
    _id?: any;
}


export interface ApiResponse<T> {
    error?: boolean;
    status?: boolean;
    message?: string;
    result?: T;
}
