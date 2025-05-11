import { Sequelize } from "sequelize";
import dotenv from 'dotenv'
dotenv.config();

const db_name = process.env.DB_NAME;
const db_user = process.env.DB_USER;
const db_password = process.env.DB_PASSWORD;
const db_host = process.env.DB_HOST;
const db_port = process.env.DB_PORT || 5432; // Default PostgreSQL port; change if using MySQL or another DB
const db_dialect = process.env.DB_DIALECT ; // Default to PostgreSQL; change if using MySQL or another DB

const sequelize = new Sequelize(db_name, db_user, db_password, {
    host: db_host,
    port: db_port, // Default PostgreSQL port; change if using MySQL or another DB
    dialect: db_dialect, // Use 'mysql' for MySQL; change this for PostgreSQL, SQLite, etc.
    logging: false, // Disable query logging (set to `console.log` for debugging)
    define: {
        // Ensure all tables use the InnoDB storage engine
        timestamps: true, // Automatically add createdAt and updatedAt fields
        underscored: false, // Use camelCase instead of snake_case for column names
    },
}); 

export default sequelize;