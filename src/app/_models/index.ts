export interface SignUpModel {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    userRole?: string;
}


export interface ApiResponse<T> {
    error?: boolean;
    status?: boolean;
    message?: string;
    result?: T;
}
