import { Request } from 'express';

export default interface AuthenticatedRequest extends Request {
    user?: {
        _id: string;
        email: string;
    };
}