pragma solidity ^0.4.2;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/PayToFutureMiner.sol";

contract TestMetacoin {

  function testInitialBalanceUsingDeployedContract() {
    PayToFutureMiner meta = PayToFutureMiner(DeployedAddresses.PayToFutureMiner());

    uint expected = 10000;

    Assert.equal(meta.getBalance(tx.origin), expected, "Owner should have 10000 PayToFutureMiner initially");
  }

  function testInitialBalanceWithNewPayToFutureMiner() {
    PayToFutureMiner meta = new PayToFutureMiner();

    uint expected = 10000;

    Assert.equal(meta.getBalance(tx.origin), expected, "Owner should have 10000 PayToFutureMiner initially");
  }

}
