const Sequelize = require('sequelize')

var PostTypes = sequelize.define('post_types', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: Sequelize.STRING,
        field: 'title'
    },
    description: {
        type: Sequelize.STRING,
        field: 'description'
    },
    points: {
        type: Sequelize.INTEGER,
        field: 'points'
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

PostTypes.sync().then(function () {
    // Table created
});

exports.PostTypes = PostTypes;