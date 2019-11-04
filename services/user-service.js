var mysql = require('promise-mysql');
const emails = require('../emails/temaplates')
var config = require('../config');
var moment = require('moment');
var db = require('../db/db')
const bcrypt = require('bcryptjs');
const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider(config.blockChainConfig.host))
const utils = require('../utils/util')
const User = require('../models/users').User;
const Session = require('../models/session').Session
const Location = require('../models/location').Location

const userModel = {
    Id: 'id',
    RegisterToken : 'register_token',
    RegisterTokenExpiry : 'register_token_expiry',
    Username : 'username',
    Email: 'email', 
    IsEmailVerified: 'is_email_verified',
    BlockchainAccountId: 'blockchain_account_id',
    Password: 'password'
}

const userTable = 'users'

exports.updateUserData = async (id, user, loc, token, done) => {
    try {
    
        userdetails = await User.find({
            where: {
                blockchainAccountId: id
            }
        })

        await User.update({
            firstName : user.firstName,
            lastName : user.lastName,
            username : user.username,
            email: user.email,
            image: user.image,
            role: user.role
        }, {
            where : {
                id : userdetails.id
            }
        })
    
        location = await Location.find({
            where: {
                userId: userdetails.id
            }
        })
        console.log("location is" , location)
        if (location) {
            await Location.create({
                userId: userdetails.id,
                address: loc.address,
                longitude: loc.longitude,
                latitude: loc.latitude
            })
    
        } else {
            await Location.update({
                address: loc.address,
                longitude: loc.longitude,
                latitude: loc.latitude
            }, {
                where: {
                    userId: userdetails.id,
                }
            })
    
        }

        done(null, 'user updated successfully')
    } catch(err) {
        console.log(err)
        done(err);
    }
}

exports.createUser = async (user, loc, token, done) => {
    try {
        smartCityContract = await utils.getSmartCityContract();
        const token = await utils.generateRandomBytes(48);
        const confirmLink = 'http://localhost:4200/#/verify-email?token='+token

        insertedUser = await User.create({
            firstName : user.firstName,
            lastName : user.lastName,
            username : user.username,
            email: user.email,
            image: user.image,
            role: user.role,
            passsword: user.passsword
        })
    
        await Location.create({
                userId: insertedUser.id,
                address: loc.address,
                longitude: loc.longitude,
                latitude: loc.latitude
            })
    
        addr = await web3.eth.personal.newAccount('123456')
        
        await smartCityContract.methods.createUser(addr,0).send({
            from: config.blockChainMainAccount.id,
            gas: '3000000'
          })

        var tokenExpiry = Date.now()+ 3600000
        User.update({
            blockchainAccountId: addr,
            registerToken: token,
            registerTokenExpiry: tokenExpiry,
            blockchainPassword: '123456'
        }, {
            where : {
                id : insertedUser.id
            }
        })
        await utils.sendMail(user.email, "Welcome to Smart City Application", emails.confirmEmail(confirmLink))
        done(null, 'user created successfully')
    } catch(err) {
        console.log(err)
        done(err);
    }
}

exports.signup = async (user, done) => {
    try {
        smartCityContract = await utils.getSmartCityContract();
        const token = await utils.generateRandomBytes(48);
        const confirmLink = 'http://localhost:4200/#/verify-email?token='+token
        const userObject = {
            firstName : user.firstName,
            lastName : user.lastName,
            username : user.username,
            email: user.email,
        }

        if (user.password) {
            hashPassword = await bcrypt.hash(user.password, 10);
            userObject['password'] = hashPassword
        }

        user = await User.create(userObject)
        addr = await web3.eth.personal.newAccount('123456')

        await smartCityContract.methods.createUser(addr,0).send({
            from: config.blockChainMainAccount.id,
            gas: '3000000'
          })
        
        var tokenExpiry = Date.now()+ 3600000

        await User.update({
            blockchainAccountId: addr,
            registerToken: token,
            registerTokenExpiry: tokenExpiry,
            blockchainPassword: '123456'
        }, {
            where : {
                id : user.id
            }
        })
        await utils.sendMail(user.email, "Welcome to Smart City Application", emails.confirmEmail(confirmLink))
        done(null,'user is saved successfully')
    } catch(err) {
        console.log(err)
        done(err)
    }
}

exports.setPassword = async(email, password, done) => {
    try {
        hashPassword = await bcrypt.hash(password, 10);

        await User.update({
            password: hashPassword,
            isEmailVerified: true,
            registerToken: null,
            registerTokenExpiry: null
        }, {
            where: {
                email: email
            }
        })

        done(null, 'success')
    } catch(err) {
        done(err, null);
    }
}

exports.verifyEmail = async (token, done) => {

    try {
        user = await User.find({
            where: {
                registerToken: token
            }
        })

        if (moment(Date.now()) > user.registerTokenExpiry) {
            done('token is expired', null)
        }

        if (!user.password) {
            done(null, {password: false, email: user.email})
        } else {

            await User.update({
                isEmailVerified: true,
                registerToken: null,
                registerTokenExpiry: null
            }, {
                where: {
                    id: user.id
                }
            })
    
            done(null, {password: true})
        }

    } catch (err) {
        console.log(err)
        done(err);
    }
}

exports.getSession = async (token, done) => {
    var result = await new db.buildQuery()
    .select('token', 'status').from('sessions').where('token', token)
    .one()

    console.log(result)
    if (result === undefined) {
        return done('session does not exist', null)
    }

    if (result['status'] !== 'ACTIVE') {
        return done('token is expired', null)
    }

    return done(null, 'session exists')
}

