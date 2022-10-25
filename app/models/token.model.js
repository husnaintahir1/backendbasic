module.exports = (sequelize, Sequelize) => {
    const ResetToken = sequelize.define("token", {
      token: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      expiration: {
        type: Sequelize.DATE
      },
      used:{
        type:Sequelize.INTEGER ,
      }
    });
  
    return ResetToken;
  };