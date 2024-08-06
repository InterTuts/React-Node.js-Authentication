// Installed Utils
import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// App Utils
import AuthenticatedRequest from '../types/ExpressRequest';
import user from '../models/userModel';
import i18n from '../i18n.config';

const userMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction)=>{

    try {

        // Verify in the header for authorization
        if (req.headers && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {

            // Get the full authorization value
            const authToken = req.headers.authorization;
            
            // Get the authorization's code
            const token = authToken.split(' ')[1];

            // Decode the authorization's code
            const decodeToken = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as {id: string};

            // Extract the user's ID
            const { id } = decodeToken;
            
            // Get the user data
            const userData = await user.findById(id);
            
            // Verify if user data exists
            if ( userData ) {
                
                // Add the user property to the req object
                req.user = {
                    _id: userData._id.toString(),
                    email: userData.email
                }

            }

            next();
        } else {
            // Return error
            res.status(200).json({
                success: false,
                message: i18n.__('authorization_token_not_valid')                
            });
        }

    } catch (error) {

        // Verify if the session is expired
        if ( error && typeof error === 'object' && 'name' in error && typeof error.name === 'string' && error.name === 'TokenExpiredError' ) {

            // Return error to user
            res.status(200).json({
                success: false,
                message: i18n.__('your_session_has_expired')
            });
            
        } else {

            // Return error to user
            res.status(200).json({
                success: false,
                message: i18n.__('an_unknown_error_occurred')
            });

        }
    }
}

export {
    userMiddleware
}