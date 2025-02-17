const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('locations', [
      {
        id: uuidv4(),
        type: 'PRIVAAT',
        vacatedSince: null,
        address: 'Westzeedijk 341',
        city: 'Rotterdam',
        latitude: 51.910530,
        longitude: 4.473490,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        type: 'PUBLIEK',
        vacatedSince: null,
        address: 'Museumpark 25',
        city: 'Rotterdam',
        latitude: 51.914488,
        longitude: 4.470987,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        type: 'COMMERCIEEL',
        vacatedSince: null,
        address: 'Coolsingel 105',
        city: 'Rotterdam',
        latitude: 51.920464,
        longitude: 4.479193,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        type: 'ONBEKEND',
        vacatedSince: null,
        address: 'Vlietlaan 45',
        city: 'Rotterdam',
        latitude: 51.929336,
        longitude: 4.501709,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('locations');
  }
};
