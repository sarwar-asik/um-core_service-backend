### change global error for prisma >>>>>



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