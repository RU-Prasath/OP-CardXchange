import Joi from 'joi';

// Password validation regex (optional but recommended)
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const registerSchema = Joi.object({
  fullName: Joi.string()
    .required()
    .min(2)
    .max(50)
    .messages({
      'string.empty': 'Full name is required',
      'string.min': 'Full name must be at least 2 characters',
      'string.max': 'Full name cannot exceed 50 characters'
    }),
  
  mobile: Joi.string()
    .required()
    .pattern(/^\d{10}$/)
    .messages({
      'string.empty': 'Mobile number is required',
      'string.pattern.base': 'Mobile number must be exactly 10 digits'
    }),
  
  email: Joi.string()
    .required()
    .email()
    .lowercase()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please provide a valid email address'
    }),
  
  password: Joi.string()
    .required()
    .min(6)
    // .pattern(passwordRegex) // Uncomment for stronger validation
    .messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 6 characters',
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
    }),
  
  confirmPassword: Joi.string()
    .required()
    .valid(Joi.ref('password'))
    .messages({
      'string.empty': 'Confirm password is required',
      'any.only': 'Passwords do not match'
    }),
  
  city: Joi.string().optional().allow(''),
  state: Joi.string().optional().allow(''),
  pincode: Joi.string().optional().allow(''),
});

export const loginSchema = Joi.object({
  email: Joi.string()
    .required()
    .email()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please provide a valid email address'
    }),
  
  password: Joi.string()
    .required()
    .messages({
      'string.empty': 'Password is required'
    }),
});

export const emailOtpSchema = Joi.object({
  email: Joi.string()
    .required()
    .email()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please provide a valid email address'
    }),
});

export const verifyOtpSchema = Joi.object({
  email: Joi.string()
    .required()
    .email()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please provide a valid email address'
    }),
  
  otp: Joi.string()
    .required()
    .pattern(/^\d{4}$/)
    .messages({
      'string.empty': 'OTP is required',
      'string.pattern.base': 'OTP must be 4 digits'
    }),
  
  fullName: Joi.string()
    .required()
    .min(2)
    .max(50)
    .messages({
      'string.empty': 'Full name is required',
      'string.min': 'Full name must be at least 2 characters',
      'string.max': 'Full name cannot exceed 50 characters'
    }),
  
  mobile: Joi.string()
    .required()
    .pattern(/^\d{10}$/)
    .messages({
      'string.empty': 'Mobile number is required',
      'string.pattern.base': 'Mobile number must be exactly 10 digits'
    }),
  
  password: Joi.string()
    .required()
    .min(6)
    .messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 6 characters'
    }),
  
  confirmPassword: Joi.string()
    .required()
    .valid(Joi.ref('password'))
    .messages({
      'string.empty': 'Confirm password is required',
      'any.only': 'Passwords do not match'
    }),
  
  city: Joi.string().optional().allow(''),
  state: Joi.string().optional().allow(''),
  pincode: Joi.string().optional().allow(''),
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string()
    .required()
    .email()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please provide a valid email address'
    }),
});

export const resetPasswordSchema = Joi.object({
  email: Joi.string()
    .required()
    .email()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please provide a valid email address'
    }),
  
  otp: Joi.string()
    .required()
    .pattern(/^\d{6}$/)
    .messages({
      'string.empty': 'OTP is required',
      'string.pattern.base': 'OTP must be 6 digits'
    }),
  
  password: Joi.string()
    .required()
    .min(6)
    .messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 6 characters'
    }),
  
  confirmPassword: Joi.string()
    .required()
    .valid(Joi.ref('password'))
    .messages({
      'string.empty': 'Confirm password is required',
      'any.only': 'Passwords do not match'
    }),
});