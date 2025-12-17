import { UserRole, UserStatus, Visible } from "@prisma/client";

export interface ResponseInterface {
  message?: string;
}

export interface ResponseInterfaceWithData<T extends Record<string, any>> extends ResponseInterface {
  data: T;
}

export interface IUserWithoutPassword {
    username: string;
    email: string;
    firstname: string;
    lastname: string;
    address:string
    zipCode?:number
    city:string
    phone: string;
    cv: string;
    visibility: Visible;
    role : UserRole
    photo?:string
    schoolId:string
    available?:string
    content?:string
    status: UserStatus
}
