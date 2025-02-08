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
        latitude: 515.911,
        longitude: 438.775,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        type: 'PUBLIEK',
        vacatedSince: null,
        address: 'Museumpark 18-20',
        city: 'Rotterdam',
        latitude: 515.914,
        longitude: 438.771,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        type: 'COMMERCIEEL',
        vacatedSince: null,
        address: 'Coolsingel 105',
        city: 'Rotterdam',
        latitude: 515.922,
        longitude: 438.779,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        type: 'ONBEKEND',
        vacatedSince: null,
        address: 'Witte de Withstraat 63',
        city: 'Rotterdam',
        latitude: 515.915,
        longitude: 438.774,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('locations', null, {});
  }
};
