'use strict';

let sendTx = function(sender, receiver, value) {
  web3.eth.sendTransaction({
    from:	sender,
    to:		receiver,
    value:	value
  });
};

var PayToFutureMiner = artifacts.require("./PayToFutureMiner.sol");

contract('PayToFutureMiner', function(accounts) {

  let shouldntFail = function(err) {
    assert.isFalse(!!err);
  };

  it("zero initial balances", async function() {
    let contract = await PayToFutureMiner.deployed();

    let expected = await contract.balanceFrozen();
    assert.equal(expected, 0, "balanceFrozen must be zero");

    expected = await contract.balanceThawed();
    assert.equal(expected, 0, "balanceThawed must be zero");

    expected = await contract.balanceDrawable();
    assert.equal(expected, 0, "balanceDrawable must be zero");
  });

  it('send funds to contract', async function() {
    let contract = await PayToFutureMiner.deployed();

    // Give account[0] 20 ether
    sendTx(web3.eth.coinbase, accounts[0], web3.toWei('20','ether'));

    // Send 3 ether to contract
    sendTx(accounts[0], contract.address, web3.toWei('3','ether'));

    // Verify contract balance after send
    let expected = web3.toWei('3','ether');
    assert.equal(expected, web3.eth.getBalance(contract.address).toNumber());

    // Verify just-sent ether is frozen
    let balance = await contract.balanceFrozen();
    assert.equal(expected, balance);

    // Verify other balances still zero
    expected = await contract.balanceThawed();
    assert.equal(expected, 0, "balanceThawed must be zero");

    expected = await contract.balanceDrawable();
    assert.equal(expected, 0, "balanceDrawable must be zero");
  });

});
