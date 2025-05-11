import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import { Sequelize } from 'sequelize';

// Load configuration file using fs
const configFilePath = path.resolve('config', 'config.json');
const configJSON = JSON.parse(fs.readFileSync(configFilePath, 'utf-8'));

// Use fileURLToPath to get __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load configuration based on environment
const env = process.env.NODE_ENV || 'development';
const config = configJSON[env];

// Initialize Sequelize instance
const sequelize = config.use_env_variable
    ? new Sequelize(process.env[config.use_env_variable], config)
    : new Sequelize(config.database, config.username, config.password, {
          ...config,
          dialect: 'postgres', // Explicitly set the dialect to PostgreSQL
      });

// Create an object to store models
const db = {};

// Dynamically import and register models
const files = fs
    .readdirSync(__dirname)
    .filter(file => file.endsWith('.js') && file !== path.basename(__filename));

for (const file of files) {
    const modelModule = await import(`./${file}`);
    const model = modelModule.default;

    if (model) {
        db[model.name] = model(sequelize); // Pass Sequelize instance to the model
    }
}

// Associate models
Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

// Export Sequelize instance and models
db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;