var posts = require('../services/post-service')

exports.create = (req,res) => {
    console.log("pss")
    var post = JSON.parse(req.body.post)
    console.log(post)
    var location = JSON.parse(req.body.location)
    console.log(location)
    var activity = JSON.parse(req.body.activity)
    //res.status(200).send({status: 'success', data: req.body})
    var created_by = req.body.created_by;
    console.log(req.files)
    if (!req.files)
        return res.status(400).send('No files were uploaded.');

    posts.create(post,location, activity, created_by, req.files.imageBefore, req.files.imageAfter, function(err, result) {
        if (err) {
            res.status(500).send({status: 'error', data: err })
        } else {
            res.status(200).send({status: 'success', data: result})
        }
    });
}

exports.get = async (req, res) => {
    posts.getPosts((err, posts)=> {
        if (err) {
            res.status(500).send({status: 'error', data: err })
        } else {
            res.status(200).send({status: 'success', data: posts})
        }
    })
}

exports.getPostForApproval = async (req, res) => {
    userid = req.params.userid
    posts.getPostForApprovals(userid, (err, posts)=> {
        if (err) {
            res.status(500).send({status: 'error', data: err })
        } else {
            res.status(200).send({status: 'success', data: posts})
        }
    })
}


exports.approvePost = async(req, res) => {
    posts.approvePost(req.body.account_id, req.body.post_id, (err, result)=> {
        if (err) {
            res.status(500).send({status: 'error', data: err })
        } else {
            res.status(200).send({status: 'success', data: result})
        }
    })
}

exports.availCoins = async(req, res)=> {
    posts.availCoins(req.body.total_points, req.body.expected_points, req.body.coins, req.body.account_id, (err, result)=> {
        if (err) {
            res.status(500).send({status: 'error', data: err })
        } else {
            res.status(200).send({status: 'success', data: {}})
        }
    })
}

exports.getPostTypes = (req, res)=> {
    posts.getPostTypes((err, result)=>{
        if (err) {
            res.status(500).send({status: 'error', data: err })
        } else {
            res.status(200).send({status: 'success', data: result})
        }
    })
}