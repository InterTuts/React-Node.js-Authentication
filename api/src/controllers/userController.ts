// Installed Utils
import { Response } from 'express';

// App Utils
import AuthenticatedRequest from '../types/ExpressRequest';

/**
 * Get the user info
 * 
 * @param Request req 
 * @param Response res 
 */
const userInfo = async (req: AuthenticatedRequest, res: Response) => {

    // Get the user data
    const { user } = req;

    // Verify if user's data exists
    if ( !user?._id ) {

        // Return error message
        return res.status(200).json({
            success: false,
            message: i18n.__('user_was_not_found')
        });

    }

    // Return success message
    res.status(200).json({
        success: true,
        content: {
            id: user?._id,
            email: user?.email
        }
    });

}

export {
    userInfo
}