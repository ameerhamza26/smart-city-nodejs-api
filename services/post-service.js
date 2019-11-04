var mysql = require('promise-mysql');
var config = require('../config');
const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider("http://192.168.56.107:8000"))
const Location = require('../models/location').Location;
const Users = require('../models/users').User;
const utils = require('../utils/util')
const PostTypes = require('../models/post_types').PostTypes

exports.create = async (post, location, activity, created_by, imagesBefore, imagesAfter, done) => {
    try {
        i = 0;
        finalData =[];
        smartCityContract = await utils.getSmartCityContract();
        locations = await Location.findAll();
        beforeImages = await uploadFiles([imagesBefore], i, finalData);
        i = 0;
        finalData =[];
        afterImages = await uploadFiles([imagesAfter], i, finalData);
        distances = []
        for (let loc of locations) {
            distances.push(distance(location, loc, 'K'))
        }

        distances.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
        userIds = []
        j= 0;
        for (let dist of distances) {
            if (dist) {
                if (j < 4) {
                    userIds.push(dist.userId)
                }
            }
            j++;
        }

        users = await Users.findAll({
            where: {
                id: userIds
            }
        })

        blockChainIds = []
        for (let user of users) {
            blockChainIds.push(user.blockchainAccountId)
        }

        res = await smartCityContract.methods.createPost(post.description, beforeImages[0], afterImages[0], location.address, location.latitude.toString(), 
        location.longitude.toString(), activity.points, created_by, blockChainIds, 2)
        .send({
            from: config.blockChainMainAccount.id,
            gas: '3000000'
        })

        done(null, {locations: locations, distances: distances, minimumDistance: distances, userIds: userIds, users: users})
    } catch (err) {
        console.log(err)
        done(err, null);
    }
} 

function distance(location, user_location, unit) {
    var lat1 = location.latitude;
    var lat2 = user_location.latitude;
    var lon1 = location.longitude;
    var lon2 = user_location.longitude;
    console.log(lat1, lon1, lat2, lon2, unit)
	if ((lat1 == lat2) && (lon1 == lon2)) {
		return 0;
	}
	else {
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		if (unit=="K") { dist = dist * 1.609344 }
        if (unit=="N") { dist = dist * 0.8684 }
        
		return {distance: dist, userId: user_location.userId};
	}
}

upload = async (file) => {
    console.log("in upload", file)
    return new Promise((resove, reject)=> {
        if (typeof file == "undefined") {
            reject('file is undefined')
        }
        else {
            var img_name = file.name;
            if(file.mimetype == "image/jpeg" ||file.mimetype == "image/png"||file.mimetype == "image/gif" ){
                                  
               file.mv('./uploads/'+file.name, function(err) {
                if (err) {
                    reject(err)
                } else {
                    resove(img_name)
                }
               })
            }
        }
    })
}

uploadFiles = async(files, i, finalData) => {
    console.log("in upload files", files)
    return upload(files[i]).then(function(result) {
        if (result) {
             // run the operation again
             i++;
             finalData.push(result)
             return uploadFiles(files,i, finalData);
        } else {
             return result;
        }
    }, function(err) {
        return finalData;
    });
}


exports.approvePost = async (account_id, post_id, done) => {
    try {
        smartCityContract = await utils.getSmartCityContract();
        await smartCityContract.methods.approvePost(post_id, account_id)
        .send({
              from: config.blockChainMainAccount.id,
              gas: '3000000'
          })
        
        done(null, 'post approved successfully');
    } catch(err) {
        console.log(err)
        done(err, null);
    }
}

