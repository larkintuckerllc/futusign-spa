const path = require('path');

module.exports = function (shipit) {
  shipit.initConfig({
    staging: {
      servers: 'sangaline@staging.futusign.com',
      dist: '/www/sites/futusign-staging/api',
      process: 'futusign-staging',
    },
    production: {
      servers: 'sangaline@app.futusign.com',
      dist: '/www/sites/futusign-production/api',
      process: 'futusign-production',
    },
  });

  // kind of a hack to load in the appropriate settings from `config/`
  process.env.NODE_ENV = shipit.environment;
  const appConfig = require('config');
  const dbConfig = appConfig.get('database');

  // remove any trailing slashes from dist so that we can append suffixes (e.g. `.bak`)
  while (shipit.config.dist.slice(-1) === '/') shipit.config.dist = shipit.config.dist.slice(0, -1);

  // backup the deployment and the corresponding database
  shipit.task('backup', () => {
    const backupDir = `${shipit.config.dist}.bak`;
    const databaseBackupFile = `${path.join(backupDir, dbConfig.database)}.sql`;
    const databaseDumpCommand = `mysqldump -u${dbConfig.username} -p${dbConfig.password} ${dbConfig.database}`;

    return shipit.remote(`rm -rf ${backupDir}`).then(() => (
      // remove the old backup
      shipit.remote(`cp -r ${shipit.config.dist} ${backupDir}`)
    )).then(() => (
      // backup the current app directory
      shipit.remote(`cp -r ${shipit.config.dist} ${backupDir}`)
    )).then(() => (
      // dump the database into the backup directory
      shipit.remote(`${databaseDumpCommand} > ${databaseBackupFile}`)
    )).then(() => (
      // fix the permissions
      shipit.remote(`chmod -R g+w ${backupDir}`)
    ));
  });

  shipit.task('restore', () => {
    const backupDir = `${shipit.config.dist}.bak`;
    const databaseBackupFile = `${path.join(backupDir, dbConfig.database)}.sql`;
    const mysqlCommand = `mysql -u${dbConfig.username} -p${dbConfig.password}`;
    const dropDatabase = `DROP DATABASE IF EXISTS ${dbConfig.database}`;
    const createDatabase = `CREATE DATABASE ${dbConfig.database} ` +
                            `CHARACTER SET = 'utf8mb4' COLLATE = 'utf8mb4_bin'`;

    // restore the `dist` directory from the backup
    return shipit.remote(`rm -rf ${shipit.config.dist}`).then(() => (
      shipit.remote(`cp -r ${backupDir} ${shipit.config.dist}`)
    )).then(() => (
      // drop the database
      shipit.remote(`echo "${dropDatabase}; ${createDatabase};" | ${mysqlCommand}`)
    )).then(() => (
      // restore the database
      shipit.remote(`${mysqlCommand} ${dbConfig.database} < ${databaseBackupFile}`)
    )).then(() => (
      // restart the process
      shipit.start('restart')
    ));
  });

  shipit.task('restart', () => (
    shipit.remote(`pm2 restart ${shipit.config.process}`)
  ));

  shipit.task('logs', () => (
    shipit.remote(`pm2 logs ${shipit.config.process}`)
  ));

  shipit.task('build', () => (
    shipit.local('yarn && webpack --bail -p', { env: process.env })
  ));

  // the full deployment process
  shipit.task('deploy', ['build', 'backup'], () => (
    // remove the remote
    shipit.remote(`rm -rf ${shipit.config.dist}`).then(() => (
      // copy over the new build
      shipit.remoteCopy('dist/', shipit.config.dist)
    )).then(() => (
      // install dependencies
      shipit.remote(`cd ${shipit.config.dist} && yarn install --production`)
    )).then(() => (
      // restart the process
      shipit.start('restart')
    )).then(() => (
      // fix the permissions
      shipit.remote(`chmod -R g+w ${shipit.config.dist}`)
    ))
  ));
};
