/// Obtain artifacts for Loyalty, Timestamp and RewardTiers contacts
const SparkleLoyalty = artifacts.require('./SparkleLoyalty');
const SparkleTimestamp = artifacts.require('./SparkleTimestamp');
/// Include assertion libraries to support tests
const assert = require('chai').assert;
const truffleAssert = require('truffle-assertions');
const helper = require("./helpers/truffle-time-helpers");
/// Set SparkleToken onchain address
const onchainSparkleToken = '0x14d8d4e089a4ae60f315be178434c651d11f9b9a';
/// Declare instance of BN object
const BN = web3.utils.BN;

/**
 * @title Sparkle timestamp tests
 * @author SparkleLoyalty Inc. (c) 2019-2020
 */
contract('SparkleLoyalty - Test coverage: Tier1(10%) Workflow', async accounts => {
  /// Declare contract variables
  let st, pol, tsi;
  /// Declare eth value variables
  let tier2eth, tier3eth;
  /// Declare constants for required addresses
  let OWNER, USER1, TREASURY;

  /**
   * @dev Initialize contracts used throughout this set of tests
   */
  it('Initialize contract(s)', async() =>{
    // Set account literals
    OWNER = accounts[0];
    TREASURY = accounts[1];
    USER1 = accounts[2];
    USER2 = accounts[3];
    COLLECTION = accounts[4];
    // Initialize contracts
    st = new web3.eth.Contract([{ "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "spender", "type": "address" }, { "name": "value", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "_tokenMaxSupply", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "from", "type": "address" }, { "name": "to", "type": "address" }, { "name": "value", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "_tokenDecimals", "outputs": [{ "name": "", "type": "uint8" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint8" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "spender", "type": "address" }, { "name": "addedValue", "type": "uint256" }], "name": "increaseAllowance", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [], "name": "renounceOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "isOwner", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "_tokenName", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "spender", "type": "address" }, { "name": "subtractedValue", "type": "uint256" }], "name": "decreaseAllowance", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "to", "type": "address" }, { "name": "value", "type": "uint256" }], "name": "transfer", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "owner", "type": "address" }, { "name": "spender", "type": "address" }], "name": "allowance", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "_tokenVersion", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "_tokenSymbol", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "owner", "type": "address" }, { "indexed": true, "name": "spender", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "previousOwner", "type": "address" }, { "indexed": true, "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }], onchainSparkleToken);
    pol = await SparkleLoyalty.deployed({ overwrite: true });
    tsi = await SparkleTimestamp.deployed({ overwrite: true });
    await tsi.setContractAddress(pol.address, {from: OWNER});
    await tsi.setTimePeriod(60*60*24, {from: OWNER});
    /// Declare eth amount variables
    tier0eth = web3.utils.toWei("0.00", "ether");
    tier05eth = web3.utils.toWei("0.05", "ether");
    tier1eth = web3.utils.toWei("0.10", "ether");
    tier2eth = web3.utils.toWei("0.20", "ether");
    tier3eth = web3.utils.toWei("0.30", "ether");
    /// Return success if controller address sucessfully configured
    return assert(await tsi.getContractAddress({ from: OWNER }) == pol.address);
  });

  /**
   * @dev Test user token approval functionality
   */
  describe('Step1: Approve 1,000 tokens to SparkleLoyalty by USER1', async () => {

    /**
     * @dev Test generic ERC20 approve operation
     */
    it('SparkleToken.approve(pol.address, 1000 * 10e7) should pass', async () => {
      /// Attempt to approve 1000 tokens
      await st.methods.approve(pol.address, 1000 * 10e7).send({
        from: USER1
      });
      /// Return success if expected values are returned
      return assert.equal(await st.methods.allowance(USER1, pol.address).call(), 1000 * 10e7);
    });

  });

  /**
   * @dev Test user token deposit/SparkleLoyalty join operation(s)
   */
  describe('Step2: Deposit Tokens', async () => {

    /**
     * @dev Test SparkleLoyalty deposit operation
     */
    it('depositLoyalty(1000 * 10e7, { from:USER1 }) should pass', async () => {
      /// Return success if expected values are returned
      return truffleAssert.eventEmitted(await pol.depositLoyalty(1000 * 10e7, {
        from: USER1
      }), 'DepositLoyaltyEvent');
    });

    /**
     * @dev Test that previous deposit operation was successfull
     */
    it('SparkleToken.balanceOf(pol.address)POL Balance echeck should equal 1000 tokens', async () => {
      /// Return success if expected values are returned
      return assert.equal(await st.methods.balanceOf(pol.address).call(), 1000 * 10e7);
    });

    /**
     * @dev Test additionally that alloance has been consumed
     */
    it('Allowance re-check should equal 0 tokens', async () => {
      /// Return success if expected values are returned
      return assert.equal(await st.methods.allowance(USER1, pol.address).call(), 0);
    });

    /**
     * @dev Test purchase of tier1 reward boost(10%)
     * @notice Sent: 0.00 eth Expected: 0.05 eth
     */
    it('selectRewardTier(1, { from: USER1, value: tier05eth }) should fail', async () => {
      /// Attempt to select a new reward tier
      await pol.selectRewardTier(1, {
          from: USER1,
          value: tier05eth
        })
        .then((tx) => {
          /// Should not get here, return failure
          return assert(false);
        })
        .catch((error) => {
          let err = new String(error);
          /// Return success if experect error returned
          return assert(err.includes('Rate unchanged'));
        });
    });

    /**
     * @dev Test purchase of tier1 reward boost(10%)
     * @notice Sent: 0.10 eth Expected: 0.10 eth
     */
    it('selectRewardTier(1, { from: USER1, value: tier1eth }) should pass', async () => {
      /// Attempt to select tier2 reward boost(20%)
      await pol.selectRewardTier(1, {
          from: USER1,
          value: tier1eth
        })
        .then((tx) => {
          truffleAssert.eventEmitted(tx, 'TierSelectedEvent', (event) => {
            /// Return success if expected values returned
            return (event[1].eq(new BN(1)));
          })
        })
        .catch((error) => {
          /// Should not get here, return failure
          return assert(false);
        });
    });

    /**
     * @dev Test purchase of tier0 reward boost(0%)
     */
    it('selectRewardTier(0, { from: USER1, value: tier05eth }) should fail', async () => {
      await pol.selectRewardTier(0, {
          from: USER1,
          value: tier05eth
        })
        .then((tx) => {
          /// Should not get here, return failure
          return assert(false);
        })
        .catch((error) => {
          let err = new String(error);
          /// Return success if expected error value returned
          return assert(err.includes('Invalid tier'));
        });
    });

  });

  /**
   * @dev Test claim reward for Day 1
   */
  describe('Step3: Claim loyalty Day 1', async () => {

    /**
     * @dev Test claim reward token for USER1 @6h~
     */
    it('Loyalty claim @ ~6h should fail', async () => {
      /// Advance blockchain by ~6h
      await helper.advanceTimeAndBlock(21600);
      /// Attempt to claim loyalty rewards for USER1
      await pol.claimLoyaltyReward({
          from: USER1
        })
        .then((response) => {
          /// Should not get here, return failure
          return assert(false);
        })
        .catch((error) => {
          let err = new String(error);
          /// Return success if expected error values returned
          return assert(err.includes('Not mature'));
        });
    });

    /**
     * @dev Test claim reward token for USER1 @12~
     */
    it('Loyalty claim @ ~12h should fail', async () => {
      /// Advance blockchain by ~6h
      await helper.advanceTimeAndBlock(21600);
      /// Attempt to claim loyalty rewards for USER1
      await pol.claimLoyaltyReward({
          from: USER1
        })
        .then((response) => {
          /// Should not get here, return failure
          return assert(false);
        })
        .catch((error) => {
          let err = new String(error);
          /// Return success if expected error values returned
          return assert(err.includes('Not mature'));
        });
    });

    /**
     * @dev Test claim reward token for USER1 @18h~
     */
    it('Loyalty claim @ ~18h should fail', async () => {
      /// Advance blockchain by ~6h
      await helper.advanceTimeAndBlock(21600);
      /// Attempt to claim loyalty rewards for USER1
      await pol.claimLoyaltyReward({
          from: USER1
        })
        .then((response) => {
          /// Should not get here, return failure
          return assert(false);
        })
        .catch((error) => {
          let err = new String(error);
          /// Return success if expected error values returned
          return assert(err.includes('Not mature'));
        });
    });

    /**
     * @dev Test claim reward token for USER1 @24h~
     */
    it('Loyalty claim @ ~24h should pass', async () => {
      /// Advance blockchain by ~6h
      await helper.advanceTimeAndBlock(21601);
      /// Return success if expected event was emitted from transaction
      return truffleAssert.eventEmitted(await pol.claimLoyaltyReward({
        from: USER1
      }), 'RewardClaimedEvent');

    });

    /**
     * @dev Test amount of tokens collected for Day 1
     */
    it('Collected reward(s) should equal 0.15059 tokens', async () => {
      /// Return success if expected values are returned
      assert.equal(await pol.getTokensCollected(USER1) / 10e7, 0.15059);
    });
  });

  /**
   * @dev Test claim reward for Day 2
   */
  describe('Step3: Claim loyalty Day 2', async () => {

    /**
     * @dev Test claim reward token for USER1 @6h~
     */
    it('Loyalty claim @ ~6h should fail', async () => {
      /// Advance blockchain by ~6h
      await helper.advanceTimeAndBlock(21600);
      /// Attempt to claim loyalty rewards for USER1
      await pol.claimLoyaltyReward({
          from: USER1
        })
        .then((response) => {
          /// Should not get here, return failure
          return assert(false);
        })
        .catch((error) => {
          let err = new String(error);
          /// Return success if expected error values returned
          return assert(err.includes('Not mature'));
        });
    });

    /**
     * @dev Test claim reward token for USER1 @12~
     */
    it('Loyalty claim @ ~12h should fail', async () => {
      /// Advance blockchain by ~6h
      await helper.advanceTimeAndBlock(21600);
      /// Attempt to claim loyalty rewards for USER1
      await pol.claimLoyaltyReward({
          from: USER1
        })
        .then((response) => {
          /// Should not get here, return failure
          return assert(false);
        })
        .catch((error) => {
          let err = new String(error);
          /// Return success if expected error values returned
          return assert(err.includes('Not mature'));
        });
    });

    /**
     * @dev Test claim reward token for USER1 @18h~
     */
    it('Loyalty claim @ ~18h should fail', async () => {
      /// Advance blockchain by ~6h
      await helper.advanceTimeAndBlock(21600);
      /// Attempt to claim loyalty rewards for USER1
      await pol.claimLoyaltyReward({
          from: USER1
        })
        .then((response) => {
          /// Should not get here, return failure
          return assert(false);
        })
        .catch((error) => {
          let err = new String(error);
          /// Return success if expected error values returned
          return assert(err.includes('Not mature'));
        });
    });

    /**
     * @dev Test claim reward token for USER1 @24h~
     */
    it('Loyalty claim @ ~24h should pass', async () => {
      /// Advance blockchain by ~6h
      await helper.advanceTimeAndBlock(21601);
      /// Return success if expected event was emitted from transaction
      return truffleAssert.eventEmitted(await pol.claimLoyaltyReward({
        from: USER1
      }), 'RewardClaimedEvent');

    });

    /**
     * @dev Test amount of tokens collected for Day 2
     */
    it('Collected reward(s) should equal 0.30120267 tokens', async () => {
      /// Return success if expected values are returned
      assert.equal(await pol.getTokensCollected(USER1) / 10e7, 0.30120267);
    });
  })

  /**
   * @dev Test claim reward for Day 3
   */
  describe('Step3: Claim loyalty Day 3', async () => {

    /**
     * @dev Test claim reward token for USER1 @6h~
     */
    it('Loyalty claim @ ~6h should fail', async () => {
      /// Advance blockchain by ~6h
      await helper.advanceTimeAndBlock(21600);
      /// Attempt to claim loyalty rewards for USER1
      await pol.claimLoyaltyReward({
          from: USER1
        })
        .then((response) => {
          /// Should not get here, return failure
          return assert(false);
        })
        .catch((error) => {
          let err = new String(error);
          /// Return success if expected error values returned
          return assert(err.includes('Not mature'));
        });
    });

    /**
     * @dev Test claim reward token for USER1 @12~
     */
    it('Loyalty claim @ ~12h should fail', async () => {
      /// Advance blockchain by ~6h
      await helper.advanceTimeAndBlock(21600);
      /// Attempt to claim loyalty rewards for USER1
      await pol.claimLoyaltyReward({
          from: USER1
        })
        .then((response) => {
          /// Should not get here, return failure
          return assert(false);
        })
        .catch((error) => {
          let err = new String(error);
          /// Return success if expected error values returned
          return assert(err.includes('Not mature'));
        });
    });

    /**
     * @dev Test claim reward token for USER1 @18h~
     */
    it('Loyalty claim @ ~18h should fail', async () => {
      /// Advance blockchain by ~6h
      await helper.advanceTimeAndBlock(21600);
      /// Attempt to claim loyalty rewards for USER1
      await pol.claimLoyaltyReward({
          from: USER1
        })
        .then((response) => {
          /// Should not get here, return failure
          return assert(false);
        })
        .catch((error) => {
          let err = new String(error);
          /// Return success if expected error values returned
          return assert(err.includes('Not mature'));
        });
    });

    /**
     * @dev Test claim reward token for USER1 @24h~
     */
    it('Loyalty claim @ ~24h should pass', async () => {
      /// Advance blockchain by ~6h
      await helper.advanceTimeAndBlock(21601);
      /// Return success if expected event was emitted from transaction
      return truffleAssert.eventEmitted(await pol.claimLoyaltyReward({
        from: USER1
      }), 'RewardClaimedEvent');

    });

    /**
     * @dev Test amount of tokens collected for Day 3
     */
    it('Collected reward(s) should equal 0.45183802 tokens', async () => {
      /// Return success if expected values are returned
      assert.equal(await pol.getTokensCollected(USER1) / 10e7, 0.45183802);
    });
  })

  /**
   * @dev Test claim reward for Day 4
   */
  describe('Step3: Claim loyalty Day 4', async () => {

    /**
     * @dev Test claim reward token for USER1 @6h~
     */
    it('Loyalty claim @ ~6h should fail', async () => {
      /// Advance blockchain by ~6h
      await helper.advanceTimeAndBlock(21600);
      /// Attempt to claim loyalty rewards for USER1
      await pol.claimLoyaltyReward({
          from: USER1
        })
        .then((response) => {
          /// Should not get here, return failure
          return assert(false);
        })
        .catch((error) => {
          let err = new String(error);
          /// Return success if expected error values returned
          return assert(err.includes('Not mature'));
        });
    });

    /**
     * @dev Test claim reward token for USER1 @12~
     */
    it('Loyalty claim @ ~12h should fail', async () => {
      /// Advance blockchain by ~6h
      await helper.advanceTimeAndBlock(21600);
      /// Attempt to claim loyalty rewards for USER1
      await pol.claimLoyaltyReward({
          from: USER1
        })
        .catch((err) => {
          assert.equal(err.reason, 'Not mature');
        });
    });

    /**
     * @dev Test time remaining consistant with current position in reward cycle
     */
    it('getTimeRemaining(USER1) should be >= 43150', async () => {
      /// Attermp to obtain the current time remaining until reward maturity
      await pol.getTimeRemaining(USER1)
        .then((response) => {
          /// Return success if expected value returned
          return assert(response[0] >= 43150);
        })
        .catch((error) => {
          /// Should not make it here, return failure
          return assert(false);
        });
    });

    /**
     * @dev Test claim reward token for USER1 @18h~
     */
    it('Loyalty claim @ ~18h should fail', async () => {
      /// Advance blockchain by ~6h
      await helper.advanceTimeAndBlock(21600);
      /// Attempt to claim loyalty rewards for USER1
      await pol.claimLoyaltyReward({
          from: USER1
        })
        .then((response) => {
          /// Should not get here, return failure
          return assert(false);
        })
        .catch((error) => {
          let err = new String(error);
          /// Return success if expected error values returned
          return assert(err.includes('Not mature'));
        });
    });

    /**
     * @dev Test claim reward token for USER1 @24h~
     */
    it('Loyalty claim @ ~24h should pass', async () => {
      /// Advance blockchain by ~6h
      await helper.advanceTimeAndBlock(21601);
      /// Return success if expected event was emitted from transaction
      return truffleAssert.eventEmitted(await pol.claimLoyaltyReward({
        from: USER1
      }), 'RewardClaimedEvent');
    });

    /**
     * @dev Test amount of tokens collected for Day 4
     */
    it('Collected reward(s) should equal 0.60249606 tokens', async () => {
      /// Return success if expected values are returned
      assert.equal(await pol.getTokensCollected(USER1) / 10e7, 0.60249606);
    });
  })

  /**
   * @dev Test claim reward for Day 5
   */
  describe('Step3: Claim loyalty Day 5', async () => {

    /**
     * @dev Test claim reward token for USER1 @6h~
     */
    it('Loyalty claim @ ~6h should fail', async () => {
      /// Advance blockchain by ~6h
      await helper.advanceTimeAndBlock(21600);
      /// Attempt to claim loyalty rewards for USER1
      await pol.claimLoyaltyReward({
          from: USER1
        })
        .then((response) => {
          /// Should not get here, return failure
          return assert(false);
        })
        .catch((error) => {
          let err = new String(error);
          /// Return success if expected error values returned
          return assert(err.includes('Not mature'));
        });
    });

    /**
     * @dev Test claim reward token for USER1 @12~
     */
    it('Loyalty claim @ ~12h should fail', async () => {
      /// Advance blockchain by ~6h
      await helper.advanceTimeAndBlock(21600);
      /// Attempt to claim loyalty rewards for USER1
      await pol.claimLoyaltyReward({
          from: USER1
        })
        .then((response) => {
          /// Should not get here, return failure
          return assert(false);
        })
        .catch((error) => {
          let err = new String(error);
          /// Return success if expected error values returned
          return assert(err.includes('Not mature'));
        });
    });

    /**
     * @dev Test claim reward token for USER1 @18h~
     */
    it('Loyalty claim @ ~18h should fail', async () => {
      /// Advance blockchain by ~6h
      await helper.advanceTimeAndBlock(21600);
      /// Attempt to claim loyalty rewards for USER1
      await pol.claimLoyaltyReward({
          from: USER1
        })
        .then((response) => {
          /// Should not get here, return failure
          return assert(false);
        })
        .catch((error) => {
          let err = new String(error);
          /// Return success if expected error values returned
          return assert(err.includes('Not mature'));
        });
    });

    /**
     * @dev Test claim reward token for USER1 @24h~
     */
    it('Loyalty claim @ ~24h should pass', async () => {
      /// Advance blockchain by ~6h
      await helper.advanceTimeAndBlock(21601);
      /// Return success if expected event was emitted from transaction
      return truffleAssert.eventEmitted(await pol.claimLoyaltyReward({
        from: USER1
      }), 'RewardClaimedEvent');
    });

    /**
     * @dev Test amount of tokens collected for Day 5
     */
    it('Collected reward(s) should equal 0.75317678 tokens', async () => {
      /// Return success if expected values are returned
      assert.equal(await pol.getTokensCollected(USER1) / 10e7, 0.75317678);
    });
  })

  /**
   * @dev Test claim reward for Day 365 skipping Days 6 thru 364
   */
  describe('Step3: Claim loyalty Day 365 (Days 6-364 skipped)', async () => {

    /**
     * @dev Test claim reward token for USER1 @360d~
     */
    it('Claim loyalty attempt @ day ~365 should pass', async () => {
      /// Advance blockchain by ~360d
      await helper.advanceTimeAndBlock(31104000);
      /// Return success if expected event was emitted from transaction
      return truffleAssert.eventEmitted(await pol.claimLoyaltyReward({
        from: USER1
      }), 'RewardClaimedEvent');
    });

    /**
     * @dev Test amount of tokens collected for Day 365
     */
    it('Collected reward(s) should equal 55.0064083 tokens', async () => {
      /// Return success if expected values are returned
      assert.equal(await pol.getTokensCollected(USER1) / 10e7, 55.0064083);
    });

    /**
     * @dev Test times reward was claimed by user
     */
    it('Total times claimed for user should equal 6', async () => {
      /// Return success if expected values are returned
      assert.equal(await pol.getTimesClaimed(USER1), 6);
    });

  })

  /**
   * @dev Test withdraw from SparkleLoyalty program
   */
  describe('Step4: Withdraw loyalty', async () => {

    /**
     * @dev Test ERC20 approval of 10,000 tokens from treasury address
     */
    it('Approve 10,000 tokens to SparkleLoyalty by TREASURY', async () => {
      /// Attempt to approve 10,000 tokens
      await st.methods.approve(pol.address, 10000 * 10e7).send({
        from: TREASURY
      });
      /// Return success if expected values are returned
      assert.equal(await st.methods.allowance(TREASURY, pol.address).call(), 10000 * 10e7);
    });

    /**
     * @dev Test correct deposit balance for USER1
     */
    it('Current deposit should equal 1000 tokens', async () => {
      /// Return success if expected values are returned
      assert.equal(await pol.getDepositBalance(USER1) / 10e7, 1000);
    });

    /**
     * @dev Test currently collected loyalty rewards for USER1
     */
    it('Currrent collected rewards should equal 55.0064083 tokens', async () => {
      /// Return success if expected values are returned
      assert.equal(await pol.getTokensCollected(USER1) / 10e7, 55.0064083);
    });

    /**
     * @dev Test correct amount of reward tokens to be withdrawn
     */
    it('Total withdraw amount should equal 1055.0064083 tokens', async () => {
      /// Return success if expected values are returned
      assert.equal(await pol.getTotalBalance(USER1) / 10e7, 1055.0064083);
    });

    /**
     * @dev Test loyalty record address validation for USER1
     */
    it('getLoyaltyAddress(USER1) should equal USER1', async () => {
      /// Attempt to obtain USER1's loyalty address
      await pol.getLoyaltyAddress(USER1)
        .then((response) => {
          /// Return success is expected value returned
          return assert.equal(response, USER1);
        })
        .catch((error) => {
          /// Should never get here, return failure
          return assert(false);
        })
    });

    /**
     * @dev Test loyalty record tier validation for USER1
     */
    it('getRewardTier(USER1) should equal Tier1', async () => {
      /// Attempt to obtain USER1's tier reward index
      await pol.getRewardTier(USER1)
        .then((response) => {
          /// Return success is expected value returned
          return assert.equal(response, 1);
        })
        .catch((error) => {
          /// Should never get here, return failure
          return assert(false);
        })
    });

    /**
     * @dev Test loyalty record locked status for USER1
     */
    it('isLocked(USER1) should return false', async () => {
      /// Attempt to determine if USER1's account has been locked
      await pol.isLocked(USER1)
        .then((response) => {
          /// Return success is expected value returned
          assert.equal(response, false);
        })
        .catch((error) => {
          /// Should never get here, return failure
          return assert(false);
        });
    });

    /**
     * @dev Test loyalty record locking for USER1
     */
    it('lockAccount(USER1, true, { from: OWNER }) should pass', async () => {
      /// Attempt to lock USER1's account
      await pol.lockAccount(USER1, true, {
          from: OWNER
        })
        .then((response) => {
          truffleAssert.eventEmitted(response, 'LockedAccountEvent', (event) => {
            /// Return success is expected value returned
            return (event[0] == USER1 && event[1] == true);
          });
        })
        .catch((error) => {
          /// Should never get here, return failure
          return assert(false);
        });
    });

    /**
     * @dev Test loyalty record locked status for USER1
     */
    it('isLocked(USER1) should return true', async () => {
      /// Attempt to determine if USER1's account has been locked
      await pol.isLocked(USER1)
        .then((response) => {
          /// Return success is expected value returned
          return assert.equal(response, true);
        })
        .catch((error) => {
          /// Should never get here, return failure
          return assert(false);
        });
    });

    /// Declare scratch variables
    let preBalanceTreasury, preBalancePol;
    let postBalanceTreasury, postBalancePol;
    let deposit, collected;

    /**
     * @dev Test loyalty withdraw from locked USER1 account
     */
    it('Withdraw loyalty for USER1 should failed (locked)', async () => {
      /// Obtain the balance of treasury and pol before withdraw
      preBalanceTreasury = await st.methods.balanceOf(TREASURY).call();
      preBalancePol = await st.methods.balanceOf(pol.address).call();
      /// Obtain current deposit and collected amounts for checking
      deposit = await pol.getDepositBalance(USER1);
      collected = await pol.getTokensCollected(USER1);
      /// Attempt to perform loyalty withdrawl for USER1
      await pol.withdrawLoyalty({
          from: USER1
        })
        .then(async (tx) => {
          /// Attempt to obtain balances of treasury and SparkleLoyalty addresses
          postBalanceTreasury = await st.methods.balanceOf(TREASURY).call();
          postBalancePol = await st.methods.balanceOf(pol.address).call();
          truffleAssert.eventEmitted(tx, 'LoyaltyWithdrawnEvent', (event) => {
            /// Return success is expected value returned
            return (event[0] == USER1 && event[2].eq(deposit.add(collected)));
          });
        })
        .catch((error) => {
          let err = new String(error);
          /// Return success if expected event was emitted from transaction
          return assert(err.includes('Locked'));
        });
    });

    /**
     * @dev Test loyalty record unlocking for USER1
     */
    it('lockAccount(USER1, false, { from: OWNER }) should pass', async () => {
      /// Attempt to unlock USER1's account
      await pol.lockAccount(USER1, false, {
          from: OWNER
        })
        .then((response) => {
          truffleAssert.eventEmitted(response, 'LockedAccountEvent', (event) => {
            /// Return success is expected value returned
            return (event[0] == USER1 && event[1] == false);
          });
        })
        .catch((error) => {
          /// Should never get here, return failure
          return assert(false);
        })
    });

    /**
     * @dev Test loyalty record locked status for USER1
     */
    it('isLocked(USER1) should return false', async () => {
      /// Attempt to determine if USER1's account has been locked
      await pol.isLocked(USER1)
        .then((response) => {
          /// Return success is expected value returned
          return assert.equal(response, false);
        })
        .catch((error) => {
          let err = new String(error);
          /// Should never get here, return failure
          return assert(false);
        })
    });

    /**
     * @dev Test loyalty withdraw from unlocked USER1 account
     */
    it('Withdraw loyalty for USER1 should pass (unlocked)', async () => {
      // Obtain the balance of treasury and pol before withdraw
      preBalanceTreasury = await st.methods.balanceOf(TREASURY).call();
      preBalancePol = await st.methods.balanceOf(pol.address).call();
      // Obtain current deposit and collected amounts for checking
      deposit = await pol.getDepositBalance(USER1);
      collected = await pol.getTokensCollected(USER1);
      /// Attempt to perform loyalty withdrawl for USER1
      await pol.withdrawLoyalty({
          from: USER1
        })
        .then(async (tx) => {
          /// Attempt to obtain balances of treasury and SparkleLoyalty addresses
          postBalanceTreasury = await st.methods.balanceOf(TREASURY).call();
          postBalancePol = await st.methods.balanceOf(pol.address).call();
          truffleAssert.eventEmitted(tx, 'LoyaltyWithdrawnEvent', (event) => {
            /// Return success if expected event was emitted from transaction
            return (event[0] == USER1 && event[1].eq(deposit.add(collected)));
          });
        })
        .catch((error) => {
          /// Return success if expected error encountered
          return assert(false);
        });
    });

    /**
     * @dev Check balances to verify proper operation of loyalty rewards program
     */
    it('Post check balances should pass', async () => {
      /// Return success if result of balance calulation is expected
      return assert((preBalancePol - postBalancePol) == deposit && (preBalanceTreasury - postBalanceTreasury) == collected);
    });

    /**
     * @dev Test subsequent attempt to claim loyalty after record deleted
     */
    it('Loyalty claim attempt should fail', async () => {
      /// Attempt to claim loyalty rewards from withdrawn USER1 account
      await pol.claimLoyaltyReward({
          from: USER1
        })
        .then((response) => {
          /// Should never get here, return faiure
          return assert(false);
        })
        .catch((error) => {
          let err = new String(error);
          /// Return success if error value is expected
          return assert(err.includes('No record'));
        });
    });

  });

  /**
   * @dev Test remaining SparkleLoyalty functions not in other coverages
   */
  describe('Post: Audit claimed and token totals', async () => {

    /**
     * @dev Test total number of times a reward was claimed by all users
     */
    it('getTotalTimesClaimed() should return 6', async () => {
      /// Attempt to obtain the total times a reward was claimed
      await pol.getTotalTimesClaimed()
        .then((count) => {
          /// Return success if expected value returned
          return assert.equal(count, 6);
        })
        .catch((error) => {
          /// Should not get here, return failure
          return assert(false);
        })
    });

    /**
     * @dev Test total number of reward tokens claimed by all users
     */
    it('getTotalTokensClaimed() should return 55.0064083', async () => {
      /// Attempt to obtain the total number of tokens claimed by all users
      await pol.getTotalTokensClaimed()
      .then((count) => {
        /// Return success if expected value is returned
        return assert.equal(count, 5500640830);
      })
      .catch((error) => {
        /// Should not get here, return failure
        return assert(false);
      })
    });

  });

  /**
   * @dev Return any tokens to the appropriate addresses
   */
  describe('Finalize: Return any tokens deposited', async() => {

    /**
     * @dev Upon success return the earned reward tokens back to the treasury
     */
    it('Return tokens to Accounts[2]', async() => {
      /// Attempt to ERC20 transfer reward tokens earned through this test back to treasury
      await st.methods.transfer(accounts[1], 55.0064083 * 10e7).send({ from: accounts[2] });
    });

  });

});
