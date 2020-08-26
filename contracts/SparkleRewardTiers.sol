// SPDX-License-Identifier: UNLICENSED

/// SWC-103:  Floating Pragma
pragma solidity 0.6.12;

import '@openzeppelin/contracts/math/SafeMath.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/Pausable.sol';
import '@openzeppelin/contracts/utils/ReentrancyGuard.sol';
import './ISparkleRewardTiers.sol';

/**
  * @title A contract for managing reward tiers
  * @author SparkleLoyalty Inc. (c) 2019-2020
  */
contract SparkleRewardTiers is ISparkleRewardTiers, Ownable, Pausable, ReentrancyGuard {

  /**
    * @dev Ensure math safety through SafeMath
    */
  using SafeMath for uint256;

  /**
    * @dev Data structure declaring a loyalty tier
    * @param _rate apr for reward tier
    * @param _price to select reward tier
    * @param _enabled availability for reward tier
    */
  struct Tier {
    uint256 _rate;
    uint256 _price;
    bool _enabled;
  }

  // tiers mapping of available reward tiers
  mapping(uint256 => Tier) private g_tiers;

  /**
    * @dev Sparkle loyalty tier rewards contract
    * @notice Timestamp support for SparklePOL contract
    */
  constructor()
  public
  Ownable()
  Pausable()
  ReentrancyGuard()
  {
    Tier memory tier0;
    tier0._rate = uint256(1.00000000 * 10e7);
    tier0._price = 0 ether;
    tier0._enabled = true;
    /// Initialize default reward tier
    g_tiers[0] = tier0;

    Tier memory tier1;
    tier1._rate = uint256(1.10000000 * 10e7);
    tier1._price = 0.10 ether;
    tier1._enabled = true;
    /// Initialize reward tier 1
    g_tiers[1] = tier1;

    Tier memory tier2;
    tier2._rate = uint256(1.20000000 * 10e7);
    tier2._price = 0.20 ether;
    tier2._enabled = true;
    /// Initialize reward tier 2
    g_tiers[2] = tier2;

    Tier memory tier3;
    tier3._rate = uint256(1.30000000 * 10e7);
    tier3._price = 0.30 ether;
    tier3._enabled = true;
    /// Initialize reward tier 3
    g_tiers[3] = tier3;
  }

  /**
    * @dev Add a new reward tier to the contract for future proofing
    * @param _index of the new reward tier to add
    * @param _rate of the added reward tier
    * @param _price of the added reward tier
    * @param _enabled status of the added reward tier
    * @notice Test(s) Need rewrite
    */
  function addTier(uint256 _index, uint256 _rate, uint256 _price, bool _enabled)
  public
  onlyOwner
  whenNotPaused
  nonReentrant
  override
  returns(bool)
  {
    /// Validate calling address (msg.sender)
    require(msg.sender != address(0x0), 'Invalid {From}');
    /// Validate that tier does not already exist
    require(g_tiers[_index]._enabled == false, 'Tier exists');
    Tier memory newTier;
    /// Initialize structure to specified data
    newTier._rate = _rate;
    newTier._price = _price;
    newTier._enabled = _enabled;
    /// Insert tier into collection
    g_tiers[_index] = newTier;
    /// Emit event log to the block chain for future web3 use
    emit TierAdded(_index, _rate, _price, _enabled);
    /// Return success
    return true;
  }

  /**
    * @dev Update an existing reward tier with new values
    * @param _index of reward tier to update
    * @param _rate of the reward tier
    * @param _price of the reward tier
    * @param _enabled status of the reward tier
    * @return (bool) indicating success/failure
    * @notice Test(s) Need rewrite
    */
  function updateTier(uint256 _index, uint256 _rate, uint256 _price, bool _enabled)
  public
  onlyOwner
  whenNotPaused
  nonReentrant
  override
  returns(bool)
  {
    /// Validate calling address (msg.sender)
    require(msg.sender != address(0x0), 'Invalid {From}');
    require(g_tiers[_index]._rate > 0, 'Invalid tier');
    /// Validate that reward and ether values
    require(_rate > 0, 'Invalid rate');
    require(_price > 0, 'Invalid Price');
    /// Update the specified tier with specified data
    g_tiers[_index]._rate = _rate;
    g_tiers[_index]._price = _price;
    g_tiers[_index]._enabled = _enabled;
    /// Emit event log to the block chain for future web3 use
    emit TierUpdated(_index, _rate, _price, _enabled);
    /// Return success
    return true;
  }

  /**
    * @dev Remove an existing reward tier from list of tiers
    * @param _index of reward tier to remove
    * @notice Test(s) Need rewrite
    */
  function deleteTier(uint256 _index)
  public
  onlyOwner
  whenNotPaused
  nonReentrant
  override
  returns(bool)
  {
    /// Validate calling address (msg.sender)
    require(msg.sender != address(0x0), 'Invalid {From}');
    /// Validate tier delete does not delete system tiers 0-2
    require(_index >= 4, 'Invalid request');
    /// Zero out the spcified tier's data
    delete g_tiers[_index];
    /// Emit event log to the block chain for future web3 use
    emit TierDeleted(_index);
    /// Return success
    return true;
  }

  /**
    * @dev Get the rate value of specified tier
    * @param _index of tier to query
    * @return specified reward tier rate
    * @notice Test(s) Need rewrite
    */
  function getRate(uint256 _index)
  public
  whenNotPaused
  override
  returns(uint256)
  {
    /// Return reward rate for specified tier
    return g_tiers[_index]._rate;
  }

  /**
    * @dev Get price of tier
    * @param _index of tier to query
    * @return uint256 indicating tier price
    * @notice Test(s) Need rewrite
    */
  function getPrice(uint256 _index)
  public
  whenNotPaused
  override
  returns(uint256)
  {
    /// Return reward purchase price in ether for tier
    return g_tiers[_index]._price;
  }

  /**
    * @dev Get the enabled status of tier
    * @param _index of tier to query
    * @return bool indicating status of tier
    * @notice Test(s) Need rewrite
    */
  function getEnabled(uint256 _index)
  public
  whenNotPaused
  override
  returns(bool)
  {
    /// Return reward tier enabled status for specified tier
    return g_tiers[_index]._enabled;
  }

  /**
    * @dev Withdraw ether that has been sent directly to the contract
    * @return bool indicating withdraw success
    * @notice Test(s) Need rewrite
    */
  function withdrawEth()
  public
  onlyOwner
  whenNotPaused
  nonReentrant
  override
  returns(bool)
  {
    /// Validate calling address (msg.sender)
    require(msg.sender != address(0x0), 'Invalid {From}');
    /// Validate that this contract is storing ether
    require(address(this).balance >= 0, 'No ether');
    /// Transfer the ether to owner address
    msg.sender.transfer(address(this).balance);
    return true;
  }

  /**
    * @dev Event triggered when a reward tier is deleted
    * @param _index of tier to deleted
    */
  event TierDeleted(uint256 _index);

  /**
    * @dev Event triggered when a reward tier is updated
    * @param _index of the updated tier
    * @param _rate of updated tier
    * @param _price of updated tier
    * @param _enabled status of updated tier
    */
  event TierUpdated(uint256 _index, uint256 _rate, uint256 _price, bool _enabled);

  /**
    * @dev Event triggered when a new reward tier is added
    * @param _index of the tier added
    * @param _rate of added tier
    * @param _price of added tier
    * @param _enabled status of added tier
    */
  event TierAdded(uint256 _index, uint256 _rate, uint256 _price, bool _enabled);

}