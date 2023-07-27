'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('servicii', 'descriere', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });

    await queryInterface.changeColumn('servicii', 'durata', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('servicii', 'durata', {
      type: Sequelize.FLOAT,
      allowNull: false,
    });

    await queryInterface.removeColumn('servicii', 'descriere');
  }
};
