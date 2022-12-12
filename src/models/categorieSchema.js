import joi from "joi";

export const categorieSchema = joi.object({
  name: joi.string().required().min(1),
});
