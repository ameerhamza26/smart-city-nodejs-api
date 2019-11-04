const Sequelize = require('sequelize')

var Posts = sequelize.define('posts', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: Sequelize.STRING,
        field: 'user_id'
    },
    postId: {
        type: Sequelize.STRING,
        field: 'post_id'
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

Posts.sync().then(function () {
    // Table created
});
exports.Posts = Posts;
