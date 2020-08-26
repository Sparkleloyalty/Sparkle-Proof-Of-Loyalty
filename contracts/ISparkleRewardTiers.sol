// SPDX-License-Identifier: UNLICENSED

/// SWC-103:  Floating Pragma
pragma solidity 0.6.12;

// import '../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol';
// import '../node_modules/openzeppelin-solidity/contracts/ownership/Ownable.sol';
// import '../node_modules/openzeppelin-solidity/contracts/lifecycle/Pausable.sol';
// import '../node_modules/openzeppelin-solidity/contracts/utils/ReentrancyGuard.sol';

/**
  * @title A contract for managing reward tiers
  * @author SparkleLoyalty Inc. (c) 2019-2020
  */
// interface ISparkleRewardTiers is Ownable, Pausable, ReentrancyGuard {
interface ISparkleRewardTiers {

  /**
    * @dev Add a new reward tier to the contract for future proofing
    * @param _index of the new reward tier to add
    * @param _rate of the added reward tier
    * @param _price of the added reward tier
    * @param _enabled status of the added reward tier
    * @notice Test(s) Need rewrite
    */
  function addTier(uint256 _index, uint256 _rate, uint256 _price, bool _enabled)
  external
  // view
  // onlyOwner
  // whenNotPaused
  // nonReentrant
  returns(bool);

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
  external
  // view
  // onlyOwner
  // whenNotPaused
  // nonReentrant
  returns(bool);

  /**
    * @dev Remove an existing reward tier from list of tiers
    * @param _index of reward tier to remove
    * @notice Test(s) Need rewrite
    */
  function deleteTier(uint256 _index)
  external
  // view
  // onlyOwner
  // whenNotPaused
  // nonReentrant
  returns(bool);

  /**
    * @dev Get the rate value of specified tier
    * @param _index of tier to query
    * @return specified reward tier rate
    * @notice Test(s) Need rewrite
    */
  function getRate(uint256 _index)
  external
  // view
  // whenNotPaused
  returns(uint256);

  /**
    * @dev Get price of tier
    * @param _index of tier to query
    * @return uint256 indicating tier price
    * @notice Test(s) Need rewrite
    */
  function getPrice(uint256 _index)
  external
  // view
  // whenNotPaused
  returns(uint256);

  /**
    * @dev Get the enabled status of tier
    * @param _index of tier to query
    * @return bool indicating status of tier
    * @notice Test(s) Need rewrite
    */
  function getEnabled(uint256 _index)
  external
  // view
  // whenNotPaused
  returns(bool);

  /**
    * @dev Withdraw ether that has been sent directly to the contract
    * @return bool indicating withdraw success
    * @notice Test(s) Need rewrite
    */
  function withdrawEth()
  external
  // onlyOwner
  // whenNotPaused
  // nonReentrant
  returns(bool);

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