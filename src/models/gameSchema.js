import joi from "joi";

export const GameSchema = joi.object({
  name: joi.string().required().min(1),
  image: joi.string().required(),
  stockTotal: joi.number().required().min(1),
  categoryId: joi.number().required(),
  pricePerDay: joi.number().required().min(1),
});

  
