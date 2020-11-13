'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Manga extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Manga.associate = function (models) {
        Manga.belongsTo(models.User, { foreignKey: 'UserId', as: 'user' })
    }
  };
  Manga.init({
    title: {type: DataTypes.STRING, allowNull: false,},
    url: {type: DataTypes.STRING, allowNull: false,},
    source: {type: DataTypes.STRING, allowNull: false,},
  }, {
    sequelize,
    modelName: 'Manga',
  });

  Manga.associate = function (models) {
    Manga.belongsTo(models.User, { foreignKey: 'UserId', as: 'user' })
}
  return Manga;
};