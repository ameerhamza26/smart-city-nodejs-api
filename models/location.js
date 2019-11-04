const Sequelize = require('sequelize')

var Location = sequelize.define('location', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: Sequelize.INTEGER,
        field: 'user_id'
    },
    address: {
        type: Sequelize.STRING,
        field: 'address'
    },
    longitude: {
        type: Sequelize.DOUBLE,
        field: 'longitude'
    },
    latitude: {
        type: Sequelize.DOUBLE,
        field: 'latitude'
    },
    createdAt: {
        field: 'created_at',
        type: Sequelize.DATE,
    },
    updatedAt: {
        field: 'updated_at',
        type: Sequelize.DATE,
    }
});

Location.sync().then(function () {
    // Table created
});

exports.Location = Location;