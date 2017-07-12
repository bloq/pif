'use strict';

const moment = require('moment');

// Helper: create and send a transaction, transferring some value
let sendTx = function(sender, receiver, value) {
  web3.eth.sendTransaction({
    from:	sender,
    to:		receiver,
    value:	value
  });
};

// Helper: shorthand for $x ETH
function ether(n) {
  return web3.toWei(n, 'ether');
}

// Helper: Increases testrpc time by the passed duration (a moment.js instance)
function increaseTime(duration) {
  const id = Date.now()

  return new Promise((resolve, reject) => {
    web3.currentProvider.sendAsync({
      jsonrpc: '2.0',
      method: 'evm_increaseTime',
      params: [duration.asSeconds()],
      id: id,
    }, err1 => {
      if (err1) return reject(err1)

      web3.currentProvider.sendAsync({
        jsonrpc: '2.0',
        method: 'evm_mine',
        id: id+1,
      }, (err2, res) => {
        return err2 ? reject(err2) : resolve(res)
      })
    })
  })
}

var PayItForward = artifacts.require("./PayItForward.sol");

contract('PayItForward', function(accounts) {

  let shouldntFail = function(err) {
    assert.isFalse(!!err);
  };

  it("zero initial balances", async function() {
    let contract = await PayItForward.deployed();

    let expected = web3.eth.getBalance(contract.address);
    assert.equal(expected, 0, "contract starting balance must be zero");

    expected = await contract.balanceFrozen();
    assert.equal(expected, 0, "balanceFrozen must be zero");

    expected = await contract.balanceThawed();
    assert.equal(expected, 0, "balanceThawed must be zero");

    expected = await contract.balanceDrawable();
    assert.equal(expected, 0, "balanceDrawable must be zero");
  });

  it("zero balance withdrawal fails", async function() {
    let contract = await PayItForward.deployed();

    let expected = web3.eth.getBalance(contract.address);
    assert.equal(expected, 0, "contract starting balance must be zero");

    expected = false;
    try {
      let rc = await contract.transfer(addresses[0], ether(1));
      expected = true;
    } catch(error) {
      expected = false;
    }
    assert.equal(expected, false, "contract withdraw should fail");
  });

  it('send funds to contract', async function() {
    let contract = await PayItForward.deployed();

    // Give account[0] 20 ether
    sendTx(web3.eth.coinbase, accounts[0], ether(20));

    // Send 3 ether to contract
    sendTx(accounts[0], contract.address, ether(3));

    // Verify contract balance after send
    let expected = ether(3);
    assert.equal(expected, web3.eth.getBalance(contract.address).toNumber());

    // Verify just-sent ether is frozen
    let balance = await contract.balanceFrozen();
    assert.equal(expected, balance);

    // Verify other balances still zero
    expected = await contract.balanceThawed();
    assert.equal(expected, 0, "balanceThawed must be zero");

    expected = await contract.balanceDrawable();
    assert.equal(expected, 0, "balanceDrawable must be zero");

    // Send 1 ether to contract
    sendTx(accounts[0], contract.address, ether(1));

    // Verify contract balance after send
    expected = ether(3 + 1);
    assert.equal(expected, web3.eth.getBalance(contract.address).toNumber());

    // Verify all ether is frozen
    balance = await contract.balanceFrozen();
    assert.equal(expected, balance);

    // Verify other balances still zero
    expected = await contract.balanceThawed();
    assert.equal(expected, 0, "balanceThawed must be zero");

    expected = await contract.balanceDrawable();
    assert.equal(expected, 0, "balanceDrawable must be zero");

  });

  it('verify time lock expires', async function() {
    let contract = await PayItForward.deployed();

    // Verify total contract balance
    let expected = ether(4);
    assert.equal(expected, web3.eth.getBalance(contract.address).toNumber());

    // Increase time to expire-1
    let frozenPeriod = await contract.frozenDefault();
    await increaseTime(moment.duration(frozenPeriod.toNumber() - 60, 'seconds'));

    // Verify total contract balance again
    expected = ether(4);
    assert.equal(expected, web3.eth.getBalance(contract.address).toNumber());

    // Verify sent ether is still frozen
    let balance = await contract.balanceFrozen();
    assert.equal(expected, balance);

    // Verify other balances still zero
    expected = await contract.balanceThawed();
    assert.equal(expected, 0, "balanceThawed must be zero");

    expected = await contract.balanceDrawable();
    assert.equal(expected, 0, "balanceDrawable must be zero");

    // Increase time to expire
    await increaseTime(moment.duration(61, 'second'));

    // Verify no ether is still frozen
    balance = await contract.balanceFrozen();
    expected = 0;
    assert.equal(expected, balance, "balanceFrozen should be zero");

    // Verify ether is thawed
    balance = await contract.balanceThawed();
    expected = ether(4);
    assert.equal(expected, balance, "balanceThawed should not be zero");

    // Verify ether is now drawable
    balance = await contract.balanceDrawable();
    expected = await contract.drawMax();
    assert.equal(expected.toNumber(), balance.toNumber(), "balanceDrawable should not be zero");
  });

  it("drawable withdrawal tests - WIP", async function() {
    let contract = await PayItForward.deployed();

    // Verify total contract balance
    let expected = ether(4);
    assert.equal(expected, web3.eth.getBalance(contract.address).toNumber());

    // Verify drawable balance
    let balance = await contract.balanceDrawable();
    expected = ether(1);
    assert.equal(expected, balance, "contract drawable balance must be one");

    try {
      let rc = await contract.transfer(addresses[0], ether(2));
      expected = true;
    } catch(error) {
      expected = false;
    }
    assert.equal(expected, false, "contract over-withdraw 1 should fail");

    // Verify total contract balance
    expected = ether(4);
    assert.equal(expected, web3.eth.getBalance(contract.address).toNumber());

    // TODO
  });

});
