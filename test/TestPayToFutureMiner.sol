pragma solidity ^0.4.2;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/PayToFutureMiner.sol";

contract TestPayToFutureMiner {

  function testInitialBalanceUsingDeployedContract() {
    PayToFutureMiner meta = PayToFutureMiner(DeployedAddresses.PayToFutureMiner());

    uint expected = 0;

    Assert.equal(meta.balanceFrozen(), expected, "Starting frozen balance should be zero");
    Assert.equal(meta.balanceThawed(), expected, "Starting thawed balance should be zero");
    Assert.equal(meta.balanceDrawable(), expected, "Starting drawable balance should be zero");
  }

  function testInitialBalanceWithNewPayToFutureMiner() {
    PayToFutureMiner meta = new PayToFutureMiner();

    uint expected = 0;

    Assert.equal(meta.balanceFrozen(), expected, "Starting frozen balance should be zero");
    Assert.equal(meta.balanceThawed(), expected, "Starting thawed balance should be zero");
    Assert.equal(meta.balanceDrawable(), expected, "Starting drawable balance should be zero");
  }

}
