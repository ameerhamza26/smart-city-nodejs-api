const Web3 = require('web3')
const assert = require('assert')
const web3 = new Web3(new Web3.providers.HttpProvider("http://192.168.56.107:8000"))
const compiledSmartCity = require('../ethereum/build/SmartCityContract.json')

let smartCity;
beforeEach( async ()=> {
    accounts = await web3.eth.getAccounts();

    smartCity = await new web3.eth.Contract(JSON.parse(compiledSmartCity.interface))
    .deploy({ data: '0x' + compiledSmartCity.bytecode })
    .send({ from: accounts[0], gas: '3000000' });
})

describe('SmartCity', (done) => {
    it('deploys a Smart city contract', ()=> {
        assert.ok(smartCity.options.address)
        done()
    })

    // it('create users', async ()=> {
    //     try {      
    //         await smartCity.methods.createUser('0xD1dEEB30Ee10c6B62e0b14f138D25B9d0c064c14',0).send({
    //           from: '0xf0B13fA6C28E75257C311f5E53fc393784a54F4B',
    //           gas: '3000000'
    //         })
      
    //        } catch(err) {
    //           console.log(err)
    //        }
      
      
    //        try {
    //           await smartCity.methods.createUser('0x5Ee33868Ec2D434C917335a4209564CA64679df6',0).send({
    //               from: '0xf0B13fA6C28E75257C311f5E53fc393784a54F4B',
    //               gas: '3000000'
    //             })
    //        } catch(err) {
    //           console.log(err)
    //        }
      
    //        try {
    //           await smartCity.methods.createUser('0x89346EBB0fa2D6dC634bB624458EA868df35c00b',0).send({
    //               from: '0xf0B13fA6C28E75257C311f5E53fc393784a54F4B',
    //               gas: '3000000'
    //             })
    //        } catch(err) {
    //           console.log(err)
    //        }

    //        try {
    //         await deployedContract.methods.createUser('0xf316776d44c378FDBc33cdB3d4359885f36DB15f',0).send({
    //             from: '0xf0B13fA6C28E75257C311f5E53fc393784a54F4B',
    //             gas: '3000000'
    //           })
        
    //      } catch(err) {
    //         console.log(err)
    //      }
    
    //       finalData = [];
    //       abc = true;
    //       i = 0;
    //       while (abc) {
    //           try {
    //             users = await deployedContract.methods.users(i).call();
    //             finalData.push(users);
    //             i++
    //           } catch(err) {
    //             abc = false;
    //           }
    //       }

    //       assert.equal(finalData.length, 4)
    // })

    // it('allows people to contribute money and mark them approver', async () => {
    //     await campaign.methods.contribute().send({
    //         value: '200',
    //         from: accounts[1] 
    //     });

    //     const isContributer = campaign.methods.approvers(accounts[2]).call();
    //     assert(isContributer);
    // })

    // it('require a minimum contribution', async ()=> {
    //     try {
    //         await campaign.methods.contribute().send({
    //             value: '50',
    //             from: accounts[1]
    //         })
    //         assert(false)
    //     }
    //     catch(err) {
    //         assert(err)
    //     }
    // })

    // it('allows a manager to make a payment request', async () => {
    //     await campaign.methods
    //         .createRequest('Buy batteries', '100', accounts[1])
    //         .send({
    //             gas: '1000000',
    //             from: accounts[0]
    //         })
        
    //     const request = await campaign.methods.requests(0).call();
    //     assert.equal('Buy batteries', request.description)
    // })

    // it('processes requests', async ()=> {
    //     await campaign.methods.contribute().send({
    //         from: accounts[0],
    //         value: web3.utils.toWei('10', 'ether')
    //     })

    //     let initialbalance = await web3.eth.getBalance(accounts[1]);
    //     initialbalance = web3.utils.fromWei(initialbalance, 'ether');
    //     initialbalance = parseFloat(initialbalance);
    //     console.log(initialbalance)

    //     await campaign.methods
    //         .createRequest('A', web3.utils.toWei('5', 'ether'), accounts[1])
    //         .send({
    //             from: accounts[0],
    //             gas: '1000000'
    //         });

    //     await campaign.methods.approveRequest(0).send({
    //         from: accounts[0],
    //         gas: '1000000'
    //     })

    //     await campaign.methods.finalizeRequest(0).send( {
    //         from: accounts[0],
    //         gas: '1000000'
    //     })

    //     let balance = await web3.eth.getBalance(accounts[1]);
    //     balance = web3.utils.fromWei(balance, 'ether');
    //     balance = parseFloat(balance);
    //     console.log(balance)
    //     assert(balance > initialbalance)
    // })
})