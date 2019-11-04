const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider("http://192.168.56.107:8000"))
const compiledSmartCityContract = require('../ethereum/build/SmartCityContract.json')
const Location = require('../models/location').Location;
const Users = require('../models/users').User;

exports.create = async (post, location, activity, files, done) => {
    i = 0;
    finalData =[];
    factory = await this.getPostFactory()
    
    Location.findAll().then((locations)=> {
        console.log("in location")
        uploadFiles(files, i, finalData).then(async (files)=> {
            console.log("in uploadFiles")
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

            Users.findAll({
                where: {
                    id: userIds
                }
            }).then(async (users)=> {
                console.log("in users find all")
                factory.events.ContractCreated({
                    fromBlock: 0, toBlock: 'latest'
                }, function(error, event){ console.log("e1",event); })
                .on('data', function(event){
                    console.log("e2",event); // same results as the optional callback above
                })
                .on('changed', function(event){
                    console.log("e3",event); 
                    // remove event from local database
                })


                await factory.methods.createPost(post.title, post.description, location.address, 
                    toString(location.latitude), toString(location.longitude)).send({
                    from: post.account_id,
                    gas: '2000000',
                }).catch(err=>{
                    console.log(err)
                    done(err, null)
                });

                allposts = await factory.methods.getDeployedPost().call()
                
                console.log(allposts.length)
                newpost = await new web3.eth.Contract(JSON.parse(compiledPost.interface), allposts[allposts.length-1])

                await newpost.methods.addImage(files[0]).send({
                    from: post.account_id,
                    gas: '1000000'
                })

                await newpost.methods.addImage(files[1]).send({
                    from: post.account_id,
                    gas: '1000000'
                })

                if (users[0]) {
                    await newpost.methods.addApprover(users[0].blockchainAccountId).send({
                        from: post.account_id,
                        gas: '1000000'
                    })
                }

                done(null, {files: files, locations: locations, distances: distances, minimumDistance: distances, userIds: userIds, users: users, post: newpost})
            }, (err)=> {
                done(err, null)
            })

            
        }, err=>{
            done(err, null)
        })
    })

} 
