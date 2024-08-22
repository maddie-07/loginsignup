type registerErrorType = {
    wardNumber?:number;
    email?:string;
    password?:string;
    password_confirmation?: string;
};

type loginErrorType = {
    email?:string;
    password?:string;
};