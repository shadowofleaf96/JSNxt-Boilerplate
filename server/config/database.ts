import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  process.env.MYSQL_DB_NAME!,
  process.env.MYSQL_DB_USER!,
  process.env.MYSQL_DB_PASS,
  {
    host: process.env.MYSQL_DB_HOST,
    dialect: "mysql",
    port: parseInt(process.env.MYSQL_DB_PORT || "3306"),
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    logging: process.env.NODE_ENV === "development" ? console.log : false,
  }
);

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    // this needed to be disabled in production
    await sequelize.sync({ alter: true });
    //
    console.log("MySQL connected successfully");
  } catch (error) {
    console.error("Unable to connect to MySQL:", error);
    process.exit(1);
  }
};

export default sequelize;
