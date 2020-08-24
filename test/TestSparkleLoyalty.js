/// Obtain artifacts for timestamp contact
const SparkleLoyalty = artifacts.require('./SparkleLoyalty');
const SparkleTimestamp = artifacts.require('./SparkleTimestamp');
/// Include assertion libraries to support tests
const assert = require('chai').assert;
const truffleAssert = require('truffle-assertions');
/// Set SparkleToken onchain address
const onchainSparkleToken = 0x14d8d4e089a4ae60f315be178434c651d11f9b9a;
/// Initialize reference to BN object
const BN = web3.utils.BN;

contract('SparkleLoyalty - Test coverage', async accounts => {
  let pol, tsi;

  it('Initialize contract(s)', async () => {
    /// Set account literals
    OWNER = accounts[0];
    SUDOPOL = accounts[1];
    USER1 = accounts[2];
    USER2 = accounts[3];
    SPARKLE = onchainSparkleToken;
    /// Initialize contract(s)
    pol = await SparkleLoyalty.deployed({ overwrite: true });
    tsi = await SparkleTimestamp.deployed({ overwrite: true });
    /// Set pol contract address as timestamp controller address
    await tsi.setContractAddress(pol.address, { from: OWNER });
    /// Set the reward time period to 86400 seconds (~24h)
    await tsi.setTimePeriod(60 * 60 * 24, { from: OWNER });
    /// Return success if controller address changes were made
    return assert(await tsi.getContractAddress({ from: OWNER }) == pol.address && await tsi.getTimePeriod() == 86400);
  });

  /**
   * @dev Token contract address testing block
   */
  describe('Testing getTokenAddress()/SetTokenAddress() operations', async () => {

    /**
     * @dev Test getTokenAddress()
     */
    it("getTokenAddress() passed", async () => {
      assert.equal(await pol.getTokenAddress.call(), SPARKLE, "Incorrect token address");
    });

    /**
     * @dev Test setTokenAddress(0x0, {from: OWNER })
     */
    it("setTokenAddress(0x0, {from: OWNER}) failed", async () => {
      await pol.setTokenAddress(0x0, { from: OWNER })
      .then((response) => {
        /// Should not make it here, return failure
        return assert(false);
      })
      .catch((error) => {
        let err = new String(error);
        assert(err.includes('Error: invalid address'));
      });
    });

    /**
     * @dev Test setTokenAddress(SUDOPOL, {from: 0x0})
     */
    it("setTokenAddress(SUDOPOL, {from: 0x0}) failed", async () => {
      await pol.setTokenAddress(SUDOPOL, {from: 0x0})
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
     * @dev setTokenAddress(SUDOPOL, {from: USER1})
     */
    it('setTokenAddress(SUDOPOL, {from: USER1}) failed', async () => {
      await pol.setTokenAddress(SUDOPOL, { from: USER1 })
      .then((response) => {
        /// Should not make it here, return failure
        return assert(false);
      })
      .catch((error) => {
        let err = new String(error);
        return assert(err.includes('revert'));
      })
    });

    /**
     * @dev setTokenAddress(SUDOPOL, {from: OWNER })
     */
    it('setTokenAddress(SUDOPOL, {from: OWNER}) passed', async () => {
      let currentAddress = await pol.getTokenAddress.call();
      await pol.setTokenAddress(SUDOPOL, { from: OWNER });
      let newAddress = await pol.getTokenAddress.call();
      assert(currentAddress != newAddress && newAddress == SUDOPOL);
    });

  })

  /**
   * @dev Timestamp contract address testing block
   */
  describe('Testing getTimestampAddress()/setTimestampAddress() operations', async () => {

    /**
     * @dev Test getTimestampAddress()
     */
    it("getTimestampAddress() passed", async () => {
      assert.equal(await pol.getTimestampAddress.call(), tsi.address, "Incorrect timestamp address");
    });

    /**
     * @dev Testing setTimestampAddress(0x0, { from: OWNER })
     */
    it("setTimestampAddress(0x0, {from: OWNER}) failed", async () => {
      await pol.setTimestampAddress(0x0, { from: OWNER })
      .then((response) => {
        /// Should not get here, return failure
        return assert(false);
      })
      .catch((error) => {
        let err = new String(error);
        return assert(err.includes('Error: invalid address'));
      });
    });

    /**
     * @dev Testing setTimestampAddress(SUDOPOL, { from: 0x0 })
     */
    it("setTimestampAddress(SUDOPOL, {from: 0x0}) failed", async () => {
      await pol.setTimestampAddress(SUDOPOL, { from: 0x0 })
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
     * @dev Testing setTimestampAddress(SUDOPOL, { from: USER1 })
     */
    it('setTimestampAddress(SUDOPOL, {from: USER1}) failed', async () => {
      await pol.setTimestampAddress(SUDOPOL, { from: USER1 }).
      then((response) => {
        /// Should not get here, return failure
        return assert(false);
      })
      .catch((error) => {
        let err = new String(error);
        return assert(err.includes('revert'));
      })
    });

    /**
     * @dev Testing setTimestampAddress(SUDOPOL, { from: OWNER })
     */
    it('setTimestampAddress(SUDOPOL, {from: OWNER}) passed', async () => {
      let currentAddress = await pol.getTimestampAddress.call();
      await pol.setTimestampAddress(SUDOPOL, { from: OWNER });
      let newAddress = await pol.getTimestampAddress.call();
      assert(currentAddress != newAddress && newAddress == SUDOPOL);
    });

  });

  /**
   * @dev Treasury address testing block
   */
  describe('Testing getTreasuryAddress()/setTreasuryAddress() operations', async () => {

    /**
     * @dev Test getTreasuryAddress()
     */
    it("getTreasuryAddress() passed", async () => {
      assert.equal(await pol.getTreasuryAddress.call(), accounts[1], "Incorrect treasury address");
    });

    /**
     * @dev Testing setTreasuryAddress(0x0, { from: OWNER })
     */
    it("setTreasuryAddress(0x0, {from: OWNER}) failed", async () => {
      await pol.setTreasuryAddress(0x0, {
          from: OWNER
        })
        .then((response) => {
          /// Should not get here, return failure
          return assert(false);
        })
        .catch((error) => {
          let err = new String(error);
          return assert(err.includes('Error: invalid address'));
        });
    });

    /**
     * @dev Testing setTreasuryAddress(SUDOPOL, { from: 0x0 })
     */
    it("setTreasuryAddress(SUDOPOL, {from: 0x0}) failed", async () => {
      await pol.setTreasuryAddress(SUDOPOL, {
          from: 0x0
        })
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
     * @dev Testing setTreasuryAddress(SUDOPOL, { from: USER1 })
     */
    it('setTreasuryAddress(SUDOPOL, {from: USER1}) failed', async () => {
      await pol.setTreasuryAddress(SUDOPOL, {
        from: USER1
      }).
      then((response) => {
          /// Should not get here, return failure
          return assert(false);
        })
        .catch((error) => {
          let err = new String(error);
          return assert(err.includes('revert'));
        })
    });

    /**
     * @dev Testing setTreasuryAddress(SUDOPOL, { from: OWNER })
     */
    it('setTreasuryAddress(USER2, {from: OWNER}) passed', async () => {
      let currentAddress = await pol.getTreasuryAddress.call();
      await pol.setTreasuryAddress(USER2, { from: OWNER });
      let newAddress = await pol.getTreasuryAddress.call();
      // console.log('currentAddress:', currentAddress);
      // console.log('newAddress:', newAddress);
      // console.log('SUDOPOL:', USER2);
      assert(currentAddress != newAddress && newAddress == USER2);
    });

  });

  /**
   * @dev Collection address testing block
   */
  describe('Testing getCollectionAddress()/setCollectionAddress() operations', async () => {

    /**
     * @dev Testing getCollectionAddress()
     */
    it("getCollectionAddress() passed", async () => {
      assert.equal(await pol.getCollectionAddress.call(), accounts[4], "Incorrect collection address");
    });

    /**
     * @dev Testing setCollectionAddress(0x0, { from: OWNER })
     */
    it("setCollectionAddress(0x0, {from: OWNER}) failed", async () => {
      await pol.setCollectionAddress(0x0, { from: OWNER })
        .then((response) => {
          /// Should not get here, return failure
          return assert(false);
        })
        .catch((error) => {
          let err = new String(error);
          return assert(err.includes('Error: invalid address'));
        });
    });

    /**
     * @dev Testing setCollectionAddress(SUDOPOL, { from: 0x0 })
     */
    it("setCollectionAddress(SUDOPOL, {from: 0x0}) failed", async () => {
      await pol.setCollectionAddress(SUDOPOL, { from: 0x0 })
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
     * @dev Testing setCollectionAddress(SUDOPOL, { from: USER1 })
     */
    it('setCollectionAddress(SUDOPOL, {from: USER1}) failed', async () => {
      await pol.setCollectionAddress(SUDOPOL, { from: USER1 }).
      then((response) => {
          /// Should not get here, return failure
          return assert(false);
        })
        .catch((error) => {
          let err = new String(error);
          return assert(err.includes('revert'));
        })
    });

    /**
     * @dev Testing setCollectionAddress(SUDOPOL, { from: OWNER })
     */
    it('setCollectionAddress(SUDOPOL, {from: OWNER}) passed', async () => {
      let currentAddress = await pol.getCollectionAddress.call();
      await pol.setCollectionAddress(SUDOPOL, { from: OWNER });
      let newAddress = await pol.getCollectionAddress.call();
      assert(currentAddress != newAddress && newAddress == SUDOPOL);
    });

  });

  /**
   * @dev Minimum deposit values testing block
   */
  describe('getMinProof()/setMinProof() operations', async () => {

    it("getMinProof() passed", async () => {
      let minDeposit = new BN(await pol.getMinProof.call({ from: accounts[3] }));
      let testAmount = new BN(1000 * 10e7);
      assert.equal(minDeposit.toString(), testAmount.toString());
    });

    it("setMinProof(0x0, {from: OWNER}) failed", async () => {
      await pol.setMinProof(0x0, { from: OWNER })
      .then((response) => {
        /// Should not get here, return failure
        return assert(false);
      })
      .catch((error) => {
        let err = new String(error);
        return assert(err.includes('revert'));
      });
    });

    it("setMinProof(2000, {from: 0x0}) failed", async () => {
     await pol.setMinProof(2000, { from: 0x0 }).
     then((response) => {
       /// Should not get here, return failure
       return assert(false);
     })
     .catch((error) => {
       let err = new String(error);
       return assert(err.includes('from not found'));
     });
    });

    it("setMinProof(2000, {from: USER1}) failed", async () => {
      await pol.setMinProof(2000, { from: USER1 })
      .then((response) => {
        /// Should not get here, return failure
        return assert(false);
      })
      .catch((error) => {
        let err = new String(error);
        return assert(err.includes('revert'));
      });
    });

    it("setMinProof(2000, {from: OWNER}) passed", async () => {
      let currentMin = await pol.getMinProof.call();
      await pol.setMinProof(2000, { from: OWNER });
      let newMin = await pol.getMinProof.call();
      assert(currentMin != newMin && newMin / 10e7 == 2000);
    });

  });

  /**
   * @dev Maximum deposit values testing block
   */
  describe('Testing getMaxProof()/setMaxProof() operations', async () => {

    it("getMaxProof() passed", async () => {
      let maxDeposit = new BN(await pol.getMaxProof());
      var testAmount = new BN(250000 * 10e7);
      assert.equal(maxDeposit.toString(), testAmount.toString());
    });

    it("setMaxProof(0x0, {from: OWNER}) failed", async () => {
      await pol.setMaxProof(0x0, { from: OWNER })
      .then((response) => {
        /// Should not get here, return failure
        return assert(false);
      })
      .catch((error) => {
        let err = new String(error);
        return assert(err.includes('Invalid amount'));
      });
    });

    it("setMaxProof(2000, {from: 0x0}) failed", async () => {
      await pol.setMaxProof(2000, { from: 0x0 })
      .then((response) => {
        /// Should not get here, return failure
        return assert(false);
      })
      .catch((error) => {
        let err = new String(error);
        return assert(err.includes('from not found'));
      });
    });

    it("setMaxProof(2000, {from: USER1}) failed", async () => {
      await pol.setMaxProof(2000, { from: USER1 })
      .then((response) => {
        /// Should not get here, return failure
        return assert(false);
      })
      .catch((error) => {
        let err = new String(error);
        return assert(err.includes('revert'));
      });
    });

    it("setMaxProof(2000, {from: owner}) passed", async () => {
      let currentMax = await pol.getMaxProof.call();
      await pol.setMaxProof(2000, { from: OWNER });
      let newMax = await pol.getMaxProof.call();
      assert(currentMax != newMax && newMax / 10e7 == 2000);
    });

    it("setMaxProof(500000, {from: owner}) passed", async () => {
      let currentMax = await pol.getMaxProof.call();
      await pol.setMaxProof(500000, { from: OWNER });
      let newMax = await pol.getMaxProof.call();
      assert(currentMax != newMax && newMax / 10e7 == 500000);
    });
  });

});
