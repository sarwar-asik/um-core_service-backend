### change global error for prisma >>>>>


###### validation Error 

**src>app>error>handleValidationError.ts>>>**


    import { Prisma } from '@prisma/client';
    import { IGenericErrorResponse } from '../interfaces/common';

    const handleValidationError = (
    error: Prisma.PrismaClientValidationError
    ): IGenericErrorResponse => {
    const errors = [
        {
        path: '',
        message: error.message,
        }
    ]
    const statusCode = 400;
    return {
        statusCode,
        message: 'Validation Error',
        errorMessages: errors,
    };
    };

    export default handleValidationError;



**src>app>middleware>globalErrorHandler.ts (for handleValidationError.ts)>>**


        if (error instanceof Prisma.PrismaClientValidationError) {
            const simplifiedError = handleValidationError(error);
            statusCode = simplifiedError.statusCode;
            message = simplifiedError.message;
            errorMessages = simplifiedError.errorMessages;
        } 



###### PrismaClientKnownError.ts :::::

**src>app>error>handleClientError.ts>>>(handleCastError[oldName])**



    import { Prisma } from '@prisma/client';
    import { IGenericErrorMessage } from '../interfaces/error';

    const handleClientError = (error:Prisma.PrismaClientKnownRequestError ) => {
    let errors: IGenericErrorMessage[] = [];

    let message =""
    const statusCode = 400;

    if(error.code === "P2025"){
        message =( error.meta?.cause as string) || "Record not Found (handleClientError.ts)"

        errors = [
        {
            path:"",
            message
        }
        ]
    }
    else if(error.code ==="P2003"){
        if(error?.message.includes('delete()` invocation:')){
        message = "Delete Failed (handleCLient.ts)";
        errors = [
            {
            path:"",
            message
            }
        ]
        }

    }

    return {
        statusCode,
        message,
        errorMessages: errors,
    };
    };

    export default handleClientError 



**src>app>middleware>globalErrorHandler.ts (for handleValidationError.ts)>>**

    // ! for prisma ////
    else if (error instanceof Prisma.PrismaClientKnownRequestError) {
        const simplifiedError = handleClientError(error);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorMessages = simplifiedError.errorMessages;
    } 