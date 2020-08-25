const SparkleLoyalty = artifacts.require('./SparkleLoyalty');
const SparkleTimestamp = artifacts.require('./SparkleTimestamp');
const SparkleRewardTiers = artifacts.require('./SparkleRewardTiers');
const assert = require('chai').assert;
const truffleAssert = require('truffle-assertions');
const helper = require("./helpers/truffle-time-helpers");

const onchainSparkleToken = '0x14d8d4e089a4ae60f315be178434c651d11f9b9a';

const BN = web3.utils.BN;

contract('SparkleLoyalty - Workflow @ Tier0(5%)', async accounts => {
  let pol, st, ts, rt;
  let OWNER, USER1, USER2, COLLECTION, TREASURY;

  beforeEach('Configure SparkleToken instance before performing tests', async () => {
    st = new web3.eth.Contract([{ "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "spender", "type": "address" }, { "name": "value", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "_tokenMaxSupply", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "from", "type": "address" }, { "name": "to", "type": "address" }, { "name": "value", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "_tokenDecimals", "outputs": [{ "name": "", "type": "uint8" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint8" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "spender", "type": "address" }, { "name": "addedValue", "type": "uint256" }], "name": "increaseAllowance", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "renounceOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "isOwner", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "_tokenName", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "spender", "type": "address" }, { "name": "subtractedValue", "type": "uint256" }], "name": "decreaseAllowance", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "to", "type": "address" }, { "name": "value", "type": "uint256" }], "name": "transfer", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "owner", "type": "address" }, { "name": "spender", "type": "address" }], "name": "allowance", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "_tokenVersion", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "_tokenSymbol", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "owner", "type": "address" }, { "indexed": true, "name": "spender", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "previousOwner", "type": "address" }, { "indexed": true, "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }], onchainSparkleToken);
  });

  it('Initialize contract(s)', async() =>{
    // Set account literals
    OWNER = accounts[0];
    TREASURY = accounts[1];
    USER1 = accounts[2];
    USER2 = accounts[3];
    COLLECTION = accounts[4];
    // Initialize contracts
    pol = await SparkleLoyalty.deployed({ overwrite: true });
    ts = await SparkleTimestamp.deployed({ overwrite: true });
    await ts.setContractAddress(pol.address, { from: OWNER });
    await ts.setTimePeriod(60*60*24, {from: OWNER});
    rt = await SparkleRewardTiers.deployed({ overwrite: true });
    // await rt.setAddress(pol.address, {from: OWNER});
    // return assert(await ts.getContractAddress({ from: OWNER }) == pol.address && await rt.getContractAddress({ from: OWNER }) == pol.address);
    return assert(await ts.getContractAddress({ from: OWNER }) == pol.address);
  });

  describe('Step1: Approve Tokens', async() => {
    it('Approve 1000 sparkle', async() => {
      await st.methods.approve(pol.address, 1000 * 10e7).send({ from:USER1 });
      return assert.equal(await st.methods.allowance(USER1, pol.address).call(), 1000*10e7);
    });
  });

  describe('Step2: Deposit Tokens', async () => {
    it('Deposit 1000 sparkle', async() => {
      truffleAssert.eventEmitted(await pol.depositLoyalty(1000 * 10e7, { from: USER1 }), 'DepositLoyaltyEvent');
      return;
    });

    it('POL Balance echeck should equal 1000 tokens', async () => {
      return assert.equal(await st.methods.balanceOf(pol.address).call(), 1000 * 10e7);
    });

    it('Allowance re-check should equal 0 tokens', async () => {
      return assert.equal(await st.methods.allowance(USER1, pol.address).call(), 0);
    });
  });

  // describe('Step3: Claim loyalty Day 1', async () => {
  //   it('Day ', async () => {
  //     await helper.advanceTimeAndBlock(86401);
  //     truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
  //   });

  //   // it('Collected reward(s) should equal 0.13690000 tokens', async () => {
  //   //   assert.equal(await pol.getTokensCollected(USER1) / 10e7, 0.1369);
  //   // });
  // });

  describe('Step3: Claim loyalty for 365 days', async () => {
    it('Day 1', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });

    it('Day 2', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });

    it('Day 3', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });

    it('Day 4', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });

    it('Day 5', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });

    it('Day 6', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });

    it('Day 7', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });

    it('Day 8', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });

    it('Day 9', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 10', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 11', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 12', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 13', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 14', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 15', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 16', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 17', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 18', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 19', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 20', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 21', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 22', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 23', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 24', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 25', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 26', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 27', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 28', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 29', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 30', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 31', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 32', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 33', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 34', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 35', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 36', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 37', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 38', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 39', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 40', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 41', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 42', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 43', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 44', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 45', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 46', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 47', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 48', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 49', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 50', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 51', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 52', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 53', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 54', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 55', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 56', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 57', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 58', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 59', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 60', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 61', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 62', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 63', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 64', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 65', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 66', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 67', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 68', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 69', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 70', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 71', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 72', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 73', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 74', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 75', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 76', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 77', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 78', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 79', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 80', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 81', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 82', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 83', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 84', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 85', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 86', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 87', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 88', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 89', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 90', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 91', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 92', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 93', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 94', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 95', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 96', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 97', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 98', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 99', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 100', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 101', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 102', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 103', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 104', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 105', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 106', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 107', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 108', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 109', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 110', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 111', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 112', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 113', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 114', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 115', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 116', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 117', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 118', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 119', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 120', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 121', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 122', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 123', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 124', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 125', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 126', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 127', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 128', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 129', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 130', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 131', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 132', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 133', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 134', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 135', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 136', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 137', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 138', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 139', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 140', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 141', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 142', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 143', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 144', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 145', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 146', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 147', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 148', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 149', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 150', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 151', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 152', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 153', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 154', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 155', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 156', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 157', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 158', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 159', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 160', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 161', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 162', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 163', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 164', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 165', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 166', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 167', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 168', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 169', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 170', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 171', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 172', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 173', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 174', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 175', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 176', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 177', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 178', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 179', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 180', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 181', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 182', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 183', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 184', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 185', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 186', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 187', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 188', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 189', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 190', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 191', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 192', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 193', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 194', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 195', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 196', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 197', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 198', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 199', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 200', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 201', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 202', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 203', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 204', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 205', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 206', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 207', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 208', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 209', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 210', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 211', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 212', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 213', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 214', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 215', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 216', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 217', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 218', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 219', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 220', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 221', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 222', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 223', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 224', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 225', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 226', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 227', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 228', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 229', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 230', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 231', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 232', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 233', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 234', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 235', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 236', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 237', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 238', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 239', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 240', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 241', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 242', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 243', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 244', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 245', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 246', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 247', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 248', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 249', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 250', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 251', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 252', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 253', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 254', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 255', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 256', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 257', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 258', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 259', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 260', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 261', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 262', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 263', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 264', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 265', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 266', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 267', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 268', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 269', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 270', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 271', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 272', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 273', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 274', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 275', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 276', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 277', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 278', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 279', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 280', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 281', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 282', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 283', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 284', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 285', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 286', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 287', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 288', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 289', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 290', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 291', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 292', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 293', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 294', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 295', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 296', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 297', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 298', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 299', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 300', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Day 301', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent'); });
    it('Day 302', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent'); });
    it('Day 303', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent'); });
    it('Day 304', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent'); });
    it('Day 305', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent'); });
    it('Day 306', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent'); });
    it('Day 307', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent'); });
    it('Day 308', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent'); });
    it('Day 309', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent'); });
    it('Day 310', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent'); });
    it('Day 311', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent'); });
    it('Day 312', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent'); });
    it('Day 313', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent'); });
    it('Day 314', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent'); });
    it('Day 315', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent'); });
    it('Day 316', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent'); });
    it('Day 317', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent'); });
    it('Day 318', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent'); });
    it('Day 319', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent'); });
    it('Day 320', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent'); });
    it('Day 321', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent'); });
    it('Day 322', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent'); });
    it('Day 323', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent'); });
    it('Day 324', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent'); });
    it('Day 325', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent'); });
    it('Day 326', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent'); });
    it('Day 327', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent'); });
    it('Day 328', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent'); });
    it('Day 329', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent'); });
    it('Day 330', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent'); });
    it('Day 331', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent'); });
    it('Day 332', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent'); });
    it('Day 333', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent'); });
    it('Day 334', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent'); });
    it('Day 335', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent'); });
    it('Day 336', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent'); });
    it('Day 337', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent'); });
    it('Day 338', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent'); });
    it('Day 339', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent'); });
    it('Day 340', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent'); });
    it('Day 341', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent'); });
    it('Day 342', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent'); });
    it('Day 343', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent'); });
    it('Day 344', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent'); });
    it('Day 345', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent'); });
    it('Day 346', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent'); });
    it('Day 347', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent'); });
    it('Day 348', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent'); });
    it('Day 349', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent'); });
    it('Day 350', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent'); });
    it('Day 351', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent'); });
    it('Day 352', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent'); });
    it('Day 353', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent'); });
    it('Day 354', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent'); });
    it('Day 355', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent'); });
    it('Day 356', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent'); });
    it('Day 357', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent'); });
    it('Day 358', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent'); });
    it('Day 359', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent'); });
    it('Day 360', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent'); });
    it('Day 361', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent'); });
    it('Day 362', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent'); });
    it('Day 363', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent'); });
    it('Day 364', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent'); });
    it('Day 365', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent'); });
  });

  describe('Step4: Withdraw loyalty', async() => {
    it('Approve 10,000 tokens spend from treasury', async() => {
      await st.methods.approve(pol.address, 10000 * 10e7).send({ from: TREASURY });
      assert.equal(await st.methods.allowance(TREASURY, pol.address).call(), 10000 * 10e7);
    });

    it('Current deposit should equal 1000 tokens', async() => {
      assert.equal(await pol.getDepositBalance(USER1) / 10e7, 1000);
    });

    it('Currrent collected rewards should equal 51.2343848 tokens', async () => {
      assert.equal(await pol.getTokensCollected(USER1) / 10e7, 51.2343848);
    });

    it('Total withdraw amount should equal 1051.2343848 tokens', async () => {
      assert.equal(await pol.getTotalBalance(USER1) / 10e7, 1051.2343848);
    });

    let preBalanceTreasury, preBalancePol;
    let postBalanceTreasury, postBalancePol;
    let deposit, collected;
    it('Withdraw loyalty for Accounts[2]', async() => {
      // Obtain the balance of treasury and pol before withdraw
      preBalanceTreasury = await st.methods.balanceOf(TREASURY).call();
      preBalancePol = await st.methods.balanceOf(pol.address).call();
      // Obtain current deposit and collected amounts for checking
      deposit = await pol.getDepositBalance(USER1);// / 10e7;
      collected = await pol.getTokensCollected(USER1);// / 10e7;
      // Perform loyalty withdrawl
      let tx = await pol.withdrawLoyalty({from: USER1});
      // do something
      postBalanceTreasury = await st.methods.balanceOf(TREASURY).call();
      postBalancePol = await st.methods.balanceOf(pol.address).call();
      truffleAssert.eventEmitted(tx, 'LoyaltyWithdrawnEvent');
    });

    it('Post check balances should pass', async() => {
      assert((preBalancePol - postBalancePol) == deposit && (preBalanceTreasury - postBalanceTreasury) == collected);
    });

    it('Loyalty claim attempt should fail', async () => {
      await pol.claimLoyaltyReward({ from: USER1 })
      .then( () => {
        assert.fail();
      })
      .catch((err) => {
        assert.equal(err.reason.localeCompare('No record'), 0);
      });
    });

  });

  describe('Finalize: Return any tokens deposited', async() => {
    it('Return tokens to Accounts[2]', async() => {
      await st.methods.transfer(accounts[1], 51.2343848 * 10e7).send({
        from: accounts[2]
      });
    });
  });

});
