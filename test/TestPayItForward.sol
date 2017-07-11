pragma solidity ^0.4.2;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/PayItForward.sol";

contract TestPayItForward {

  function testInitialBalanceUsingDeployedContract() {
    PayItForward meta = PayItForward(DeployedAddresses.PayItForward());

    uint expected = 0;

    Assert.equal(meta.balance, expected, "Starting contract balance");
    Assert.equal(meta.balanceFrozen(), expected, "Starting frozen balance should be zero");
    Assert.equal(meta.balanceThawed(), expected, "Starting thawed balance should be zero");
    Assert.equal(meta.balanceDrawable(), expected, "Starting drawable balance should be zero");
  }

  function testInitialBalanceWithNewPayItForward() {
    PayItForward meta = new PayItForward();

    uint expected = 0;

    Assert.equal(meta.balance, expected, "Starting contract balance");
    Assert.equal(meta.balanceFrozen(), expected, "Starting frozen balance should be zero");
    Assert.equal(meta.balanceThawed(), expected, "Starting thawed balance should be zero");
    Assert.equal(meta.balanceDrawable(), expected, "Starting drawable balance should be zero");
  }

}
