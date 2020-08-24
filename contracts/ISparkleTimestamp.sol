/// SWC-103:  Floating Pragma
pragma solidity 0.4.25;

// import "../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";
// import "../node_modules/openzeppelin-solidity/contracts/ownership/Ownable.sol";
// import "../node_modules/openzeppelin-solidity/contracts/lifecycle/Pausable.sol";
// import "../node_modules/openzeppelin-solidity/contracts/utils/ReentrancyGuard.sol";

/**
 * @dev Sparkle Timestamp Contract
 * @author SparkleMobile Inc. (c) 2019-2020
 */
interface ISparkleTimestamp {

  /**
   * @dev Add new reward timestamp for address
   * @param _rewardAddress being added to timestamp collection
   */
  function addTimestamp(address _rewardAddress)
  external
  returns(bool);

  /**
   * @dev Reset timestamp maturity for loyalty address
   * @param _rewardAddress to have reward period reset
   */
  function resetTimestamp(address _rewardAddress)
  external
  returns(bool);

  /**
   * @dev Zero/delete existing loyalty timestamp entry
   * @param _rewardAddress being requested for timestamp deletion
   * @notice Test(s) not passed
   */
  function deleteTimestamp(address _rewardAddress)
  external
  returns(bool);

  /**
   * @dev Get address confirmation for loyalty address
   * @param _rewardAddress being queried for address information
   */
  function getAddress(address _rewardAddress)
  external
  view
  returns(address);

  /**
   * @dev Get timestamp of initial joined timestamp for loyalty address
   * @param _rewardAddress being queried for timestamp information
   */
  function getJoinedTimestamp(address _rewardAddress)
  external
  view
  returns(uint256);

  /**
   * @dev Get timestamp of last deposit for loyalty address
   * @param _rewardAddress being queried for timestamp information
   */
  function getDepositTimestamp(address _rewardAddress)
  external
  view
  returns(uint256);

  /**
   * @dev Get timestamp of reward maturity for loyalty address
   * @param _rewardAddress being queried for timestamp information
   */
  function getRewardTimestamp(address _rewardAddress)
  external
  view
  returns(uint256);

  /**
   * @dev Determine if address specified has a timestamp record
   * @param _rewardAddress being queried for timestamp existance
   */
  function hasTimestamp(address _rewardAddress)
  external
  view
  returns(bool);

  /**
   * @dev Calculate time remaining in seconds until this address' reward matures
   * @param _rewardAddress to query remaining time before reward matures
   */
  function getTimeRemaining(address _rewardAddress)
  external
  view
  returns(uint256, bool, uint256);

  /**
   * @dev Determine if reward is mature for  address
   * @param _rewardAddress Address requesting addition in to loyalty timestamp collection
   */
  function isRewardReady(address _rewardAddress)
  external
  view
  returns(bool);

  /**
   * @dev Change the stored loyalty controller contract address
   * @param _newAddress of new loyalty controller contract address
   */
  function setContractAddress(address _newAddress)
  external;

  /**
   * @dev Return the stored authorized controller address
   * @return Address of loyalty controller contract
   */
  function getContractAddress()
  external
  view
  returns(address);

  /**
   * @dev Change the stored loyalty time period
   * @param _newTimePeriod of new reward period (in seconds)
   */
  function setTimePeriod(uint256 _newTimePeriod)
  external;

  /**
   * @dev Return the current loyalty timer period
   * @return Current stored value of loyalty time period
   */
  function getTimePeriod()
  external
  view
  returns(uint256);

	/**
	 * @dev Event signal: Reset timestamp
	 */
  event ResetTimestamp(address _rewardAddress);

	/**
	 * @dev Event signal: Loyalty contract address waws changed
	 */
	event ContractAddressChanged(address indexed _previousAddress, address indexed _newAddress);

	/**
	 * @dev Event signal: Loyalty reward time period was changed
	 */
	event TimePeriodChanged( uint256 indexed _previousTimePeriod, uint256 indexed _newTimePeriod);

	/**
	 * @dev Event signal: Loyalty reward timestamp was added
	 */
	event TimestampAdded( address indexed _newTimestampAddress );

	/**
	 * @dev Event signal: Loyalty reward timestamp was removed
	 */
	event TimestampDeleted( address indexed _newTimestampAddress );

  /**
   * @dev Event signal: Timestamp for address was reset
   */
  event TimestampReset(address _rewardAddress);

}