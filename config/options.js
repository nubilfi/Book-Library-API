module.exports = {
  mongodb: {
    dbURL: process.env.MONGODB_URI,
    dbOptions: {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
      reconnectTries: Number.MAX_VALUE,
      reconnectInterval: 500,
      poolSize: 5,
      bufferMaxEntries: 0,
    },
  },
  jwtSecret: { tokenKey: process.env.JWT_TOKEN },
};