exports.getPosts = async (done) => {
    try {
        smartCityContract = await utils.getSmartCityContract();
        finalPosts = []
        forever = true;
        i = 0;
        while (forever) {
            try {
                post = await smartCityContract.methods.posts(i).call();
                user = await Users.findOne({
                    where: {
                        blockchainAccountId: post.manager
                    }
                })

                postType = await PostTypes.findOne({
                    where: {
                        points: parseInt(post.value)
                    }
                })
                post['postType'] = postType;
                post['creator'] = user;
                approvers = await smartCityContract.methods.getPostApprovers(i).call();
                approverDetails = [];
                for (let approver of approvers) {
                    user = await Users.findOne({
                        where: {
                            blockchainAccountId: approver
                        }
                    })
                    approverDetails.push(user);
                }
                location = await smartCityContract.methods.locations(i).call();
                post['approvers'] = approverDetails;
                post['location'] = location;
                finalPosts.push(post);
                i++
            } catch(err) {
                console.log(err)
                forever = false;
            }
        }
        done(null, finalPosts);
    } catch (err) {
        done(err, null);
    }
}

exports.getPostForApprovals = async (userid, done) => {
    try {
        smartCityContract = await utils.getSmartCityContract();
        finalPosts = []
        forever = true;
        i = 0;
        while (forever) {
            try {
                approvers = await smartCityContract.methods.getPostApprovers(i).call();
                if (approvers && approvers.length > 0 ) {
                    for (let id of approvers) {
                        if (id === userid) {
                            post = await smartCityContract.methods.posts(i).call();
                            isPostApprovedByApprover = await smartCityContract.methods.isPostApprovedByApprover(post.id, userid).call();
                            console.log("isPostApprovedByApprover",isPostApprovedByApprover)
                            if (isPostApprovedByApprover) {

                            } else {
                                user = await Users.findOne({
                                    where: {
                                        blockchainAccountId: post.manager
                                    }
                                })
                
                                postType = await PostTypes.findOne({
                                    where: {
                                        points: parseInt(post.value)
                                    }
                                })
                                post['postType'] = postType;
                                post['creator'] = user;
    
                                // isApprovedByMe = await smartCityContract.methods.isPostApprovedByApprover(post.id, id).call();
                                // console.log(isApprovedByMe)
                                location = await smartCityContract.methods.locations(i).call();
                                post['approvers'] = approvers;
                                post['location'] = location;
                                //post['isApprovedByMe'] =isApprovedByMe;
                                finalPosts.push(post);
                                break;
                            }
                            
                        }
                    }
                }
                i++
            } catch(err) {
                console.log(err)
                forever = false;
            }
        }
        done(null, finalPosts);
    } catch (err) {
        console.log(err)
        done(err, null);
    }
}

exports.availCoins = async (totalPoints, expectedPoints, coins, account_id, done) => {
    if (totalPoints < expectedPoints) {
        done('not enough total points', null)
    } else {
        tx = await web3.eth.sendTransaction({
            from: config.blockChainMainAccount.id,
            to: account_id,
            value: web3.utils.toWei(coins, 'ether')
        })

        var sql = `update users u set u.coins= u.coins + `+coins+`, u.points = u.points - `+expectedPoints+` where blockchain_account_id = '`+account_id +`'`
        affectedRow = await executeQuery(sql)
        done(null, 'success')
    }
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

getPostData = async (postid) => {
    console.log(postid)
    post = await new web3.eth.Contract(JSON.parse(compiledPost.interface), postid)
    creator = await post.methods.creator().call()
    title = await post.methods.title().call()
    description = await post.methods.description().call()
    approversCount = await post.methods.approversCount().call()
    images = []
    try {
        approvers = await post.methods.getPostApprovers().call()
        imageone = await post.methods.images(0).call()
        console.log(imageone)
        if (imageone) {
            images.push(imageone);
        }
        imagetwo = await post.methods.images(1).call()
        if (imagetwo) {
            images.push(imagetwo)
        }
    }catch(err) {

    }


    return {id: postid,creator: creator, title: title, description: description, approversCount: approversCount, approvers: approvers, images : images}
}

exports.getPostTypes =  async (done) => {
    try {
        var sql = `select title, description, points from post_types`
        result = await executeQueryAll(sql)
        done(null, result);
    } catch (err) {
        done(err, null)
    }

}