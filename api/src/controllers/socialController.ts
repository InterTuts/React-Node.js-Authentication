// Installed Utils
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import axios from 'axios';
import querystring from 'querystring';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

// App Utils
import user from '../models/userModel';
import i18n from '../i18n.config';

/**
 * Redirect user to Google
 * 
 * @param Request req 
 * @param Response res 
 */
const socialConnect = async (req: Request, res: Response) => {

    // Login params
    const authParams = {
        client_id: process.env.GOOGLE_CLIENT_ID,
        scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
        redirect_uri: `${process.env.WEBSITE_URL}api/auth/social-register`,
        response_type: 'code',
        access_type: 'offline',
        prompt: 'consent'
    };

    // Build the login URL
    const loginUrl = `https://accounts.google.com/o/oauth2/v2/auth?${querystring.stringify(authParams)}`;

    // Return the login URL as JSON response
    res.redirect(loginUrl);

}

/**
 * Change the authorization code to an access token
 * 
 * @param Request req 
 * @param Response res 
 */
const getSocialCode = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(200).json({ errors: errors.array() });
    }

    // Get the authorization code
    const { code } = req.body;

    // Check if code is present
    if (!code) {
        return res.status(200).json({
            success: false,
            message: i18n.__('authorization_code_not_provided')
        });
    }

    // Create the content for the POST request
    const content = new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID as string,
        client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
        code: decodeURIComponent(code),
        redirect_uri: `${process.env.WEBSITE_URL}api/auth/social-register`,
        grant_type: 'authorization_code',
        access_type: 'offline',
        prompt: 'consent'
    });

    try {
        
        // Request the access token
        const tokenResponse = await axios.post('https://www.googleapis.com/oauth2/v4/token', new URLSearchParams(content).toString(), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        // Parse the JSON content
        const jsonResponse = tokenResponse.data;

        // Check if the request was successful
        if (tokenResponse.status !== 200) {
            return res.status(200).json({
                success: false,
                message: jsonResponse.error_description || i18n.__('an_unknown_error_occurred')
            });
        }

        // Extract the access token
        const accessToken = jsonResponse.access_token;

        // Verify if access token is missing
        if (!accessToken) {
            return res.status(200).json({
                success: false,
                message: i18n.__('access_token_not_found')
            });
        }

        // Initialize a new HttpClient session
        const accountDataResponse = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`);

        // Parse the JSON content
        const userInfo = accountDataResponse.data;

        // Extract the user's ID
        const socialId = userInfo.id;

        // Verify if user ID is missing
        if (!socialId) {
            return res.status(200).json({
                success: false,
                message: i18n.__('user_id_not_found')
            });
        }

        // Get a user
        const oneUser = await user.find({
            social_id: socialId
        });

        // Verify if user is already registered
        if ( Array.isArray(oneUser) && oneUser.length > 0 ) {

            // Generate an access token
            const token = jwt.sign({ id: oneUser[0]._id }, process.env.JWT_SECRET_KEY as string, { expiresIn: '30d' });
            
            // Return success message
            return res.status(200).json({
                success: true,
                message: i18n.__('you_have_successfully_signed_in'),
                content: {
                    id: oneUser[0]._id,
                    email: oneUser[0].email,
                    token: token
                }
            });

        }

        // Return success message
        return res.status(200).json({
            success: true,
            content: {
                social_id: socialId,
                email: userInfo.email
            }
        });

    } catch (error: unknown) {
        
        if (axios.isAxiosError(error)) {
            return res.status(200).json({
                success: false,
                message: error.response?.data?.error_description
            });            
        } else {
            return res.status(200).json({
                success: false,
                message: i18n.__('an_internal_error_occurred')
            });
        }
    }

}

/**
 * Register User Accounts
 * 
 * @param Request req 
 * @param Response res 
 */
const registerWithSocial = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(200).json({ errors: errors.array() });
    }

    // Get the user data
    const { social_id, email, password } = req.body;

    try {

        // Create user
        const saveUser = await user.create({ email, password, social_id });
        
        // Return success message
        res.status(201).json({
            success: true,
            message: i18n.__('user_was_created_successfully'),
            user: saveUser
        });
    } catch (error: unknown) {

        // Status code for response
        let statusCode = 200;

        // Default error message
        let errorMessage = i18n.__('an_error_occurred_while_creating_user');
    
        // Check if error is an instace of Error
        if (error instanceof Error) {
            if ('code' in error && error.code === 11000) {
                errorMessage = i18n.__('email_already_registered');
            } else if (error.name === 'ValidationError' && error instanceof mongoose.Error.ValidationError) {
                errorMessage = Object.values(error.errors).map(val => val.message).join(', ');
            }
        }
    
        // Return failed response
        res.status(statusCode).json({
            success: false,
            message: errorMessage
        });

    }
}

export {
    socialConnect,
    getSocialCode,
    registerWithSocial
}