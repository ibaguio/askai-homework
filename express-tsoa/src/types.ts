export interface NotFoundResource {
    message: string;
    params: {
        [key: string]: unknown;
    };
}

export interface ValidateErrorJSON {
    message: 'Validation failed';
    details: { [name: string]: unknown };
}

export const ENV_DEV = 'dev';
export const ENV_PROD = 'prod';

export class ApiError extends Error {
    public readonly statusCode: number;
    public readonly name: string;
    constructor(name: string, message: string, statusCode: number) {
        super(message);
        this.name = name;
        this.statusCode = statusCode;
    }
}

