import {body} from 'express-validator'

export const registerValidation=[
    body('name')
    .trim()
    .notEmpty()
    .withMessage('Enter valid name'),

    body('email')
    .isEmail()
    .withMessage('Enter Email'),

    body('password')
    .isLength({min:6})
    .withMessage('password must be of 6 characters')
];

export const loginValidation=[
    body('email')
    .isEmail()
    .withMessage('Valid Email is required'),

    body('password')
    .notEmpty()
    .withMessage('Password mismatched')
];