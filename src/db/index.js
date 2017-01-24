import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';

const { DATABASE_URL } = process.env;
const sequelize = new Sequelize(DATABASE_URL,{
  logging: false,
});

const models = {};
const modelDir = path.join(__dirname, 'models');

fs
  .readdirSync(modelDir)
  .filter(function(file) {
    return (file.indexOf(".") !== 0) && (file !== "index.js");
  })
  .forEach(function(file) {
    const model = sequelize.import(path.join(modelDir, file));
    models[model.name] = model;
  });

Object.keys(models).forEach(function(modelName) {
  if ("associate" in models[modelName]) {
    models[modelName].associate(models);
  }
});

export {
  sequelize,
  models,
  Sequelize
};