exports.getUserById = async (userid, done) => {
    try {
        var user;
        smartCityContract = await utils.getSmartCityContract();
        abc = true;
        i = 0;
        while (abc) {
            try {
                user = await smartCityContract.methods.users(i).call();
                if (user['id']== userid) {
                    details = await User.find({
                        where: {
                            blockchainAccountId: userid
                        }
                    })
                    user['details'] = details
                    abc = false;
                }
                i++
            } catch(err) {
                abc = false;
            }
        }
        done(null, user);
    } catch(err) {
        done(err, null);
    }
}
exports.getAllUsers = async (done) => {
    try {
        smartCityContract = await utils.getSmartCityContract();
        finalData = [];
        abc = true;
        i = 0;
        while (abc) {
            try {
                users = await smartCityContract.methods.users(i).call();
                finalData.push(users);
                i++
            } catch(err) {
                abc = false;
            }
        }
        users = await User.findAll();
        if (users && users.length > 0) {
            for (let user of users) {
                for (let data of finalData) {
                    if (user.blockchainAccountId == data['id']) {
                        data['details'] = user;
                        break;
                    }
                    
                }
            }
        }
        done(null, finalData);
    } catch(err) {
        done(err, null);
    }
}

exports.getUserByUsername = async (username) => {
    var result = await new db.buildQuery()
    .select('id', 'email', 'username', 'blockchain_account_id', 'points', 'coins').from('users').where('username', username)
    .one()
    return { id: result['id'], email : result['email'], username: result['username'], blockchain_account_id: result['blockchain_account_id'], points: result['points'], coins: result['coins']}
}

exports.login = async (email, password, done) => {

    try {
        userDetails = await User.find({
            where : {
                email: email,
                isEmailVerified: true
            }
        })
    
        isExists = await bcrypt.compare(password, userDetails.password)
        var user; 
        if (isExists) {
            console.log("is exists")
            if (userDetails.role == 'brand') {
                user = {}
                user['details'] = userDetails
                const token = await utils.generateRandomBytes(48)
                    Session.create({
                        userId: userDetails.id,
                        token: token,
                        status: 'ACTIVE'
                    }).then((session)=> {
                        done(null, {token: session.token, user: user})
                    },err=> {
                        done(err)
                    })
            } else {
                isAuthenticated = await web3.eth.personal.unlockAccount(userDetails.blockchainAccountId, userDetails.blockchainPassword, 3600)
                if (isAuthenticated) {
                    console.log("is authennticates")
                    smartCityContract = await utils.getSmartCityContract();
    
                    // userBlockchain = await smartCityContract.methods.findUserDetailsById(userDetails.blockchainAccountId).call({
                    //     from: '0xf0B13fA6C28E75257C311f5E53fc393784a54F4B',
                    //     gas: '3000000'
                    // });
    
                    abc = true;
                    i = 0;
                    while (abc) {
                        try {
                            user = await smartCityContract.methods.users(i).call();
                            console.log("user is", user)
                            if (user['id']== userDetails.blockchainAccountId) {
                                console.log("in if")
                                if (user['points']> 100) {
                                    await User.update({
                                        role: 'Approver'
                                    }, {
                                        where: {
                                            id: userDetails.id
                                        }
                                    })
    
                                    userDetails = await User.find({
                                        where : {
                                            email: email,
                                            isEmailVerified: true
                                        }
                                    })
    
                                    user['details'] = userDetails
                                    abc = false;
    
                                } else {
                                    user['details'] = userDetails
                                    abc = false;
                                }
                                
                            }
                            i++
                        } catch(err) {
                            console.log(err)
                            abc = false;
                        }
                    }
                    const token = await utils.generateRandomBytes(48)
                    Session.create({
                        userId: userDetails.id,
                        token: token,
                        status: 'ACTIVE'
                    }).then((session)=> {
                        done(null, {token: session.token, user: user})
                    },err=> {
                        done(err)
                    })
                } else {
                    return done('no user exists in blockchain', null)
                }
                
            }

        } else {
            return done('no user exists', null)
        }
    } catch(err) {
        console.log(err)
        done(err, null)
    }
}

exports.updateUser = async(isEmailVerified, email, done) => {
    var sql = `update `+userTable+` set ` +userModel.IsEmailVerified +` = ` + isEmailVerified + 
    ` where `+userModel.Email+` = '`+email+`' and `+userModel.IsEmailVerified+` = 0`

    console.log(sql)
    return await executeQuery(sql).then((res)=> {
        if (res.affectedRows> 0 ) {
            return done(null, 'user updated successfully')
        } else {
            return done('token is expired', 'user updated successfully')
        }
        
    }).catch(err => {
        return done('Error in updating user')
    })
}

exports.getDeals = async (done) => {
    var sql = `select * from deals `
    return await executeQueryAll(sql).then((res)=> { 
        return done(null, res)
    }).catch(err => {
        return done(err, null)
    })
}

executeQuery = (sql) => {
    var connection;
    return new Promise((resolve, reject)=> {
        mysql.createConnection(config.dbConfig).then(conn => {
            connection = conn;
            var result = connection.query(sql);
            connection.end();
            return result
        }).then((result)=> {
            if (result[0] === undefined) {
                resolve(result)
            } else {
                resolve(result[0])
            }
        }).catch(err => {
            reject(err)
        });
    })
}

executeQueryAll = (sql) => {
    var connection;
    return new Promise((resolve, reject)=> {
        mysql.createConnection(config.dbConfig).then(conn => {
            connection = conn;
            var result = connection.query(sql);
            connection.end();
            return result
        }).then((result)=> {
            if (result[0] === undefined) {
                resolve(result)
            } else {
                resolve(result)
            }
        }).catch(err => {
            reject(err)
        });
    })
}