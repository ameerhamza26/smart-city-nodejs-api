const Sequelize = require('sequelize')

var Session = sequelize.define('sessions', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: Sequelize.INTEGER,
        field: 'user_id'
    },
    token: {
        type: Sequelize.STRING,
        field: 'token'
    },
    status: {
        type: Sequelize.STRING,
        field: 'status'
    },
    createdAt: {
        field: 'created_at',
        type: Sequelize.DATE,
    },
    updatedAt: {
        field: 'updated_at',
        type: Sequelize.DATE,
    }
})

Session.sync().then(function () {
    // Table created
});
exports.Session = Session;
