var mysql = require('promise-mysql');
var config = require('../config');
const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider("http://192.168.56.107:8000"))
const compiledFactory = require('../ethereum/build/CampaignFactory.json')
const compiledCampaign = require('../ethereum/build/Campaign.json')
var db = require('../db/db')

exports.create = async (minimumContribution, account_id) => {
    // factory = await this.getFactory()

    // gasprice = await web3.eth.getGasPrice()
    // console.log(gasprice)

    // balance = await web3.eth.getBalance(account_id);
    // console.log(balance)

    // balance = await web3.eth.getBalance('0xf0b13fa6c28e75257c311f5e53fc393784a54f4b');
    // console.log(balance)

    // // await web3.eth.sendTransaction({
    // //     from: '0xf0b13fa6c28e75257c311f5e53fc393784a54f4b',
    // //     to: account_id,
    // //     value: 100000,
    // // } , (err, res) => {
    // //     if (err) {
    // //         console.log(err)
    // //     }

    // //     console.log(res)
    // // })

    // res = await factory.methods.createCampaign(minimumContribution).send({
    //     from: account_id,
    //     gas: '1000000',
    //   }).catch(err=>{
    //     console.log(err)
    //   });

    //   console.log(res);
      
    //     // var abcCampaign = await new web3.eth.Contract(JSON.parse(compiledCampaign.interface), '0xE10C3dE2Ce6b07993d8D6E430F4184225207f3FB')
    //     // // .deploy({ data: '0x' + compiledCampaign.bytecode, arguments: [minimumContribution, account_id] })
    //     // // .send({ from: '0xf0b13fa6c28e75257c311f5e53fc393784a54f4b', gas: '1000000' });

    //     // console.log(abcCampaign.options.address)

    //   campaigns = await factory.methods.getCurrentCampaign().call();
    //   console.log(campaigns)

    //   console.log(res)
}

exports.getFactory = async () => {
    // var result = await new db.buildQuery().select('factory_address')
    // .from('config').one();

    // console.log(result)
    // if (result === undefined) {
    //     var accounts = await web3.eth.getAccounts()
        
    //     var factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    //     .deploy({ data: '0x' + compiledFactory.bytecode })
    //     .send({ from: accounts[0], gas: '1000000' });

    //     console.log(factory.options.address)
    //     var sql = `insert into config (factory_address) values ('`+factory.options.address+`')`
    //     return await executeQuery(sql).then((res)=> {
    //         return factory
    //     }).catch(err=> {
    //         return err
    //     })
    // } else {
    //     factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface), result['factory_address'])
    //     return factory
    // }
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