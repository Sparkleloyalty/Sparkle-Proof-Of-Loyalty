/// Obtain artifacts for reward tier contract
const SparkleRewardTiers = artifacts.require('./SparkleRewardTiers');
/// Include assertion libraries to support tests
const assert = require('chai').assert;
const truffleAssert = require('truffle-assertions');

/**
 * @title System reward tier0 tests
 * @author MrBitKoin (SparkleLoyalty Inc.) (c) 2019-2020
 */
contract('SparkleRewardTiers - Tier0 thru Tier3 test coverage', async accounts => {
  let rti;
  let tier1eth, tier2eth, tier3eth, tier4eth;

  /**
   * @dev Initialize contracts used throughout this set of tests
   */
  it('Initialize contract', async () => {
    /// Set account literals
    OWNER = accounts[0];
    SUDOPOL = accounts[1];
    USER1 = accounts[2];
    USER2 = accounts[3];
    /// Initialize contract
    rti = await SparkleRewardTiers.deployed({ overwrite: true });
    // Set price comparison variables
    tier0eth = web3.utils.toWei('0.00', 'ether');
    tier1eth = web3.utils.toWei('0.10', 'ether');
    tier2eth = web3.utils.toWei('0.20', 'ether');
    tier3eth = web3.utils.toWei('0.30', 'ether');
    tier4eth = web3.utils.toWei('0.40', 'ether');
    // Return success
    return assert(true);
  })

  /**
   * @dev Tier0 testing block
   */
  describe('Testing operations for tier0 (5%)', async () => {

    /**
     * @dev Test getEnabled(tier0)
     */
    it('getEnabled(Tier0) is enabled', async () => {
      await rti.getEnabled.call(0)
      .then((response) => {
        /// Attempt to get enabled status of tier0
        assert.equal(response, true, 'Not enabled');
      })
      .catch((error) => {
        return assert(false);
      })
    });

    /**
     * @dev Test getRate(tier0)
     */
    it('getRate(Tier0) should return 1.0', async () => {
      /// Attempt to get current tier0 rate
      let rate = await rti.getRate.call(0);
      /// Return success if expected address is returned
      assert.equal(rate.toString(), '100000000', 'Not enabled');
    });

    /**
     * @dev Test getPrice(tier0)
     */
    it('getPrice(Tier0) should return 0eth', async () => {
      /// Return success if expected address is returned
      assert.equal(await rti.getPrice.call(0), tier0eth, 'Not enabled');
    });

    /**
     * @dev Test updateTier(Tier0, 2, 0.1eth, false)
     */
    it('updateTier(Tier0, 200000000, tier1eth, false, {from: 0x0 }) should fail', async () => {
      /// Attemp to update Tier0 data
      await rti.updateTier(0, 200000000, tier1eth, false, { from: 0x0 })
      .then(() => {
        /// Should not get here, return failure
        return assert(false);
      })
      .catch((error) => {
        let err = new String(error);
        /// Return success if expected event emitted
        return assert(err.includes('from not found'));
      });
    });

    /**
     * @dev Test updateTier(Tier0, 2, 0.1eth, false)
     */
    it('updateTier(Tier0, 200000000, tier1eth, false, { from: USER1 }) should fail', async () => {
      /// Attemp to update Tier0 data
      await rti.updateTier.call(0, 200000000, tier1eth, false, { from: USER1 })
      .then((response) => {
        /// Should not get here, return failure
        console.log('response:', response);
        return assert(false);
      })
      .catch((error) => {
        let err = new String(error);
        /// Return success if expected event emitted
        return assert(err.includes('revert'));
      });
    });

    /**
     * @dev Test updateTier(Tier0, 2, 0.1eth, false)
     */
    it('updateTier(Tier0, 200000000, tier1eth, false, { from: OWNER }) should pass', async () => {
      /// Attemp to update Tier0 data
      let tx = await rti.updateTier(0, 200000000, tier1eth, false, {from: OWNER });
      truffleAssert.eventEmitted(tx, 'TierUpdated', (event) => {
        /// Return success if expected event emitted
        return event[0].toString() === '0' && event[1] == (2.0 * 10e7) && event[2] == tier1eth && event[3] === false;
      })
    });

    /**
     * @dev Test deleteTier(Tier0)
     */
    it('deleteTier(Tier0, { from: 0x0 }) should fail', async () => {
      /// Attemps to delete Tier0 record
      await rti.deleteTier.call(0, { from: 0x0 })
      .then((response) => {
        /// Should not make it here, return failure
        return false;
      })
      .catch((error) => {
        let err = new String(error);
        /// Return success if expected value is returned
        return err.includes('Invalid request');
      });
    });

    /**
     * @dev Test deleteTier(Tier0)
     */
    it('deleteTier(Tier0, { from: USER1 }) should fail', async () => {
      /// Attemps to delete Tier0 record
      await rti.deleteTier.call(0, { from: USER1 })
      .then((response) => {
        /// Should not make it here, return failure
        return false;
      })
      .catch((error) => {
        let err = new String(error);
        /// Return success if expected value is returned
        return err.includes('Invalid request');
      });
    });

    /**
     * @dev Test deleteTier(Tier0)
     */
    it('deleteTier(Tier0, { from: OWNER }) should fail', async () => {
      /// Attemps to delete Tier0 record
      await rti.deleteTier.call(0, { from: OWNER })
      .then((response) => {
        /// Should not make it here, return failure
        return false;
      })
      .catch((error) => {
        let err = new String(error);
        /// Return success if expected value is returned
        return err.includes('Invalid request');
      });
    });

  });

  /**
   * @dev Tier1 testing block
   */
  describe('Testing operations for Tier1 (10%)', async () => {

    /**
     * @dev Test getEnabled(tier1)
     */
    it('getEnabled(Tier1) is enabled', async () => {
      /// Attempt to get enabled status of tier0
      assert.equal(await rti.getEnabled.call(1), true, 'Not enabled');
    });

    /**
     * @dev Test getRate(tier1)
     */
    it('getRate(Tier1) should return 1.1', async () => {
      /// Attempt to get current tier0 rate
      let rate = await rti.getRate.call(1);
      /// Return success if expected address is returned
      assert.equal(rate.toString(), '110000000', 'Not enabled');
    });

    /**
     * @dev Test getPrice(tier1)
     */
    it('getPrice(Tier1) should return 0.10eth', async () => {
      /// Return success if expected address is returned
      assert.equal(await rti.getPrice.call(1), tier1eth, 'Not enabled');
    });

    /**
     * @dev Test updateTier(Tier1, 2, 0.1eth, false)
     */
    it('updateTier(Tier1, 200000000, tier1eth, false, {from: 0x0 }) should fail', async () => {
      /// Attemp to update Tier0 data
      await rti.updateTier(1, 200000000, tier1eth, false, { from: 0x0 })
      .then((response) => {
        /// Should not get here, return failure
        return assert(false);
      })
      .catch((error) => {
        let err = new String(error);
        /// Return success if expected event emitted
        return assert(err.includes('from not found'));
      });
    });

    /**
     * @dev Test updateTier(Tier1, 2, 0.1eth, false)
     */
    it('updateTier(Tier1, 200000000, tier1eth, false, { from: USER1 }) should fail', async () => {
      /// Attemp to update Tier0 data
      await rti.updateTier(1, 200000000, tier1eth, false, { from: USER1 })
      .then((response) => {
        /// Should not get here, return failure
        return assert(false);
      })
      .catch((error) => {
        let err = new String(error);
        /// Return success if expected event emitted
        return assert(err.includes('revert'));
      });
    });

    /**
     * @dev Test updateTier(Tier1, 2, 0.1eth, false)
     */
    it('updateTier(Tier1, 200000000, tier1eth, false, { from: OWNER }) should pass', async () => {
      /// Attemp to update Tier0 data
      let tx = await rti.updateTier(1, 200000000, tier1eth, false, { from: OWNER });
      truffleAssert.eventEmitted(tx, 'TierUpdated', (event) => {
        /// Return success if expected event emitted
        return event[0].toString() === '1' && event[1] == (2.0 * 10e7) && event[2] == tier1eth && event[3] === false;
      })
    });

    /**
     * @dev Test deleteTier(Tier1)
     */
    it('deleteTier(Tier1, { from: 0x0 }) should fail', async () => {
      /// Attemps to delete Tier0 record
      await rti.deleteTier(1, { from: 0x0 })
      .then((response) => {
        /// Should not make it here, return failure
        return false;
      })
      .catch((error) => {
        let err = new String(error);
        /// Return success if expected value is returned
        return err.includes('Invalid request');
      });
    });

    /**
     * @dev Test deleteTier(Tier1)
     */
    it('deleteTier(Tier1, { from: USER1 }) should fail', async () => {
      /// Attemps to delete Tier0 record
      await rti.deleteTier(1, { from: USER1 })
      .then((response) => {
        /// Should not make it here, return failure
        return false;
      })
      .catch((error) => {
        let err = new String(error);
        /// Return success if expected value is returned
        return err.includes('Invalid request');
      });
    });

    /**
     * @dev Test deleteTier(Tier1)
     */
    it('deleteTier(Tier1, { from: OWNER }) should fail', async () => {
      /// Attemps to delete Tier0 record
      await rti.deleteTier(1, { from: OWNER })
      .then((response) => {
        /// Should not make it here, return failure
        return false;
      })
      .catch((error) => {
        let err = new String(error);
        /// Return success if expected value is returned
        return err.includes('Invalid request');
      });
    });

  });

  /**
   * @dev Tier2 testing block
   */
  describe('Testing operations for Tier2 (20%)', async () => {
    /**
     * @dev Test getEnabled(tier2)
     */
    it('getEnabled(Tier2) is enabled', async () => {
      /// Attempt to get enabled status of tier2
      assert.equal(await rti.getEnabled.call(2), true, 'Not enabled');
    });

    /**
     * @dev Test getRate(tier2)
     */
    it('getRate(Tier1) should return 1.2', async () => {
      /// Attempt to get current tier2 rate
      let rate = await rti.getRate.call(2);
      /// Return success if expected address is returned
      assert.equal(rate.toString(), '120000000', 'Not enabled');
    });

    /**
     * @dev Test getPrice(tier2)
     */
    it('getPrice(Tier2) should return 0.20eth', async () => {
      /// Return success if expected address is returned
      assert.equal(await rti.getPrice.call(2), tier2eth, 'Not enabled');
    });

    /**
     * @dev Test updateTier(Tier2, 2, 0.1eth, false)
     */
    it('updateTier(Tier2, 200000000, tier1eth, false, {from: 0x0 }) should fail', async () => {
      /// Attemp to update Tier2 data
      await rti.updateTier(2, 200000000, tier1eth, false, { from: 0x0 })
      .then((response) => {
        /// Should not get here, return failure
        return assert(false);
      })
      .catch((error) => {
        let err = new String(error);
        return assert(err.includes('from not found'));
      });
    });

    /**
     * @dev Test updateTier(Tier2, 2, 0.1eth, false)
     */
    it('updateTier(Tier2, 200000000, tier1eth, false, { from: USER1 }) should fail', async () => {
      /// Attemp to update Tier2 data
      await rti.updateTier(2, 200000000, tier1eth, false, { from: USER1 })
      .then((response) => {
        /// SHould not get here, return failure
        return assert(false);
      })
      .catch((error) => {
        let err = new String(error);
        /// Return success if expected event emitted
        return assert(err.includes('revert'));
      });
    });

    /**
     * @dev Test updateTier(Tier2, 2, 0.1eth, false)
     */
    it('updateTier(Tier2, 200000000, tier1eth, false, { from: OWNER }) should pass', async () => {
      /// Attemp to update Tier2 data
      let tx = await rti.updateTier(2, 200000000, tier1eth, false, { from: OWNER });
      truffleAssert.eventEmitted(tx, 'TierUpdated', (event) => {
        /// Return success if expected event emitted
        return event[0].toString() === '2' && event[1] == (2.0 * 10e7) && event[2] == tier1eth && event[3] === false;
      })
    });

    /**
     * @dev Test deleteTier(Tier2)
     */
    it('deleteTier(Tier2, { from: 0x0 }) should fail', async () => {
      /// Attemps to delete Tier2 record
      await rti.deleteTier(2, { from: 0x0 })
      .then((response) => {
        /// Should not make it here, return failure
        return false;
      })
      .catch((error) => {
        let err = new String(error);
        /// Return success if expected value is returned
        return err.includes('Invalid request');
      });
    });

    /**
     * @dev Test deleteTier(Tier2)
     */
    it('deleteTier(Tier2, { from: USER1 }) should fail', async () => {
      /// Attemps to delete Tier2 record
      await rti.deleteTier(2, { from: USER1 })
      .then((response) => {
        /// Should not make it here, return failure
        return false;
      })
      .catch((error) => {
        let err = new String(error);
        /// Return success if expected value is returned
        return err.includes('Invalid request');
      });
    });

    /**
     * @dev Test deleteTier(Tier2)
     */
    it('deleteTier(Tier2, { from: OWNER }) should fail', async () => {
      /// Attemps to delete Tier2 record
      await rti.deleteTier(1, { from: OWNER })
      .then((response) => {
        /// Should not make it here, return failure
        return false;
      })
      .catch((error) => {
        let err = new String(error);
        /// Return success if expected value is returned
        return err.includes('Invalid request');
      });
    });

  });

  /**
   * @dev Tier3 testing block
   */
  describe('Testing operations for Tier3 (30%)', async () => {

    /**
     * @dev Test getEnabled(tier3)
     */
    it('getEnabled(Tier3) is enabled', async () => {
      /// Attempt to get enabled status of tier2
      assert.equal(await rti.getEnabled.call(3), true, 'Not enabled');
    });

    /**
     * @dev Test getRate(tier3)
     */
    it('getRate(Tier3) should return 1.3', async () => {
      /// Attempt to get current tier3 rate
      let rate = await rti.getRate.call(3);
      /// Return success if expected address is returned
      assert.equal(rate.toString(), '130000000', 'Not enabled');
    });

    /**
     * @dev Test getPrice(tier3)
     */
    it('getPrice(Tier3) should return 0.30eth', async () => {
      /// Return success if expected address is returned
      assert.equal(await rti.getPrice.call(3), tier3eth, 'Not enabled');
    });

    /**
     * @dev Test updateTier(Tier3, 2, 0.1eth, false)
     */
    it('updateTier(Tier3, 200000000, tier1eth, false, {from: 0x0 }) should fail', async () => {
      /// Attemp to update Tier3 data
      await rti.updateTier(3, 200000000, tier1eth, false, { from: 0x0 })
      .then((response) => {
        /// Should not get here, return failure
        return assert(false);
      })
      .catch((error) => {
        let err = new String(error);
        return assert(err.includes('from not found'))
      });
    });

    /**
     * @dev Test updateTier(Tier3, 2, 0.1eth, false)
     */
    it('updateTier(Tier3, 200000000, tier1eth, false, { from: USER1 }) should fail', async () => {
      /// Attemp to update Tier3 data
      await rti.updateTier(3, 200000000, tier1eth, false, { from: USER1 })
      .then((response) => {
        /// Should not get here, return failure
        return assert(false);
      })
      .catch((error) => {
        let err = new String(error);
        return assert(err.includes('revert'));
      });
    });

    /**
     * @dev Test updateTier(Tier3, 2, 0.1eth, false)
     */
    it('updateTier(Tier3, 200000000, tier1eth, false, { from: OWNER }) should pass', async () => {
      /// Attemp to update Tier3 data
      let tx = await rti.updateTier(3, 200000000, tier1eth, false, {
        from: OWNER
      });
      truffleAssert.eventEmitted(tx, 'TierUpdated', (event) => {
        /// Return success if expected event emitted
        return event[0].toString() === '3' && event[1] == (2.0 * 10e7) && event[2] == tier1eth && event[3] === false;
      })
    });

    /**
     * @dev Test deleteTier(Tier3)
     */
    it('deleteTier(Tier3, { from: 0x0 }) should fail', async () => {
      /// Attemps to delete Tier3 record
      await rti.deleteTier(3, { from: 0x0 })
      .then((response) => {
        /// Should not make it here, return failure
        return false;
      })
      .catch((error) => {
        let err = new String(error);
        /// Return success if expected value is returned
        return err.includes('Invalid request');
      });
    });

    /**
     * @dev Test deleteTier(Tier3)
     */
    it('deleteTier(Tier3, { from: USER1 }) should fail', async () => {
      /// Attemps to delete Tier2 record
      await rti.deleteTier(3, { from: USER1 })
      .then((response) => {
        /// Should not make it here, return failure
        return false;
      })
      .catch((error) => {
        let err = new String(error);
        /// Return success if expected value is returned
        return err.includes('Invalid request');
      });
    });

    /**
     * @dev Test deleteTier(Tier2)
     */
    it('deleteTier(Tier3, { from: OWNER }) should fail', async () => {
      /// Attemps to delete Tier2 record
      await rti.deleteTier(3, { from: OWNER })
      .then((response) => {
        /// Should not make it here, return failure
        return false;
      })
      .catch((error) => {
        let err = new String(error);
        /// Return success if expected value is returned
        return err.includes('Invalid request');
      });
    });

  });

  /**
   * @dev Tier4 testing block
   */
  describe('Testing operations for additional Tier4 (40%)', async () => {

    /**
     * @dev Test addTier(Tier4, 1.4, 0.4eth, true)
     */
    it('addTier(Tier4, 140000000, tier4eth, true, { from: 0x0 }) should fail', async () => {
      await rti.addTier(4, 1.4 * 10e7, tier4eth, true, { from: 0x0 })
      .then((response) => {
        /// Should not get here, return failure
        return assert(false);
      })
      .catch((error) => {
        let err = new String(error);
        return assert(err.includes('from not found'))
      });
    });

    /**
     * @dev Test addTier(Tier4, 1.4, tier4eth, true)
     */
    it('addTier(Tier4, 140000000, tier4eth, true, { from: USER1 }) should fail', async () => {
      await rti.addTier(4, 1.4 * 10e7, tier4eth, true, { from: USER1 })
      .then((response) => {
        /// Should not get here, return failure
        return assert(false);
      })
      .catch((error) => {
        let err = new String(error);
        return assert(err.includes('revert'));
      });
    });

    /**
     * @dev Test addTier(Tier4, 140000000, tier4eth, true)
     */
    it('addTier(Tier4, 140000000, tier4eth, true, { from: OWNER }) should pass', async () => {
      let tx = await rti.addTier(4, 1.4 * 10e7, tier4eth, true, { from: OWNER });
      truffleAssert.eventEmitted(tx, 'TierAdded');
    });

    /**
     * @dev Test getEnabled(tier4)
     */
    it('getEnabled(Tier4) is enabled', async () => {
      /// Attempt to get enabled status of tier4
      assert.equal(await rti.getEnabled.call(4), true, 'Not enabled');
    });

    /**
     * @dev Test getRate(tier4)
     */
    it('getRate(Tier4) should return 1.4', async () => {
      /// Attempt to get current tier4 rate
      let rate = await rti.getRate.call(4);
      /// Return success if expected address is returned
      assert.equal(rate.toString(), '140000000', 'Not enabled');
    });

    /**
     * @dev Test getPrice(tier4)
     */
    it('getPrice(Tier4) should return 0.40eth', async () => {
      /// Return success if expected address is returned
      assert.equal(await rti.getPrice.call(4), tier4eth, 'Not enabled');
    });

    /**
     * @dev Test updateTier(Tier4, 2, 0.1eth, false)
     */
    it('updateTier(Tier4, 200000000, tier1eth, false, {from: 0x0 }) should fail', async () => {
      /// Attemp to update Tier4 data
      await rti.updateTier(4, 200000000, tier1eth, false, { from: 0x0 })
      .then((response) => {
        /// Should not get here, return failure
        return assert(false);
      })
      .catch((error) => {
        let err = new String(error);
        return assert(err.includes('from not found'));
      });
    });

    /**
     * @dev Test updateTier(Tier4, 2, 0.1eth, false)
     */
    it('updateTier(Tier4, 200000000, tier1eth, false, { from: USER1 }) should fail', async () => {
      /// Attemp to update Tier3 data
      await rti.updateTier(4, 200000000, tier1eth, false, { from: USER1 })
      .then((response) => {
        /// Should not get here, return failure
        return assert(false);
      })
      .catch((error) => {
        let err = new String(error);
        return assert(err.includes('revert'));
      });
    });

    /**
     * @dev Test updateTier(Tier4, 2, 0.1eth, false)
     */
    it('updateTier(Tier4, 200000000, tier1eth, false, { from: OWNER }) should pass', async () => {
      /// Attemp to update Tier3 data
      let tx = await rti.updateTier(4, 200000000, tier1eth, false, { from: OWNER });
      truffleAssert.eventEmitted(tx, 'TierUpdated', (event) => {
        /// Return success if expected event emitted
        return event[0].toString() === '4' && event[1] == (2.0 * 10e7) && event[2] == tier1eth && event[3] === false;
      })
    });

    /**
     * @dev Test deleteTier(Tier4)
     */
    it('deleteTier(Tier4, { from: 0x0 }) should fail', async () => {
      /// Attemps to delete Tier4 record
      await rti.deleteTier(4, { from: 0x0 })
      .then((response) => {
        /// Should not make it here, return failure
        return false;
      })
      .catch((error) => {
        let err = new String(error);
        /// Return success if expected value is returned
        return err.includes('Invalid request');
      });
    });

    /**
     * @dev Test deleteTier(Tier4)
     */
    it('deleteTier(Tier4, { from: USER1 }) should fail', async () => {
      /// Attemps to delete Tier2 record
      await rti.deleteTier(4, { from: USER1 })
      .then((response) => {
        /// Should not make it here, return failure
        return false;
      })
      .catch((error) => {
        let err = new String(error);
        /// Return success if expected value is returned
        return err.includes('Invalid request');
      });
    });

    /**
     * @dev Test deleteTier(Tier4)
     */
    it('deleteTier(Tier4, { from: OWNER }) should pass', async () => {
      /// Attemps to delete Tier4 record
      await rti.deleteTier(4, { from: OWNER })
      .then((response) => {
        /// Should not make it here, return failure
        return false;
      })
      .catch((error) => {
        let err = new String(error);
        /// Return success if expected value is returned
        return err.includes('Invalid request');
      });
    });

    /**
     * @dev Test getEnabled(tier4)
     */
    it('getEnabled(Tier4) is disabled', async () => {
      /// Attempt to get enabled status of tier4
      assert.equal(await rti.getEnabled.call(4), false, 'Not enabled');
    });

    /**
     * @dev Test getRate(tier4)
     */
    it('getRate(Tier4) should fail', async () => {
      /// Attempt to get current tier4 rate
      let rate = await rti.getRate.call(4);
      /// Return success if expected address is returned
      assert.equal(rate.toString(), '0', 'Not enabled');
    });

    /**
     * @dev Test getPrice(tier4)
     */
    it('getPrice(Tier4) should fail', async () => {
      /// Return success if expected address is returned
      assert.equal(await rti.getPrice.call(4), tier0eth, 'Not enabled');
    });

  });

});
