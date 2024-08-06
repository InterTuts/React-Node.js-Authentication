// Installed Utils
import express from 'express';
import { body } from 'express-validator';

// App Utils
import i18n from '../i18n.config';
import { register, login, reset, changePassword } from '../controllers/authController';
import { socialConnect, getSocialCode, registerWithSocial } from '../controllers/socialController';

// Init the route manager
const authRoute = express.Router();

// Supported routes
authRoute.post('/register', [
    body('email').trim().isEmail().withMessage(i18n.__('invalid_email_address')),
    body('password').trim().isLength({ min: 8, max: 20 }).withMessage(i18n.__('password_incorrect_length'))
], register);
authRoute.post('/sign-in', [
    body('email').trim().isEmail().withMessage(i18n.__('invalid_email_address')),
    body('password').trim().isLength({ min: 8, max: 20 }).withMessage(i18n.__('password_incorrect_length'))
], login);
authRoute.post('/reset', [
    body('email').trim().isEmail().withMessage(i18n.__('invalid_email_address'))
], reset);
authRoute.post('/change-password', [
    body('code').trim().notEmpty().withMessage(i18n.__('password_reset_code_required')),
    body('password').trim().isLength({ min: 8, max: 20 }).withMessage(i18n.__('password_incorrect_length')),
    body('repeatPassword').trim().isLength({ min: 8, max: 20 }).withMessage(i18n.__('password_incorrect_length'))
], changePassword);
authRoute.get('/social-connect', socialConnect);
authRoute.post('/get-social-info', [
    body('code').trim().notEmpty().withMessage(i18n.__('authorization_code_not_provided')),
], getSocialCode);
authRoute.post('/social-register', [
    body('social_id').trim().notEmpty().withMessage(i18n.__('social_id_required')),
    body('email').trim().isEmail().withMessage(i18n.__('invalid_email_address')),
    body('password').trim().isLength({ min: 8, max: 20 }).withMessage(i18n.__('password_incorrect_length'))
], registerWithSocial);

export default authRoute;