const SparkleLoyalty = artifacts.require('./SparkleLoyalty');
const SparkleLoyaltyTimestamp = artifacts.require('./SparkleLoyaltyTimestamp');
const SparkleLoyaltyRewardTiers = artifacts.require('./SparkleLoyaltyRewardTiers');
const assert = require('chai').assert;
const truffleAssert = require('truffle-assertions');
const helper = require("./helpers/truffle-time-helpers");

const onchainSparkleToken = '0x14d8d4e089a4ae60f315be178434c651d11f9b9a';

const BN = web3.utils.BN;

contract('SparkleLoyalty - Workflow @ Tier1(10%)', async accounts => {
  let pol, st, ts, rt;
  let OWNER, USER1, USER2, COLLECTION, TREASURY;

  beforeEach('Configure SparkleToken instance before performing tests', async () => {
    st = new web3.eth.Contract([{ "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "spender", "type": "address" }, { "name": "value", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "_tokenMaxSupply", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "from", "type": "address" }, { "name": "to", "type": "address" }, { "name": "value", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "_tokenDecimals", "outputs": [{ "name": "", "type": "uint8" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint8" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "spender", "type": "address" }, { "name": "addedValue", "type": "uint256" }], "name": "increaseAllowance", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "renounceOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "isOwner", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "_tokenName", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "spender", "type": "address" }, { "name": "subtractedValue", "type": "uint256" }], "name": "decreaseAllowance", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "to", "type": "address" }, { "name": "value", "type": "uint256" }], "name": "transfer", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "owner", "type": "address" }, { "name": "spender", "type": "address" }], "name": "allowance", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "_tokenVersion", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "_tokenSymbol", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "owner", "type": "address" }, { "indexed": true, "name": "spender", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "previousOwner", "type": "address" }, { "indexed": true, "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }], onchainSparkleToken);
    tier0eth = web3.utils.toWei("0.00", "ether");
    tier1eth = web3.utils.toWei("0.10", "ether");
    tier2eth = web3.utils.toWei("0.20", "ether");
    tier3eth = web3.utils.toWei("0.30", "ether");
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
    ts = await SparkleLoyaltyTimestamp.deployed({ overwrite: true });
    await ts.setContractAddress(pol.address, { from: OWNER });
    await ts.setTimePeriod(60*60*24, {from: OWNER});
    rt = await SparkleLoyaltyRewardTiers.deployed({ overwrite: true });
    await rt.setContractAddress(pol.address, {from: OWNER});
    return assert(await ts.getContractAddress({ from: OWNER }) == pol.address && await rt.getContractAddress({ from: OWNER }) == pol.address);
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

    it('Increase reward tier to Tier1 (10%) (Eth: 0.10) passed', async () => {
      truffleAssert.eventEmitted(await pol.selectRewardTier(1, { from: USER1, value: tier1eth }), 'TierSelectedEvent');
    });
  });

  // describe('Step3: Claim loyalty Day 1', async () => {
  //   it('Loyalty claim @ ~24h should pass', async () => {
  //     await helper.advanceTimeAndBlock(86401);
  //     truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
  //   });

  //   // it('Collected reward(s) should equal 0.13690000 tokens', async () => {
  //   //   assert.equal(await pol.getTokensCollected(USER1) / 10e7, 0.1369);
  //   // });
  // });

  describe('Step3: Claim loyalty for 365 days', async () => {
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });

    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });

    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });

    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });

    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });

    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });

    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });

    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });

    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });

    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({
        from: USER1
      }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({
        from: USER1
      }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({
        from: USER1
      }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({
        from: USER1
      }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({
        from: USER1
      }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({
        from: USER1
      }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({
        from: USER1
      }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({
        from: USER1
      }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({
        from: USER1
      }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({
        from: USER1
      }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({
        from: USER1
      }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({
        from: USER1
      }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({
        from: USER1
      }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({
        from: USER1
      }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({
        from: USER1
      }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({
        from: USER1
      }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({
        from: USER1
      }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({
        from: USER1
      }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({
        from: USER1
      }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({
        from: USER1
      }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({
        from: USER1
      }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({
        from: USER1
      }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({
        from: USER1
      }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({
        from: USER1
      }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({
        from: USER1
      }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({
        from: USER1
      }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({
        from: USER1
      }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({
        from: USER1
      }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({
        from: USER1
      }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({
        from: USER1
      }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({
        from: USER1
      }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({
        from: USER1
      }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({
        from: USER1
      }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({
        from: USER1
      }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({
        from: USER1
      }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({
        from: USER1
      }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({
        from: USER1
      }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({
        from: USER1
      }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({
        from: USER1
      }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({
        from: USER1
      }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({
        from: USER1
      }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({
        from: USER1
      }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({
        from: USER1
      }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({
        from: USER1
      }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({
        from: USER1
      }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({
        from: USER1
      }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({
        from: USER1
      }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({
        from: USER1
      }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({
        from: USER1
      }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({
        from: USER1
      }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({
        from: USER1
      }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({
        from: USER1
      }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({
        from: USER1
      }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({
        from: USER1
      }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({
        from: USER1
      }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({
        from: USER1
      }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({
        from: USER1
      }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({
        from: USER1
      }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({
        from: USER1
      }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({
        from: USER1
      }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({
        from: USER1
      }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({
        from: USER1
      }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({
        from: USER1
      }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({
        from: USER1
      }), 'RewardClaimedEvent');
    });
    it('Loyalty claim @ ~24h should pass', async () => {
      await helper.advanceTimeAndBlock(86401);
      truffleAssert.eventEmitted(await pol.claimLoyaltyReward({ from: USER1 }), 'RewardClaimedEvent');
    });
  });

  describe('Step4: Withdraw loyalty', async() => {
    it('Approve 10,000 tokens spend from treasury', async() => {
      await st.methods.approve(pol.address, 10000 * 10e7).send({ from: TREASURY });
      assert.equal(await st.methods.allowance(TREASURY, pol.address).call(), 10000 * 10e7);
    });

    it('Current deposit should equal 1000 tokens', async() => {
      assert.equal(await pol.getDepositBalance(USER1) / 10e7, 1000);
    });

    it('Currrent collected rewards should equal 105.08251884 tokens', async () => {
      assert.equal(await pol.getTokensCollected(USER1) / 10e7, 105.08251884);
    });

    it('Total withdraw amount should equal 1105.08251884 tokens', async () => {
      assert.equal(await pol.getTotalBalance(USER1) / 10e7, 1105.08251884);
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
      await st.methods.transfer(accounts[1], 105.08251884 * 10e7).send({
        from: accounts[2]
      });
    });
  });

});
