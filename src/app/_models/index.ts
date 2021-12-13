export interface SignUpModel {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    userRole?: string;
}


export interface ApiResponse<T> {
    status?: string;
    message?: string;
}
