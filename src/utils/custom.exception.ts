import { HttpException, HttpStatus } from "@nestjs/common";

export class CustomHttpException extends HttpException {

constructor(response:string, status: HttpStatus, private errorCode:string){
    super(response, status)
}
    getErrorCode():string{
       return this.errorCode
    }

}