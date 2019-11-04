const utils = require('../utils/util')
const userService = require('../services/user-service')

exports.register = (req, res) => {
    var user = req.body.user
    userService.signup(user, async (err, result) => {
        if (err) {
            res.status(500).send({status: 'error', data: err})
        } else {
            res.status(200).send({status: 'success', data: result})
        }
    })
}

exports.verifyEmail = (req, res) => {
    userService.verifyEmail(req.body.token, async (err, result)=> {
        if (err) {
            res.status(500).send({data: err, status: 'error'})
        } else {
            res.status(200).send({status: 'success', data : result})
        }
    })
}

exports.completeSignup = async(req, res) => {
    email = req.body.email
    password = req.body.password 

    userService.updateUser(true, password, email, (err, result) => {
        if (err) {
            res.status(500).send({status: 'error'})
        } else {
            res.status(200).send({status: 'success', data : result})
        }
    })
}

exports.login = async (req, res) => {
    var user = req.body.user
    console.log(req.body)
    userService.login(user.email, user.password, (err, result) => {
        if (err) {
            res.status(500).send({ data : err, status: 'error'})
        } else {
            res.status(200).send({status: 'success', data : result})
        }
    })
}

exports.getUsers = async (req, res) => {
    console.log(req.headers)
    var token = req.headers.token
    console.log(token)

    userService.getAllUsers((err, users) => {
        if (err) {
            res.status(500).send({ data : err, status: 'error'})
        } else {
            res.status(200).send({data: users, status: 'success'})
        }
    })

    // if (!token) {
    //     res.status(403).send({ data : 'You are unauthorized to access this url', status: 'error'})
    // } else {
    //     userService.getSession(token, (err, result) => {
    //         if (err) {
    //             res.status(403).send({ data : 'You are unauthorized to access this url', status: 'error'})
    //         } else {
    //             userService.getAllUsers((err, users) => {
    //                 if (err) {
    //                     res.status(500).send({ data : err, status: 'error'})
    //                 } else {
    //                     res.status(200).send({data: users, status: 'success'})
    //                 }
    //             })
    //         }
    //     })
    // }
}

exports.getUserById = (req, res)=> {
    userid = req.params.userid
    userService.getUserById(userid, (err, user) => {
        if (err) {
            res.status(500).send({ data : err, status: 'error'})
        } else {
            res.status(200).send({data: user, status: 'success'})
        }
    })
}

exports.getUserByUsername = async(req, res) => {
    username = req.params.username;
    data = await userService.getUserByUsername(username)
    res.status(200).send({data: data, status: 'success'})
}

exports.getDeals = async(req, res) => {
    userService.getDeals((err, deals) => {
        if (err) {
            res.status(500).send({ data : err, status: 'error'})
        } else {
            res.status(200).send({data: deals, status: 'success'})
        }
    })
}


exports.createUser =async (req, res) => {
        var user = JSON.parse(req.body.user)
        var location = JSON.parse(req.body.location)
        const token = await utils.generateRandomBytes(48)
        if (!req.files)
            return res.status(400).send('No files were uploaded.');
 
         var file = req.files.profile;
         if (typeof file == "undefined") {
            res.render('causes.ejs',{message: message});
        }
        else {
            var img_name = file.name;
 
            if(file.mimetype == "image/jpeg" ||file.mimetype == "image/png"||file.mimetype == "image/gif" ){
                                  
               file.mv('./uploads/'+file.name, function(err) {

                    if (err) {
                        res.status(500).send({status:'error', data: 'failed to upload file'})
                    } else {
                        user.image = img_name;
                        userService.createUser(user,location, token, (err, result)=> {
                            if (err) {
                                res.status(500).send({status:'error', data: err})
                            } else {
                                res.status(200).send({status:'success', data: result})
                            }
                        })
                    }

               })
            }
        }
  
};

exports.updateUser =async (req, res) => {
    var user = JSON.parse(req.body.user)
    var location = JSON.parse(req.body.location)
    var blockchainid = req.body.id
    const token = await utils.generateRandomBytes(48)
    if (!req.files)
        return res.status(400).send('No files were uploaded.');

     var file = req.files.profile;
     if (typeof file == "undefined") {
        res.render('causes.ejs',{message: message});
    }
    else {
        var img_name = file.name;

        if(file.mimetype == "image/jpeg" ||file.mimetype == "image/png"||file.mimetype == "image/gif" ){
                              
           file.mv('./uploads/'+file.name, function(err) {

                if (err) {
                    res.status(500).send({status:'error', data: 'failed to upload file'})
                } else {
                    user.image = img_name;
                    userService.updateUserData(blockchainid, user,location, token, (err, result)=> {
                        if (err) {
                            res.status(500).send({status:'error', data: err})
                        } else {
                            res.status(200).send({status:'success', data: result})
                        }
                    })
                }

           })
        }
    }

};

exports.setPassword = (req, res)=> {
    email = req.body.email
    password = req.body.password
    userService.setPassword(email, password, (err, result)=> {
        if (err) {
            res.status(500).send({status:'error', data: err})
        } else {
            res.status(200).send({status:'success', data: result})
        }
    })
}