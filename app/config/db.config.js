module.exports = {
    HOST: "bakeree1.cdt8lhcxsp6q.us-east-2.rds.amazonaws.com",
    USER: "root",
    PASSWORD: "bakeree1",
    DB: "bakereedb",
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };