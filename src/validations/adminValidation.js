import Joi from "joi";

export const registerSchema = Joi.object({
  username: Joi.string().min(5).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(5).max(70).required(),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
  status: Joi.string().valid("active", "suspended").default("active"),
  profilePicture: Joi.string().uri().optional(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
