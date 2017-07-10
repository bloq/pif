var PayToFutureMiner = artifacts.require("./PayToFutureMiner.sol");

contract('PayToFutureMiner', function(accounts) {
  it("should have zero initial balances", function() {
    return PayToFutureMiner.deployed().then(function(instance) {
      return instance.balanceFrozen.call();
    }).then(function(balance) {
      assert.equal(balance.valueOf(), 0, "frozen balance not zero");
    });
  });
});
