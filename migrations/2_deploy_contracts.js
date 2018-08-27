var Blacklist = artifacts.require("./Blacklist.sol");
var Voting = artifacts.require("./Voting.sol");

module.exports = function(deployer) {
    /*deployer.deploy(SPToken, '0xc287C713CAA50790a50251bD7FB664E4Ee620937').then(function() {
        //
        /*deployer.deploy(BinaryBetting, SPToken.address).then(function() {
            console.log(BinaryBetting.address)
        })
        BinaryBetting.deployed().then(() => console.log('test' + BinaryBetting.address))*/
        /*
        SPToken.deployed().then(function() {
            console.log(SPToken.address),
            deployer.deploy(BinaryBetting, SPToken.address).then(function() {
                console.log(BinaryBetting.address)
                BinaryBetting.deployed().then(() => console.log('test' + BinaryBetting.address))
            })
        })
    }); 
*/
    deployer.deploy(Blacklist).then(function() {
        console.log(Blacklist.address)
        deployer.deploy(Voting, Blacklist.address).then(function() {
            Voting.deployed().then(() => Blacklist.initialize(Voting.address))
           // Blacklist.initialize(Voting.address);
            console.log(Voting.address)
        })
    });
};
