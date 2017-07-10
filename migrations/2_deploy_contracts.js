var PayItForward = artifacts.require("./PayItForward.sol");

module.exports = function(deployer) {
  deployer.deploy(PayItForward);
};
