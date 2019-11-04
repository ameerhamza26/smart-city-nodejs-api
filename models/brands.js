const Sequelize = require('sequelize')

var Brands = sequelize.define('brands', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        field: 'name'
    },
    description: {
        type: Sequelize.STRING,
        field: 'description'
    },
    logo: {
        type: Sequelize.STRING,
        field: 'logo'
    },
    type: {
        type: Sequelize.STRING,
        field: 'type'
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

Brands.sync().then(function () {
    // Table created
});
exports.Brands = Brands;

var BrandOffers = sequelize.define('brand_offers', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    brandId: {
        type: Sequelize.INTEGER,
        field: 'brand_id'
    },
    offer: {
        type: Sequelize.STRING,
        field: 'offer'
    },
    points: {
        type: Sequelize.INTEGER,
        field: 'points'
    },
    createdAt: {
        field: 'created_at',
        type: Sequelize.DATE,
    },
    expiry: {
        field: 'expiry',
        type: Sequelize.DATE,
    },
    updatedAt: {
        field: 'updated_at',
        type: Sequelize.DATE,
    }
})

BrandOffers.sync().then(function () {
    // Table created
});
exports.BrandOffers = BrandOffers;

var BrandLocation = sequelize.define('brand_locations', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    brandId: {
        type: Sequelize.INTEGER,
        field: 'brand_id'
    },
    address: {
        type: Sequelize.STRING,
        field: 'address'
    },
    latitude: {
        type: Sequelize.STRING,
        field: 'latitude'
    },
    longitude: {
        type: Sequelize.STRING,
        field: 'longitude'
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

BrandLocation.sync().then(function () {
    // Table created
});
exports.BrandLocation = BrandLocation;

var BrandUsers = sequelize.define('brand_users', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    brandId: {
        type: Sequelize.INTEGER,
        field: 'brand_id'
    },
    userId: {
        type: Sequelize.INTEGER,
        field: 'user_id'
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

BrandUsers.sync().then(function () {
    // Table created
});
exports.BrandUsers = BrandUsers;