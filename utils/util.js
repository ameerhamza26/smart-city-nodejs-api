const crypto = require('crypto')
var mysql = require('promise-mysql');
var config = require('../config');
const base64url = require('base64url')
const nodemailer = require('nodemailer')
const Email = require('email-templates');
const compiledSmartCityContract = require('../ethereum/build/SmartCityContract.json')
const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider(config.blockChainConfig.host))
var transporter

exports.generateRandomBytes = (size) => {
    return new Promise((resolve, reject)=> {
        crypto.randomBytes(size, function(err, buffer) {
            if (err) {
                reject(err)
            } else {
                resolve(base64url(buffer))
            }
        })
    })
}

exports.sendMail = (to, subject, text) => {

    if (transporter == null) {
        transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'smartcityblockchainapp@gmail.com',
              pass: 'smartcity@123'
            }
          });
    }
    
    var mailOptions = {
        from: 'ameerhamza810@gmail.com',
        to: to,
        subject: subject,
        text: text
      };

    return new Promise((resolve, reject)=> {
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              reject(error)
            } else {
              resolve(info.response)
            }
          });
    })
}

exports.getSmartCityContract = async() => {
  var sql = `select factory_address from config where type = 'post'`
  var result = await executeQuery(sql)
  console.log(result);
  if (result === undefined || result === null || result.length == 0) {
      var accounts = await web3.eth.getAccounts()
      
      var factory = await new web3.eth.Contract(JSON.parse(compiledSmartCityContract.interface))
      .deploy({ data: '0x' + compiledSmartCityContract.bytecode })
      .send({ from: accounts[0], gas: '3000000' })
      .catch(err=> {
          return err
      });

      var sql = `insert into config (factory_address, type) values ('`+factory.options.address+`', 'post')`
      return await executeQuery(sql).then((res)=> {
          return factory
      }).catch(err=> {
          return err
      })
  } else {
      factory = await new web3.eth.Contract(JSON.parse(compiledSmartCityContract.interface), result['factory_address'])
      return factory
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

exports.upload = async (file) => {
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

exports.uploadFiles = async(files, i, finalData) => {
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
