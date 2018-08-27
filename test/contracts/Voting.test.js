const expectEvent = require('../helpers/expectEvent');
const expectThrow = require('../helpers/expectThrow');
const assertRevert = require('../helpers/assertRevert');
const ether = require('../helpers/ether');

const BigNumber = web3.BigNumber;

const Blacklist = artifacts.require('Blacklist');
const Voting = artifacts.require('Voting');

function wait(ms) {
    var start = Date.now(), now = start;
    while (now - start < ms) {
        now = Date.now();
    }
}

contract('Voting', (accounts) => {

    let blacklist
    let voting
    let owner = accounts[0]
    let account = accounts[1]
  
    beforeEach(async () => {
        blacklist = await Blacklist.new()
        voting = await Voting.new(blacklist)
        blacklist.deployed().then(() => console.log('test'))
    })

  })

