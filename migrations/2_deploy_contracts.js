var PayToFutureMiner = artifacts.require("./PayToFutureMiner.sol");

module.exports = function(deployer) {
  deployer.deploy(PayToFutureMiner);
};
