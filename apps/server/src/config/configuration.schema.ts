import * as Joi from 'joi';

export default Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'provision')
    .default('development'),
  PORT: Joi.number().port().default(3000),
  GITHUB_OAUTH_CLIENT_ID: Joi.string(),
  GITHUB_OAUTH_CLIENT_SECRET: Joi.string(),
  DB_URL: Joi.string(),
  GH_BOT_URL: Joi.string(),
});
