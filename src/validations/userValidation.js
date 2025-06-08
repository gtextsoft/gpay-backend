import Joi from "joi";

export const registerSchema = Joi.object({
  phoneNumber: Joi.number().required(),
  email: Joi.string().email().required(),
  role: Joi.string().valid("individual", "business").required(),
  password: Joi.string().min(8).required(),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
  // username: Joi.string().min(5).max(10).required(),
  // lastname: Joi.string().min(5).max(10).required(),

  // Individual fields
  username: Joi.when("role", {
    is: "individual",
    then: Joi.string().required(),
    // then: Joi.string().min(5).max(10).required(),
    otherwise: Joi.forbidden(),
  }),
  lastname: Joi.when("role", {
    is: "individual",
    then: Joi.string().required(),
    // then: Joi.string().min(5).max(10).required(),
    otherwise: Joi.forbidden(),
  }),

  busName: Joi.when("role", {
    is: "business",
    then: Joi.string().required(),
    otherwise: Joi.forbidden(),
  }),
  busLastName: Joi.when("role", {
    is: "business",
    then: Joi.string().required(),
    otherwise: Joi.forbidden(),
  }),

  position: Joi.when("role", {
    is: "business",
    then: Joi.string().min(2).required(),
    otherwise: Joi.forbidden(),
  }),

  businessName: Joi.when("role", {
    is: "business",
    then: Joi.string().required(),
    otherwise: Joi.forbidden(),
  }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
