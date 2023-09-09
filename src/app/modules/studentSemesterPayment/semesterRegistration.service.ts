import { PrismaClient } from "@prisma/client";
import { DefaultArgs, PrismaClientOptions } from "@prisma/client/runtime/library";

const createSemesterPayment = async(
    //! Transaction prismaClient type declare !important
    
    prismaClient:Omit<PrismaClient<PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">,
    payload:{
    studentId:string,
    academicSemesterId :string,
    totalPaymentAmount:number
})=>{
    // console.log("Semester payment",data1,data2);
    console.log(prismaClient,payload);
}

export const StudentSemesterPaymentService = {createSemesterPayment}