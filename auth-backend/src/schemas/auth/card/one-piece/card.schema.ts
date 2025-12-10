// 11/12 10:52
// import Joi from 'joi';

// export const createCardSchema = Joi.object({
//   name: Joi.string().required().min(2).max(100),
//   category: Joi.string().required(),
//   condition: Joi.string().valid('mint', 'near-mint', 'good', 'fair').required(),
//   description: Joi.string().optional().max(500),
//   price: Joi.number().required().min(0),
// });

// export const updateCardStatusSchema = Joi.object({
//   status: Joi.string().valid('approved', 'rejected').required(),
// });

import Joi from 'joi';

export const createCardSchema = Joi.object({
  name: Joi.string().required().min(2).max(100),
  category: Joi.string().required(),
  condition: Joi.string().valid('mint', 'near-mint', 'good', 'fair').required(),
  description: Joi.string().optional().max(500),
  price: Joi.number().required().min(0),
});

export const updateCardStatusSchema = Joi.object({
  status: Joi.string().valid('approved', 'rejected').required(),
  rejectionReason: Joi.when('status', {
    is: 'rejected',
    then: Joi.string().required().min(5).max(500),
    otherwise: Joi.string().optional().allow('')
  })
});