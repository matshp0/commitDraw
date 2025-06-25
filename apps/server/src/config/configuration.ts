export default () => ({
  port: process.env.PORT || 3000,
  dbUrl:
    process.env.DB_URL ||
    'mongodb://admin:secret@mongo:27017/gitSheet?authSource=admin',
  ghOauth: {
    id: process.env.GITHUB_OAUTH_CLIENT_ID || 'id',
    secret: process.env.GITHUB_OAUTH_CLIENT_SECRET || 'secret',
  },
  ghBotUrl: process.env.GH_BOT_URL,
});
