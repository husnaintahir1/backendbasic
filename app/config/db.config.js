module.exports = {
    HOST: "bakereedb.conj5xnbu8sn.us-east-2.rds.amazonaws.com",
    USER: "root",
    PASSWORD: "bakeree123",
    DB: "bakereedb",
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };