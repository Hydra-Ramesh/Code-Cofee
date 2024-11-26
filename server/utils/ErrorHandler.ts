class ErrorHandler extends Error{
    statuscode: Number;
    constructor(message:any, statusCode:Number){
        super(message);
        this.statuscode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

export default ErrorHandler;