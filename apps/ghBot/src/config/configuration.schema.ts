import * as Joi from 'joi';

export default Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'provision')
    .default('development'),

  PORT: Joi.number().port().default(3001),

  REPOSITORIES_PATH: Joi.string().required(),

  GH_PROCCESS_ACCESS_TOKEN: Joi.string().required(),
  GH_USERNAME: Joi.string().required(),
});
