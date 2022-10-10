module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("projects", {
      name: {
        type: Sequelize.STRING
      },
      CID: {
        type: Sequelize.STRING
      },
      count: {
        type: Sequelize.INTEGER
      },
      type: {
        type: Sequelize.STRING
      },
      size: {
        type: Sequelize.STRING
      },
      created_at: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
      },
      updated_at: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
      }
    
    });
  
    return User;
  };