'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Update extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Update.init({
    title: {type: DataTypes.STRING, allowNull: false,},
    url: {type: DataTypes.STRING, allowNull: false,},
    img: {type: DataTypes.STRING, allowNull: false,},
    time: {type: DataTypes.STRING, allowNull: false,},
    chapter: {type: DataTypes.STRING, allowNull: false,},
    chapterUrl: {type: DataTypes.STRING, allowNull: false,},
    source: {type: DataTypes.STRING, allowNull: false,},
  }, {
    sequelize,
    modelName: 'Update',
  });

  return Update;
};

