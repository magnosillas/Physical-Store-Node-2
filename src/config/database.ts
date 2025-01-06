
import { Sequelize } from 'sequelize';
import logger from './winston'; 

const sequelize = new Sequelize('physical_store', 'postgres', 'postgres', {
  host: 'localhost',
  dialect: 'postgres',
  logging: (msg) => logger.info(msg),
});

export default sequelize;
