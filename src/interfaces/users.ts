export interface User {
    name: string;
    mail: string;
    password: string;
    confirmPassword: string;
    
}

export interface Login {
    access_token:string;
    user: User;
    expires_in: number;
    message: string;
}