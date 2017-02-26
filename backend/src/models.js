import Sequelize from 'sequelize';
import config from 'config';
import { getSignedUrl } from './s3';


// Initial Config

// const databaseConfig = config.database;
const databaseConfig = config.get('database');
const sequelize = new Sequelize(databaseConfig.database, databaseConfig.username,
  databaseConfig.password, databaseConfig);
const db = { sequelize, Sequelize };


// Models

db.Screen = sequelize.define('screen', {
  name: Sequelize.STRING,
  description: Sequelize.STRING,
  xCoordinate: Sequelize.DOUBLE,
  yCoordinate: Sequelize.DOUBLE,
}, {
  getterMethods: {
    serialized() {
      return {
        id: this.id,
        organizationId: this.organizationId,
        name: this.name,
        description: this.description,
        parentId: this.parentId,
        xCoordinate: this.xCoordinate,
        yCoordinate: this.yCoordinate,
      };
    },
  },
});

db.Folder = sequelize.define('folder', {
  name: Sequelize.STRING,
  mapKey: Sequelize.STRING,
  mapUrl: Sequelize.STRING,
  mapUrlTime: Sequelize.INTEGER,
}, {
  getterMethods: {
    serialized() {
      return {
        id: this.id,
        organizationId: this.organizationId,
        name: this.name,
        parentId: this.parentId,
        mapUrl: this.mapUrl,
      };
    },
  },
  instanceMethods: {
    refreshSignedUrls() {
      if (this.mapUrlTime && (Date.now() - this.mapUrlTime < 432000)) {
        return Promise.resolve(this);
      }
      return getSignedUrl(this.mapKey).then(url => {
        this.mapUrl = url;
        this.mapUrlTime = Date.now();
        return this.save();
      });
    },
  },
});

db.Playable = sequelize.define('playable', {
  name: Sequelize.STRING,
  description: Sequelize.STRING,
  slideDuration: Sequelize.INTEGER,
  key: Sequelize.STRING,
  url: Sequelize.STRING,
  urlTime: Sequelize.INTEGER,
  thumbnailKey: Sequelize.STRING,
  thumbnailUrl: Sequelize.STRING,
  thumbnailUrlTime: Sequelize.INTEGER,
}, {
  getterMethods: {
    serialized() {
      return {
        id: this.id,
        organizationId: this.organizationId,
        name: this.name,
        description: this.description,
        slideDuration: this.slideDuration,
        url: this.url,
        thumbnailUrl: this.thumbnailUrl,
      };
    },
  },
  instanceMethods: {
    refreshSignedUrls() {
      if (this.urlTime && (Date.now() - this.urlTime < 432000)) {
        return Promise.resolve(this);
      }
      return getSignedUrl(this.key).then(url => {
        this.url = url;
        this.urlTime = Date.now();
        return getSignedUrl(this.thumbnailKey);
      }).then(thumbnailUrl => {
        this.thumbnailUrl = thumbnailUrl;
        this.thumbnailUrlTime = Date.now();
        return this.save();
      });
    },
  },
});

db.Organization = sequelize.define('organization', {
  name: Sequelize.STRING,
  description: Sequelize.STRING,
});

db.User = sequelize.define('user', {
  username: Sequelize.STRING,
  password: Sequelize.STRING,
});

// Associations

// playable (many) => screen (many)
db.Playable.belongsToMany(db.Screen, {
  as: 'screens',
  through: 'screens_playables',
  foreignKey: 'playableId',
});
db.Screen.belongsToMany(db.Playable, {
  as: 'playables',
  through: 'screens_playables',
  foreignKey: 'screenId',
});


// folder (1) => screen (many)
db.Screen.belongsTo(db.Folder, {
  as: 'parent',
  foreignKey: 'parentId',
});
db.Folder.hasMany(db.Screen, {
  as: 'screens',
  foreignKey: 'parentId',
});

// folder (1) => folder (many)
db.Folder.belongsTo(db.Folder, {
  as: 'parent',
  foreignKey: 'parentId',
});
db.Folder.hasMany(db.Folder, {
  as: 'folders',
  foreignKey: 'parentId',
});

// user (many) => organization (1)
db.User.belongsTo(db.Organization, {
  as: 'organization',
  foreignKey: 'organizationId',
});
db.Organization.hasMany(db.User, {
  as: 'users',
  foreignKey: 'organizationId',
});

// playable (many) => organization (1)
db.Playable.belongsTo(db.Organization, {
  as: 'organization',
  foreignKey: 'organizationId',
});
db.Organization.hasMany(db.Playable, {
  as: 'playables',
  foreignKey: 'organizationId',
});

// folder (many) => organization (1)
db.Folder.belongsTo(db.Organization, {
  as: 'organization',
  foreignKey: 'organizationId',
});
db.Organization.hasMany(db.Folder, {
  as: 'folders',
  foreignKey: 'organizationId',
});

// screen (many) => organization (1)
db.Screen.belongsTo(db.Organization, {
  as: 'organization',
  foreignKey: 'organizationId',
});
db.Organization.hasMany(db.Screen, {
  as: 'screens',
  foreignKey: 'organizationId',
});

export default db;
