export default () => ({
  nodeEnv: process.env.NODE_ENV,
  port: parseInt(process.env.PORT!, 10),
  ghApp: {
    repositoriesPath: process.env.REPOSITORIES_PATH,
    privateAccessToken: process.env.GH_PROCCESS_ACCESS_TOKEN,
  },
});
