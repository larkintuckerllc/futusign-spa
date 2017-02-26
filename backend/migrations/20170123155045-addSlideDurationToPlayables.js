'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('playables', 'slideDuration', {
      type: Sequelize.INTEGER,
      defaultValue: 3,
      allowNull: false,
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('playables', 'slideDuration');
  }
};
