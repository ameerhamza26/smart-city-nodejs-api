const brandService = require('../services/brands-service');

exports.create = (req,res) => {
    brand = JSON.parse(req.body.brand);
    user = JSON.parse(req.body.user);

    if (!req.files)
    return res.status(400).send('No files were uploaded.');

    location = JSON.parse(req.body.location);

    brandService.create(brand, user, req.files.logo, location, (err, result)=> {
        if (err) {
            res.status(500).send({status: 'error', data: err })
        } else {
            res.status(200).send({status: 'success', data: result})
        }
    })
}

exports.getBrandByUserId = (req,res)=> {
    userid = req.params.userid;
    brandService.getBrandByUserId(userid, (err, result)=>{
        if (err) {
            res.status(500).send({status: 'error', data: err })
        } else {
            res.status(200).send({status: 'success', data: result})
        }
    })
}

exports.getBrandById = (req, res) => {
    brandId = req.params.brandid;
    brandService.getBrandById(brandId, (err, result)=>{
        if (err) {
            res.status(500).send({status: 'error', data: err })
        } else {
            res.status(200).send({status: 'success', data: result})
        }
    })
}

exports.createOffer = (req, res)=> {
    offer = req.body.offer;
    brandService.createOffer(offer, (err, result)=> {
        if (err) {
            res.status(500).send({status: 'error', data: err })
        } else {
            res.status(200).send({status: 'success', data: result})
        }
    })
}

exports.getOffers = (req, res)=> {
    console.log("in get offer")
    brandService.getOffers((err, result)=> {
        if (err) {
            res.status(500).send({status: 'error', data: err })
        } else {
            res.status(200).send({status: 'success', data: result})
        }
    })
}

exports.availOffer = (req, res)=> {
    offerid = req.body.offerid;
    userid = req.body.userid;
    console.log(offerid)
    brandService.availOffer(userid, offerid, (err, result)=> {
        if (err) {
            res.status(500).send({status: 'error', data: err })
        } else {
            res.status(200).send({status: 'success', data: result})
        }
    })
}