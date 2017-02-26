import Umzug from 'umzug';
import db from './models';

export const umzug = new Umzug({
  storage: 'sequelize',
  storageOptions: {
    sequelize: db.sequelize,
  },
  migrations: {
    params: [
      db.sequelize.getQueryInterface(),
      db.Sequelize,
    ],
  },
});

export const performMigrations = () => (
  umzug.up().then(migrations => {
    migrations.forEach(migration => (
      console.log(`Performed migration: ${migration.file}`)
    ));
    return migrations;
  }).catch(error => (
    console.error(`Error performing migration: ${error}`)
  ))
);
