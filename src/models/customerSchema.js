import joi from "joi";



export const customerSchema = joi.object({
  name: joi.string().required().min(1),
  phone: joi.string().required().min(10).max(12),
  cpf: joi.string().required().min(10).max(12),
  birthday: joi.date().required(),
});
