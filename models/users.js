const Sequelize = require('sequelize')

var Users = sequelize.define('users', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: {
      type: Sequelize.STRING,
      field: 'first_name' // Will result in an attribute that is firstName when user facing but first_name in the database
    },
    lastName: {
      type: Sequelize.STRING,
      field: 'last_name' // Will result in an attribute that is firstName when user facing but first_name in the database
    },
    email: {
      type: Sequelize.STRING,
      field: 'email' // Will result in an attribute that is firstName when user facing but first_name in the database
    },
    username: {
      type: Sequelize.STRING,
      field: 'username' // Will result in an attribute that is firstName when user facing but first_name in the database
    },
    registerToken: {
      type: Sequelize.STRING,
      field: 'register_token' // Will result in an attribute that is firstName when user facing but first_name in the database
    },
    registerTokenExpiry: {
      type: Sequelize.DATE,
      field: 'register_token_expiry' // Will result in an attribute that is firstName when user facing but first_name in the database
    },
    blockchainAccountId: {
      type: Sequelize.STRING,
      field: 'blockchain_account_id' // Will result in an attribute that is firstName when user facing but first_name in the database
    },
    password: {
      type: Sequelize.STRING,
      field: 'password' // Will result in an attribute that is firstName when user facing but first_name in the database
    },
    blockchainPassword: {
      type: Sequelize.STRING,
      field: 'blockchain_password' // Will result in an attribute that is firstName when user facing but first_name in the database
    },
    isEmailVerified: {
      type: Sequelize.BOOLEAN,
      field: 'is_email_verified' // Will result in an attribute that is firstName when user facing but first_name in the database
    },
    createdAt: {
        field: 'created_at',
        type: Sequelize.DATE,
    },
    updatedAt: {
        field: 'updated_at',
        type: Sequelize.DATE,
    }, 
    role: {
        field: 'role',
        type: Sequelize.STRING
    },
    image: {
        field: 'image',
        type: Sequelize.STRING
    }
  }, {
    timestamps: true
});

Users.sync().then(function () {
    // Table created
});
  exports.User = Users;