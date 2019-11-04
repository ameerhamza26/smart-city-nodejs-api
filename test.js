const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider("http://192.168.56.107:8000"))
const compiledSmartCity = require('./ethereum/build/SmartCityContract.json')

const test = async () => {
    accounts = await web3.eth.getAccounts()

    smartCity = await new web3.eth.Contract(JSON.parse(compiledSmartCity.interface))
    .deploy({ data: '0x' + compiledSmartCity.bytecode })
    .send({ from: accounts[0], gas: '3000000' });

    deployedContract = await new web3.eth.Contract(JSON.parse(compiledSmartCity.interface), '0x4b71b31104FfB07D20edDb3233B36676cEbD3c65')

    console.log(smartCity.options.address)
     try {      
      await deployedContract.methods.createUser('0xD1dEEB30Ee10c6B62e0b14f138D25B9d0c064c14',0).send({
        from: '0xf0B13fA6C28E75257C311f5E53fc393784a54F4B',
        gas: '3000000'
      })

     } catch(err) {
        console.log(err)
     }


     try {
        await deployedContract.methods.createUser('0x5Ee33868Ec2D434C917335a4209564CA64679df6',0).send({
            from: '0xf0B13fA6C28E75257C311f5E53fc393784a54F4B',
            gas: '3000000'
          })
     } catch(err) {
        console.log(err)
     }

     try {
        await deployedContract.methods.createUser('0x89346EBB0fa2D6dC634bB624458EA868df35c00b',0).send({
            from: '0xf0B13fA6C28E75257C311f5E53fc393784a54F4B',
            gas: '3000000'
          })
     } catch(err) {
        console.log(err)
     }


     try {
        await deployedContract.methods.createUser('0xf316776d44c378FDBc33cdB3d4359885f36DB15f',0).send({
            from: '0xf0B13fA6C28E75257C311f5E53fc393784a54F4B',
            gas: '3000000'
          })
    
     } catch(err) {
        console.log(err)
     }

      finalData = [];
      abc = true;
      i = 0;
      while (abc) {
          try {
            users = await deployedContract.methods.users(i).call();
            finalData.push(users);
            i++
          } catch(err) {
            abc = false;
          }
      }

      res = await deployedContract.methods.createPost('abcd', 'path1', 'path2', 'sakhi hassan', '23.243434', '67.2423423', 10, '0xf316776d44c378FDBc33cdB3d4359885f36DB15f', 
      ['0xD1dEEB30Ee10c6B62e0b14f138D25B9d0c064c14', '0x5Ee33868Ec2D434C917335a4209564CA64679df6', '0x89346EBB0fa2D6dC634bB624458EA868df35c00b'], 2)
      .send({
          from: '0xf0B13fA6C28E75257C311f5E53fc393784a54F4B',
          gas: '3000000'
      })

      isExist =  await deployedContract.methods.isUserExist('0x7D236f1d0a6B99214EAb38acA4645c1cEcf0F5C3').call();

      finalPosts = []
      abc = true;
      i = 0;
      while (abc) {
          try {
            post = await deployedContract.methods.posts(i).call();
            approvers = await deployedContract.methods.getPostApprovers(i).call();
            location = await deployedContract.methods.locations(i).call();
            post['approvers'] = approvers;
            post['location'] = location;
            finalPosts.push(post);
            i++
          } catch(err) {
            console.log(err)
            abc = false;
          }
      }

    await deployedContract.methods.approvePost(1, '0xD1dEEB30Ee10c6B62e0b14f138D25B9d0c064c14')
    .send({
          from: '0xf0B13fA6C28E75257C311f5E53fc393784a54F4B',
          gas: '3000000'
      })

    await deployedContract.methods.approvePost(1, '0x5Ee33868Ec2D434C917335a4209564CA64679df6')
    .send({
          from: '0xf0B13fA6C28E75257C311f5E53fc393784a54F4B',
          gas: '3000000'
      })


    finalData = [];
    abc = true;
    i = 0;
    while (abc) {
        try {
          users = await deployedContract.methods.users(i).call();
          finalData.push(users);
          i++
        } catch(err) {
          abc = false;
        }
    }

    await deployedContract.methods.minusPoints('0xD1dEEB30Ee10c6B62e0b14f138D25B9d0c064c14', 1).send({
      from: '0xf0B13fA6C28E75257C311f5E53fc393784a54F4B',
      gas: '3000000'
    })

    points = await deployedContract.methods.getUserPoints('0xD1dEEB30Ee10c6B62e0b14f138D25B9d0c064c14').call();
    console.log(points);

    
    user = await deployedContract.methods.findUserDetailsById('0xf316776d44c378FDBc33cdB3d4359885f36DB15f').call();
    console.log(user);
}

test();