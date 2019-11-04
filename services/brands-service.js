const Brands = require('../models/brands').Brands
const BrandOffers = require('../models/brands').BrandOffers
const BrandLocation = require('../models/brands').BrandLocation
const BrandUser = require('../models/brands').BrandUsers
const User = require('../models/users').User;
const utils = require('../utils/util');
const emails = require('../emails/temaplates')

exports.create = async (brand, user, logo, location, done)=> {
    try {
        i = 0;
        finalData =[];
        finalLogo = await utils.uploadFiles([logo], i, finalData);
        brand['logo'] = finalLogo[0];
        brand = await Brands.create(brand);
        location['brandId'] = brand.id;
        console.log("location is", location);
        location = await BrandLocation.create(location)
        const token = await utils.generateRandomBytes(48);
        const confirmLink = 'http://localhost:4200/#/verify-email?token='+token;
        var tokenExpiry = Date.now()+ 3600000
        user = await User.create({
            username: user.email,
            email: user.email,
            firstName : user.firstName,
            lastName: user.lastName,
            role: 'brand',
            registerToken: token,
            registerTokenExpiry: tokenExpiry
        })

        await BrandUser.create({
            brandId: brand.id,
            userId: user.id
        })

        await utils.sendMail(user.email, "Welcome to Smart City Application", emails.confirmEmail(confirmLink))
        done(null, "brand created successfully");
    } catch(err) {
        console.log(err)
        done(err, null);
    }
}

exports.getBrandById = async (brand_id, done) => {
    try {
        finalData = {}
        brand = await Brands.find({
            where: {
                id: brand_id
            }
        })

        location = await BrandLocation.find({
            where: {
                brandId: brand_id
            }
        })

        finalData['brand'] = brand
        finalData['location'] = location
        done(null, finalData);
    } catch(err) {
        done(err, null);
    }
}

exports.getBrandByUserId = async (user_id, done) => {
    try {
        finalData = {}
        branduser = await BrandUser.find({
            where: {
                userId: user_id
            }
        })

        finalData['brand_id'] = branduser.brandId
        done(null, finalData);
    } catch(err) {
        done(err, null);
    }
}



exports.createOffer = async (offer, done) => {
    try {
        console.log("offer", offer);
        brandOffer = await BrandOffers.create(offer)
        done(null, brandOffer);
    } catch(err) {
        console.log(err)
        done(err, null);
    }
}

exports.getOffers = async (done)=> {
    console.log("in get offer")
    try {
        finalObj = []
        brandOffers = await BrandOffers.findAll()
        
        for (let offer of brandOffers) {
            obj = {}
            brand = await Brands.find({
                where: {
                    id: offer.brandId
                }
            })
            obj['offer'] = offer
            obj['brand'] = brand
            finalObj.push(obj)
        }
        done(null, finalObj);
    } catch(err) {
        console.log(err)
        done(err, null);
    }
}

exports.availOffer = async (userid, offerid, done) => {
    try {
        offer = await BrandOffers.findOne({
            where: {
                id: offerid
            }
        })
    
        user = await User.findOne({
            where: {
                blockchainAccountId: userid
            }
        })

        brand = await Brands.findOne({
            where : {
                id: offer.brandId
            }
        })

        smartCityContract = await utils.getSmartCityContract();
        points = await smartCityContract.methods.getUserPoints(userid).call();
        
        if (points >= offer.points){
            console.log(userid, offer.points)
            await smartCityContract.methods.minusPoints(userid, offer.points).send({
                from: '0xf0B13fA6C28E75257C311f5E53fc393784a54F4B',
                gas: '3000000'
              })

              points = await smartCityContract.methods.getUserPoints(userid).call();

              console.log(points);
            await utils.sendMail(user.email, "A reward for your good deed! hoola!", emails.availOffer(offer.offer, brand.name))
            done(null, 'success');
        } else {
            done('not enough points', null);
        }
    } catch(err) {
        console.log(err);
        done(err, null);
    }
}