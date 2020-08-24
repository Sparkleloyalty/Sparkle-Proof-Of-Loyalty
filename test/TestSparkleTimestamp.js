/// Obtain artifacts for timestamp contract
const SparkleLoyalty = artifacts.require('./SparkleLoyalty');
const SparkleTimestamp = artifacts.require('./SparkleTimestamp');
/// Include assertion libraries to support tests
const assert = require('chai').assert;
const truffleAssert = require('truffle-assertions');
/// Inlcude ganache/ganache-cli time helpers
const helper = require("./helpers/truffle-time-helpers");

/**
 * @title Sparkle timestamp tests
 * @author SparkleLoyalty Inc. (c) 2019-2020
 */
contract('SparkleTimestamp - Test coverage', async accounts => {
  // Declared required variables for tests
  let pol, tsi;
  let lastDeposited;

  /**
   * @dev Initialize contracts used throughout this set of tests
   */
  it('Initialize contract', async() => {
    /// Set account literals
    OWNER = accounts[0];
    SUDOPOL = accounts[1];
    USER1 = accounts[2];
    USER2 = accounts[3];
    /// Initialize contract(s)
    pol = await SparkleLoyalty.deployed({ overwrite: true });
    tsi = await SparkleTimestamp.deployed({ overwrite: true });
    // Return success
    return assert(true);
  })

  /**
   * @dev Contract address testing block
   */
  describe('Testing getContractAddress()/setContractAddress() operations', async() => {
    /**
     * @dev Test current value of controller contract address
     */
    it('getContractAddress() should equal controller address', async () => {
      /// Return success if addresses match
      return assert.equal(await tsi.getContractAddress(), pol.address);
    });

    /**
     * @dev Test setting the controller contract address to invalid address
     */
    it('setContractAddress(0x0, {from: owner}) should fail', async () => {
      /// Attempt to set controller address
      await tsi.setContractAddress(0x0, { from: OWNER })
      .then(() => {
        /// Should not make it here, return failure
        return assert(false);
      })
      .catch((error) => {
        /// Should throw/return an error as expected
        let err = new String(error);
        /// Return success if expected error encountered
        return assert(err.includes('Error: invalid address'));
      });
    });

    /**
     * @dev Test setting the controller contract address from an invalid address
     */
    it('setContractAddress(SUDOPOL, {from: 0x0}) should fail', async () => {
      /// Attempt to set controller address from invalid address
      await tsi.setContractAddress(SUDOPOL, { from: 0x0 })
      .then(() => {
        /// Should not make it here, return failure
        assert(false);
      })
      .catch((error) => {
        /// Should throw/return an error as expected
        let err = new String(error);
        /// Return success if expected error encountered
        return assert(err.includes('Error:'));
      });
    });

    /**
     * @dev Test setting the controller contract address from owner address
     */
    it('setContractAddress(SUDOPOL, {from: OWNER}) should pass', async () => {
      /// Attempt to set controller address from invalid address
      let tx = await tsi.setContractAddress(SUDOPOL, { from: OWNER });
      /// Return success if expected event was emitted from transaction
      truffleAssert.eventEmitted(tx, 'ContractAddressChanged');
    });

    /**
     * @dev Test setting the controller contract address from non-owner address
     */
    it("setContractAddress(SUDOPOL, {from: non-owner}) should fail", async () => {
      /// Attempt to set controller address from non-owner address
      await tsi.setContractAddress(SUDOPOL, { from: USER1 })
      .then(() => {
        /// Should not make it here, return failure
        return assert(false);
      })
      .catch((error) => {
        /// Should throw/return an error as expected
        let err = new String(error);
        /// Return success if expected error encountered
        return assert(err.includes('revert'));
      });
    });

    /**
     * @dev Test set controller address to be expected value
     */
    it('getContractAddress() should equal SUDOPOL', async () => {
      /// Attempt to get controller address
      await tsi.getContractAddress()
      .then((address) => {
        /// Return success if expected address is returned
        assert.equal(address, SUDOPOL);
      })
      .catch((error) => {
        /// Should not make it here, return failure
        assert(false);
      });
    });

  });

  /**
   * @dev Timestamp time period testing block
   */
  describe('Testing getTimePeriod()/setTimePeriod() operations', async() => {
    /**
     * @dev Test get time period to be expected value
     */
    it("getTimePeriod() should equal 180 seconds", async () => {
      /// Attempt to get current time period value
      await tsi.getTimePeriod()
      .then((period) => {
        /// Return success if expected value is returned
        return assert.equal(period, 180);
      })
      .catch((error) => {
        /// Should not make it here, return failure
        assert(false);
      });
    });

    /**
     * @dev Test setting time period to invalid value
     */
    it('setTimePeriod(42, {from: OWNER}) should fail', async () => {
      /// Attempt to set current time period value
      await tsi.setTimePeriod(42, { from: OWNER })
      .then(() => {
        /// Should not make it here, return failure
        assert(false);
      })
      .catch((error) => {
        let err = new String(error);
        /// Return success if expected value is returned
        return assert(err.includes('revert'));
      });
    });

    /**
     * @dev Test setting time period from invalid address
     */
    it('setTimePeriod(3600, {from: 0x0}) should fail', async () => {
      /// Attempt to set current time period value
      await tsi.setTimePeriod(3600, { from: 0x0 })
      .then(() => {
        /// Should not make it here, return failure
        assert(false);
      })
      .catch((error) => {
        /// Should throw/return an error as expected
        let err = new String(error);
        /// Return success if expected value is returned
        return assert(err.includes('Error:'));
      });
    });

    /**
     * @dev Test setting time period from valid non-owner address
     */
    it('setTimePeriod(3600, {from: SUDOPOL}) should fail', async () => {
      /// Attempt to set current time period value
      tsi.setTimePeriod(3600, { from: SUDOPOL })
      .then(() => {
        /// Should not make it here, return failure
        assert(false);
      })
      .catch((error) => {
        /// Should throw/return an error as expected
        let err = new String(error);
        /// Return success if expected value is returned
        return assert(err.includes('Error:'));
      });
    });

    /**
     * @dev Test setting time period from valid owner address
     */
    it('setTimePeriod(3600, {from: OWNER}) should pass', async () => {
      /// Return success if expected event is emitted from transaction
      truffleAssert.eventEmitted(await tsi.setTimePeriod(3600, { from: OWNER }), 'TimePeriodChanged');
    });

    /**
     * @dev Test time period value equals previously set value
     */
    it("getTimePeriod() should equal 3600 seconds", async () => {
      /// Attempt to get current time period value
      tsi.getTimePeriod()
        .then((period) => {
          /// Return success if expected value is returned
          return assert.equal(period, 3600);
        })
        .catch((error) => {
          /// Should not make it here, return failure
          assert(false);
        });
    });

  });

  /**
   * @dev Add timestamp testing block
   */
  describe('Test addTimestamp() operations', async() => {
    /**
     * @dev Test adding timestamp from invalid address
     */
    it("addTimestamp(USER2, {from: 0x0}) should fail", async () => {
      /// Attempt to add timestamp for USER2
      tsi.addTimestamp(USER2, { from: 0x0 })
      .then((response) => {
        /// Should not make it here, return failure
        assert(false);
      })
      .catch((error) => {
        /// Should throw/return an error as expected
        let err = new String(error)
        /// Return success if expected value is returned
        return assert(err.includes('Error:'));
      });
    });

    /**
     * @dev Test adding timestamp for invalid address from owner
     */
    it("addTimestamp(0x0, {from: OWNER}) should fail", async () => {
      /// Attempt to add timestamp for invalid address by valid owner address
      tsi.addTimestamp(0x0, { from: OWNER })
      .then((response) => {
        /// Should not make it here, return failure
        assert(false);
      })
      .catch((error) => {
        /// Should throw/return an error as expected
        let err = new String(error);
        /// Return success if expected value is returned
        return assert(err.includes('Error:'));
      });
    });

    /**
     * @dev Test adding timestamp for USER2 from valid owner
     */
    it("addTimestamp(USER2, {from: controller}) should pass", async () => {
      /// Attempt to add timestamp for invalid address by valid owner address
      let tx = await tsi.addTimestamp(USER2, { from: SUDOPOL });
      /// Obtain the joined and deposited timestamp for USER2
      lastJoined = await tsi.getJoinedTimestamp(USER2, { from: SUDOPOL });
      lastDeposited = await tsi.getDepositTimestamp(USER2, { from: SUDOPOL });
      /// Return success if expected event emitted from transaction
      truffleAssert.eventEmitted(tx, 'TimestampAdded');
    });

    /**
     * @dev Test adding an additional timestamp for USER2 from owner address
     */
    it("addTimestamp(USER2, {from: OWNER}) should fail", async () => {
      /// Attempt to add timestamp for invalid address by valid owner address
      tsi.addTimestamp(USER2, { from: OWNER })
      .then((response) => {
        /// Should not make it here, return failure
        assert(false);
      })
      .catch((error) => {
        /// Should throw/return an error as expected
        let err = new String(error);
        /// Return success if expected event emitted from transaction
        return assert(err.includes('revert'));
      });
    });

  })

  /**
   * @dev Timestamp loyalty auditing testing block
   */
  describe('Test hasTimestamp()/getTimeRemaining()/isRewardReady()', async() => {

    /**
     * @dev Test is USER2 address has a timestamp
     */
    it('Should have timestamp fror USER2 should pass', async () => {
      /// Return success if expected value is returned
      assert.equal(await tsi.hasTimestamp(USER2, { from: SUDOPOL }), true);
    });

    /**
     * @dev Test getTimeRemaining(USER2) from invalid address
     */
    it('getTimeRemaining(USER2, {from: 0x0}) should fail', async () => {
      /// Attempt to get time remaining until reward maturity
      await tsi.getTimeRemaining(USER2, { from: 0x0 })
      .then((reaming) => {
        /// Should not make it here, return failure
        return assert(false);
      })
      .catch((error) => {
        /// Should throw/return an error as expected
        let err = new String(error);
        /// Return success if expected event emitted from transaction
        return assert(err.includes('revert'));
      });
    });

    /**
     * @dev Test isRewardReady(USER2) from invalid address
     */
    it("isRewardReady(USER2, {from: 0x0}) failed", async () => {
      /// Attempt to determine if reward is ready for USER2 from invalid address
      await tsi.isRewardReady(USER2, { from: 0x0 })
      .then(() => {
        /// Should not make it here, return failure
        return assert(false)
      })
      .catch((error) => {
        /// Should throw/return an error as expected
        let err = new String(error);
        /// Return success if expected event emitted from transaction
        return assert(err.includes('revert'));
      });
    });

    /**
     * @dev Test getTimeRemaining(0x0) from controller address
     */
    it('getTimeRemaining(0x0, {from: SUDOPOL}) should fail', async () => {
      /// Attempt to get time remaining until reward maturity
      await tsi.getTimeRemaining(0x0, { from: SUDOPOL })
      .then((reaming) => {
        /// Should not make it here, return failure
        return assert(false);
      })
      .catch((error) => {
        /// Should throw/return an error as expected
        let err = new String(error);
        /// Return success if expected event emitted from transaction
        return assert(err.includes('Error: invalid address'));
      });
    });

    /**
     * @dev Test isRewardReady(0x0) from controller address
     */
    it("isRewardReady(0x0, {from: SUDOPOL}) failed", async () => {
      /// Attempt to determine if reward is ready for USER2 from invalid address
      await tsi.isRewardReady(0x0, { from: SUDOPOL })
      .then(() => {
        /// Should not make it here, return failure
        return assert(false)
      })
      .catch((error) => {
        /// Should throw/return an error as expected
        let err = new String(error);
        /// Return success if expected event emitted from transaction
        return assert(err.includes('Error: invalid address'));
      });
    });

    /**
     * @dev Test getTimeRemaining(USER1) from controller address
     */
    it('getTimeRemaining(USER1, {from: SUDOPOL}) should fail', async () => {
      /// Attempt to get time remaining until reward maturity
      await tsi.getTimeRemaining(USER1, { from: SUDOPOL })
      .then((reaming) => {
        /// Should not make it here, return failure
        return assert(false);
      })
      .catch((error) => {
        /// Should throw/return an error as expected
        let err = new String(error);
        /// Return success if expected event emitted from transaction
        return assert(err.includes('revert'));
      });
    });

    /**
     * @dev Test isRewardReady(USER1) from controller address
     */
    it("isRewardReady(USER1, {from: SUDOPOL}) failed", async () => {
      /// Attempt to determine if reward is ready for USER1 from vali address
      await tsi.isRewardReady(USER1, { from: SUDOPOL })
      .then(() => {
        /// Should not make it here, return failure
        return assert(false)
      })
      .catch((error) => {
        /// Should throw/return an error as expected
        let err = new String(error);
        /// Return success if expected event emitted from transaction
        return assert(err.includes('revert'));
      });
    });

    /**
     * @dev Test isRewardReady(USER2) before mature from owner address
     */
    it("Premature (0s) isRewardReady(USER2, {from: SUDOPOL}) should fail", async () => {
      /// Attempt to determine if reward is ready for USER2 from vali address
      await tsi.isRewardReady(USER2, { from: SUDOPOL })
      .then((result) => {
        /// Return success if expected value is returned
        return assert.equal(result, false);
      })
      .catch((error) => {
        /// Should not make it here, return failure
        return assert(false);
      });
    });

    /**
     * @dev Test getTimeRemaining(0x0) from controller address
     */
    it('getTimeRemaining(0x0, {from: SUDOPOL}) should fail', async() => {
      /// Attempt to detremine how many seconds are remaining
      await tsi.getTimeRemaining(0x0, { from: SUDOPOL })
      .then((reaming) => {
        /// Should not make it here, return failure
        return assert(false);
      })
      .catch((error) => {
        /// Should throw/return an error as expected
        let err = new String(error);
        /// Return success if expected event emitted from transaction
        return assert(err.includes('Error: invalid address'));
      });
    });

    /**
     * @dev Test getTimeRemaining(USER2) at initial reward cycle from controller address
     */
    it('getTimeRemaining(USER2, {from: SUDOPOL}) should be >= 3500 and not mature', async () => {
      /// Attempt to detremine how many seconds are remaining
      await tsi.getTimeRemaining(USER2, { from: SUDOPOL })
      .then((remaining) => {
        /// Return success if expected value is returned
        return assert(remaining[0]>=3500 && !remaining[1]);
      })
      .catch((error) => {
        /// Should not make it here, return failure
        return assert(false);
      });
    });

    /**
     * @dev Test isRewardReady(USER2) pre-mature @ 50% from controller address
     */
    it("Premature (1800s) isRewardReady(USER2, {from: SUDOPOL}) should fail", async () => {
      // Advance ganache/ganachecli an hour (Previously test set to 3600)
      await helper.advanceTimeAndBlock(1800);
      /// Attempt to determine if reward is ready for USER2 from vali address
      await tsi.isRewardReady(USER2, { from: SUDOPOL })
      .then((result) => {
        /// Return success if expected value is returned
        return assert.equal(result, false);
      })
      .catch((error) => {
        /// Should not make it here, return failure
        return assert(false);
      });
    });

    /**
     * @dev Test getTimeRemaining(USER2) at mid-reward cycle from controller address
     */
    it('getTimeRemaining(USER2, {from: SUDOPOL}) should be >= 1750 and not mature', async () => {
      /// Attempt to determine how many seconds are remaining
      await tsi.getTimeRemaining(USER2, { from: SUDOPOL })
      .then((remaining) => {
        /// Return success if expected value is returned
        return assert(remaining[0] >= 1750 && !remaining[1]);
      })
      .catch((error) => {
        /// Should not make it here, return failure
        return assert(false);
      });
    });

    /**
     * @dev Test isRewardReady(USER2) post-mature from controller address
     */
    it("Matured (3600s) isRewardReady(USER2, {from: SUDOPOL}) should pass", async () => {
      // Advance ganache/ganachecli an hour (Previously test set to 3600)
      await helper.advanceTimeAndBlock(1820);
      /// Attempt to determine if reward is ready for USER2 from vali address
      await tsi.isRewardReady(USER2, { from: SUDOPOL })
      .then((result) => {
        /// Return success if expected value is returned
        return assert.equal(result, true);
      })
      .catch((error) => {
        /// Should not make it here, return failure
        return assert(false);
      });
    });

    /**
     * @dev Test getTimeRemaining(USER2) just after maturity from controller address
     */
    it('getTimeRemaining(USER2, {from: SUDOPOL}) should be >= 0 and be mature', async () => {
      /// Attempt to obtain the timestamp of user's reward maturity
      await tsi.getRewardTimestamp(USER2, { from: SUDOPOL })
      .then((timestamp) => {
        /// Set local test variable to reward timestamp
        lastReward = timestamp;
      })
      .catch((error) => {
        /// unable to obtain the users reward timestamp
        lastReward = 0;
      });

      /// Attempt to detremine how many seconds are remaining
      await tsi.getTimeRemaining(USER2, { from: SUDOPOL })
      .then((remaining) => {
        /// Set local test variables to repective timestamp values
        // lastRemainging = remaining[0];
        // lastMatured = remaining[1];
        lastDeposited = remaining[2];
        /// Return success if expected value returned
        return assert(remaining[0] >= 0 && remaining[1]);
      })
      .catch((error) => {
        /// Should not make it here, return failure
        return assert(false);
      });
    });

  });

  /**
   * @dev Timestamp record address data query
   */
  describe('Test getAddress() operation', async() => {

    /**
     * @dev Test getAddress(0x0) from controller address
     */
    it('getAddress(0x0, {from: SUDOPOL}) should fail', async() => {
      /// Attempt to get users loyalty address
      await tsi.getAddress(0x0, {from: SUDOPOL})
      .then((address) => {
        /// Should not make it here, return failure
        return assert(false);
      })
      .catch((error) => {
        let err = new String(error);
        /// Return success if expected event emitted from transaction
        return assert(err.includes('Error:'));
      })
    });

    /**
     * @dev Test getAddress(USER1) from controller address
     */
    it('getAddress(USER1, {from: SUDOPOL}) should fail', async() => {
      /// Attempt to get users loyalty address
      await tsi.getAddress(USER1, {from: SUDOPOL})
      .then((address) => {
        /// Should not make it here, return failure
        return assert(false);
      })
      .catch((error) => {
        let err = new String(error);
        /// Return success if expected event emitted from transaction
        return assert(err.includes('revert'));
      })
    });

    /**
     * @dev Test getAddress(USRE2) from invalid address
     */
    it('getAddress(USER2, {from: 0x0}) should fail', async() => {
      /// Attempt to get users loyalty address
      await tsi.getAddress(USER2, {from: 0x0})
      .then((address) => {
        /// Should not make it here, return failure
        return assert(false);
      })
      .catch((error) => {
        let err = new String(error);
        /// Return success if expected event emitted from transaction
        return assert(err.includes('revert'));
      })
    });

    /**
     * @dev Test getAddress(USER2) from valid non-controller address
     */
    it('getAddress(USER2, {from: USER1}) should fail', async() => {
      /// Attempt to get users loyalty address
      await tsi.getAddress(USER2, {from: USER1})
      .then((address) => {
        /// Should not make it here, return failure
        return assert(false);
      })
      .catch((error) => {
        let err = new String(error);
        /// Return success if expected event emitted from transaction
        return assert(err.includes('revert'));
      })
    });

    /**
     * @dev Test getAddress(USER2) from controller address
     */
    it('getAddress(USER2, {from: SUDOPOL}) should pass', async() => {
      /// Attempt to get users loyalty address
      await tsi.getAddress(USER2, {from: SUDOPOL})
      .then((address) => {
        /// Return success if expected value is returned
        return assert.equal(address, USER2);
      })
      .catch((error) => {
        /// Should not make it here, return failure
        return assert(false);
      })
    });
  });

  /**
   * @dev Timestamp record joined timestamp data query
   */
  describe('Test getJoineTimestamp()', async () => {

    /**
     * @dev Test getJoinedTimestamp(0x0) from conreoller address
     */
    it('getJoinedTimestamp(0x0, {from: SUDOPOL}) should fail', async () => {
      /// Attempt to get users joined timestamp
      await tsi.getJoinedTimestamp(0x0, { from: SUDOPOL })
      .then((address) => {
        /// Should not make it here, return failure
        return assert(false);
      })
      .catch((error) => {
        let err = new String(error);
        /// Return success if expected event emitted from transaction
        return assert(err.includes('Error:'));
      })
    });

    /**
     * @dev Test getJoinedTimestamp(USER1) from controller address
     */
    it('getJoinedTimestamp(USER1, {from: SUDOPOL}) should fail', async () => {
      /// Attempt to get users joined timestamp
      await tsi.getJoinedTimestamp(USER1, { from: SUDOPOL })
      .then((address) => {
        /// Should not make it here, return failure
        return assert(false);
      })
      .catch((error) => {
        let err = new String(error);
        /// Return success if expected event emitted from transaction
        return assert(err.includes('revert'));
      })
    });

    /**
     * @dev Test getJoinedTimestamp(USER2) from invalid address
     */
    it('getJoinedTimestamp(USER2, {from: 0x0}) should fail', async () => {
      /// Attempt to get users joined timestamp
      await tsi.getJoinedTimestamp(USER2, { from: 0x0 })
      .then((address) => {
        /// Should not make it here, return failure
        return assert(false);
      })
      .catch((error) => {
        let err = new String(error);
        /// Return success if expected event emitted from transaction
        return assert(err.includes('Error:'));
      })
    });

    /**
     * @dev Test getJoinedTimestamp(USER2) from non-controller address
     */
    it('getJoinedTimestamp(USER2, {from: USER1}) should fail', async () => {
      /// Attempt to get users joined timestamp
      await tsi.getJoinedTimestamp(USER2, { from: USER1 })
      .then((address) => {
        /// Should not make it here, return failure
        return assert(false);
      })
      .catch((error) => {
        let err = new String(error);
        /// Return success if expected event emitted from transaction
        return assert(err.includes('revert'));
      })
    });

    /**
     * @dev Test getJoinedTimestamp(USER2) from controller address
     */
    it('getJoinedTimestamp(USER2, {from: SUDOPOL}) should pass', async () => {
      /// Attempt to get users joined timestamp
      await tsi.getJoinedTimestamp(USER2, { from: SUDOPOL })
      .then((timestamp) => {
        /// Return success if expected value is returned
        return assert.equal(timestamp.toString(), lastJoined.toString());
      })
      .catch((error) => {
        /// Should not make it here, return failure
        return assert(false);
      })
    });
  });

  /**
   * @dev Timestamp record joined timestamp data query
   */
  describe('Test getDepositTimestamp()', async () => {

    /**
     * @dev getDepositTimestamp(0x0) from controller address
     */
    it('getDepositTimestamp(0x0, {from: SUDOPOL}) should fail', async () => {
      /// Attempt to get users current deposit timestamp
      await tsi.getDepositTimestamp(0x0, { from: SUDOPOL })
      .then((address) => {
        /// Should not make it here, return failure
        return assert(false);
      })
      .catch((error) => {
        let err = new String(error);
        /// Return success if expected event emitted from transaction
        return assert(err.includes('Error:'));
      })
    });

    /**
     * @dev getDepositTimestamp(USER1) from controller address
     */
    it('getDepositTimestamp(USER1, {from: SUDOPOL}) should fail', async () => {
      /// Attempt to get users current deposit timestamp
      await tsi.getDepositTimestamp(USER1, { from: SUDOPOL })
      .then((address) => {
        /// Should not make it here, return failure
        return assert(false);
      })
      .catch((error) => {
        let err = new String(error);
        /// Return success if expected event emitted from transaction
        return assert(err.includes('revert'));
      })
    });

    /**
     * @dev getDepositTimestamp(USER2) from invalid address
     */
    it('getDepositTimestamp(USER2, {from: 0x0}) should fail', async () => {
      /// Attempt to get users current deposit timestamp
      await tsi.getDepositTimestamp(USER2, { from: 0x0 })
      .then((address) => {
        /// Should not make it here, return failure
        return assert(false);
      })
      .catch((error) => {
        let err = new String(error);
        /// Return success if expected event emitted from transaction
        return assert(err.includes('Error:'));
      })
    });

    /**
     * @dev getDepositTimestamp(USER2) from non-controller address
     */
    it('getDepositTimestamp(USER2, {from: USER1}) should fail', async () => {
      /// Attempt to get users current deposit timestamp
      await tsi.getDepositTimestamp(USER2, { from: USER1 })
      .then((address) => {
        /// Should not make it here, return failure
        return assert(false);
      })
      .catch((error) => {
        let err = new String(error);
        /// Return success if expected event emitted from transaction
        return assert(err.includes('revert'));
      })
    });

    /**
     * @dev getDepositTimestamp(USER2) from controller address
     */
    it('getDepositTimestamp(USER2, {from: SUDOPOL}) should pass', async () => {
      /// Attempt to get users current deposit timestamp
      await tsi.getDepositTimestamp(USER2, { from: SUDOPOL })
      .then((timestamp) => {
        /// Return success if expected value is returned
        return assert.equal(timestamp.toString(), lastDeposited.toString());
      })
      .catch((error) => {
        /// Should not make it here, return failure
        return assert(false);
      })
    });
  });

  /**
   * @dev Timestamp record reward timestamp data query
   */
  describe('Test getRewardTimestamp()', async () => {

    /**
     * @dev getRewardTimestamp(0x0) from controller address
     */
    it('getRewardTimestamp(0x0, {from: SUDOPOL}) should fail', async () => {
      /// Attempt to get users current reward matiruty timestamp
      await tsi.getRewardTimestamp(0x0, { from: SUDOPOL })
      .then((address) => {
        /// Should not make it here, return failure
        return assert(false);
      })
      .catch((error) => {
        let err = new String(error);
        /// Return success if expected event emitted from transaction
        return assert(err.includes('Error:'));
      })
    });

    /**
     * @dev getRewardTimestamp(USER1) from controller address
     */
    it('getRewardTimestamp(USER1, {from: SUDOPOL}) should fail', async () => {
      /// Attempt to get users current reward matiruty timestamp
      let rewardTimestamp = await tsi.getRewardTimestamp(USER1, { from: SUDOPOL });
      /// Return success if expected value is returned
      return assert.equal(rewardTimestamp, 0);
    });

    /**
     * @dev getRewardTimestamp(USER2) from invalid address
     */
    it('getRewardTimestamp(USER2, {from: 0x0}) should fail', async () => {
      /// Attempt to get users current reward matiruty timestamp
      await tsi.getRewardTimestamp(USER2, { from: 0x0 })
      .then((address) => {
        /// Should not make it here, return failure
        return assert(false);
      })
      .catch((error) => {
        let err = new String(error);
        /// Return success if expected event emitted from transaction
        return assert(err.includes('Error:'));
      })
    });

    /**
     * @dev getRewardTimestamp(USER2) from non-controller address
     */
    it('getRewardTimestamp(USER2, {from: USER1}) should fail', async () => {
      /// Attempt to get users current reward matiruty timestamp
      await tsi.getRewardTimestamp(USER2, { from: USER1 })
      .then((address) => {
        /// Should not make it here, return failure
        return assert(false);
      })
      .catch((error) => {
        let err = new String(error);
        /// Return success if expected event emitted from transaction
        return assert(err.includes('revert'));
      })
    });

    /**
     * @dev getRewardTimestamp(USER2) from controller address
     */
    it('getRewardTimestamp(USER2, {from: SUDOPOL}) should pass', async () => {
      /// Attempt to get users current reward matiruty timestamp
      await tsi.getRewardTimestamp(USER2, { from: SUDOPOL })
      .then((timestamp) => {
        /// Return success if expected value is returned
        return assert.equal(timestamp.toString(), lastReward.toString());
      })
      .catch((error) => {
        /// Should not make it here, return failure
        return assert(false);
      })
    });
  });

  /**
   * @dev Test timestamp deletion test block
   */
  describe('Test deleteTimestamp()', async() => {

    /**
     * @dev deleteTimestamp(0x0) from controller address
     */
    it("deleteTimestamp(0x0, {from: SUDOPOL}) failed", async () => {
      await tsi.deleteTimestamp(0x0, { from: SUDOPOL })
      .then((response) => {
        /// Should not make it here, return failure
        return assert(false);
      })
      .catch((error) => {
        let err = new String(error);
        return assert(err.includes(''));
      });
    });

    /**
     * @dev deleteTimestamp(UESR1) from controller address
     */
    it("deleteTimestamp(USER1, {from: SUDOPOL}) failed", async () => {
      await tsi.deleteTimestamp(USER1, { from: SUDOPOL })
      .then((response) => {
        /// Should not make it here, return failure
        return assert(false);
      })
      .catch ((error) => {
        let err = new String(error);
        /// Return success if expected event emitted from transaction
        return assert(err.includes('revert'));
      });
    });

    /**
     * @dev deleteTimestamp(USER2) from invalid address
     */
    it("deleteTimestamp(USER2, {from: 0x0}) failed", async () => {
      await tsi.deleteTimestamp(USER2, { from: 0x0 })
      .then((response) => {
        /// Should not make it here, return failure
        return assert(false);
      })
      .catch ((error) => {
        let err = new String(error);
        /// Return success if expected event emitted from transaction
        return assert(err.includes('Error:'));
      });
    });

    /**
     * @dev deleteTimestamp(USER2) from non-controller address
     */
    it("deleteTimestamp(USER2, {from: USER1}) failed", async () => {
      await tsi.deleteTimestamp(USER2, { from: USER1 })
      .then((response) => {
        /// Should not make it here, return failure
        return assert(false);
      })
      .catch ((error) => {
        let err = new String(error);
        /// Return success if expected event emitted from transaction
        return assert(err.includes('revert'));
      });
    });

    /**
     * @dev deleteTimestamp() from address
     */
    it("deleteTimestamp(USER2, {from: SUDOPOL}) should pass", async () => {
      await tsi.deleteTimestamp(USER2, { from: SUDOPOL })
      .then(async (response) => {
        /// Only a tx receipt will be returned, so ensure timestamp deleted in next test
        return assert(true);
      })
      .catch ((error) => {
        /// Should not make it here, return failure
        return assert(false);
      });
    });

    /**
     * @dev Test is USER2 address has a timestamp
     * @notice Previous test returns only tx reciept/promiEvent object so re-check deletion
     */
    it('hasTimestamp for USER2 should fail', async () => {
      /// Return success if expected value is returned
      assert.equal(await tsi.hasTimestamp(USER2, { from: SUDOPOL }), false);
    });
  });
});
