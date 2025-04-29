import { Sequelize } from "sequelize";
import { dbConfig } from "../config/config";
import logger from "../util/logger";

const sequelizeConnection = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: msg => logger.debug(msg),
  }
);

export default sequelizeConnection;
