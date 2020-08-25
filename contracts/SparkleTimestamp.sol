// SPDX-License-Identifier: UNLICENSED

/// SWC-103:  Floating Pragma
pragma solidity 0.6.12;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import './ISparkleTimestamp.sol';

/**
 * @dev Sparkle Timestamp Contract
 * @author SparkleMobile Inc. (c) 2019-2020
 */
contract SparkleTimestamp is ISparkleTimestamp, Ownable, Pausable, ReentrancyGuard {
  /**
   * @dev Ensure math safety through SafeMath
   */
  using SafeMath for uint256;

  /**
   * @dev Timestamp object for tacking block.timestamp ooc(out-of-contract)
   * @param _address Address of the owner address of this record
   * @param _joined block.timestamp of initial joining time
   * @param _deposit block.timestamp of reward address' deposit (uint256)
   * @param _reward block.timestamp + loyaltyTimePeriod precalculation (uint256)
   */
  struct Timestamp {
    address _address;
    uint256 _joined;
    uint256 _deposit;
    uint256 _reward;
  }

  /**
   * @dev Internal address for authorized loyalty contract
   */
  address private contractAddress;

  /**
   * @dev Internal time period of reward maturity for all address'
   */
  uint256 private timePeriod;

  /**
   * @dev Internal loyalty timestamp mapping to authorized calling loyalty contracts
   */
  mapping(address => mapping(address => Timestamp)) private g_timestamps;

  /**
   * @dev SparkleTimestamp contract .cTor
   */
  constructor()
  public
  Ownable()
  Pausable()
  ReentrancyGuard()
  {
    /// Initialize contract address to 0x0
    contractAddress = address(0x0);
    /// Initilize time period to 24 hours (86400 seconds)
    timePeriod = 60 * 60 * 24;
  }

  /**
   * @dev Add new reward timestamp for address
   * @param _rewardAddress being added to timestamp collection
   */
  function addTimestamp(address _rewardAddress)
  external
  whenNotPaused
  nonReentrant
  override
  returns(bool)
  {
    /// Validate calling address (msg.sender)
    require(msg.sender != address(0x0), 'Invalid {From}a');
    /// Validate caller is valid controller contract
    require(msg.sender == address(contractAddress), 'Unauthorized {From}');
    /// Validate specified address (_rewardAddress)
    require(_rewardAddress != address(0x0), 'Invalid reward address');
    /// Validate specified address does not have a timestamp
    require(g_timestamps[msg.sender][_rewardAddress]._address == address(0x0), 'Timestamp exists');
    /// Initialize timestamp structure with loyalty users data
    g_timestamps[msg.sender][_rewardAddress]._address = address(_rewardAddress);
    g_timestamps[msg.sender][_rewardAddress]._deposit = block.timestamp;
    g_timestamps[msg.sender][_rewardAddress]._joined = block.timestamp;
    /// Calculate the time in the future reward will mature
    g_timestamps[msg.sender][_rewardAddress]._reward = timePeriod.add(block.timestamp);
    /// Emit event log to the block chain for future web3 use
    emit TimestampAdded(_rewardAddress);
    /// Return success
    return true;
  }

  /**
   * @dev Reset timestamp maturity for loyalty address
   * @param _rewardAddress to have reward period reset
   */
  function resetTimestamp(address _rewardAddress)
  external
  whenNotPaused
  nonReentrant
  override
  returns(bool)
  {
    /// Validate calling address (msg.sender)
    require(msg.sender != address(0x0), 'Invalid {from}b');
    require(msg.sender == address(contractAddress), 'Unauthorized {From}');
    /// Validate specified address (_rewardAddress)
    require(_rewardAddress != address(0x0), 'Invalid reward address');
    /// Validate specified address has a timestamp
    require(g_timestamps[msg.sender][_rewardAddress]._address == address(_rewardAddress), 'Invalid timestamp');
    /// Re-initialize timestamp structure with updated time data
    g_timestamps[msg.sender][_rewardAddress]._deposit = block.timestamp;
    g_timestamps[msg.sender][_rewardAddress]._reward = uint256(block.timestamp).add(timePeriod);
    /// Return success
    return true;
  }

  /**
   * @dev Zero/delete existing loyalty timestamp entry
   * @param _rewardAddress being requested for timestamp deletion
   * @notice Test(s) not passed
   */
  function deleteTimestamp(address _rewardAddress)
  external
  whenNotPaused
  nonReentrant
  override
  returns(bool)
  {
    /// Validate calling address (msg.sender)
    require(msg.sender != address(0), 'Invalid {from}c');
    /// Validate caller is valid controller contract
    require(msg.sender == address(contractAddress), 'Unauthorized {From}');
    /// Validate specified address (_rewardAddress)
    require(_rewardAddress != address(0), "Invalid reward address ");
    /// Validate specified address has a timestamp
    if(g_timestamps[msg.sender][_rewardAddress]._address != address(_rewardAddress)) {
      emit TimestampDeleted( false );
      return false;
    }

    // Zero out address as delete does nothing with structure elements
    Timestamp storage ts = g_timestamps[msg.sender][_rewardAddress];
    ts._address = address(0x0);
    ts._deposit = 0;
    ts._reward = 0;
    /// Return success
    emit TimestampDeleted( true );
    return true;
  }

  /**
   * @dev Get address confirmation for loyalty address
   * @param _rewardAddress being queried for address information
   */
  function getAddress(address _rewardAddress)
  external
  whenNotPaused
  override
  returns(address)
  {
    /// Validate calling address (msg.sender)
    require(msg.sender != address(0), 'Invalid {from}d');
    /// Validate caller is valid controller contract
    require(msg.sender == address(contractAddress), 'Unauthorized {From}');
    /// Validate specified address (_rewardAddress)
    require(_rewardAddress != address(0), 'Invalid reward address');
    /// Validate specified address has a timestamp
    require(g_timestamps[msg.sender][_rewardAddress]._address == address(_rewardAddress), 'No timestamp b');
    /// Return address indicating success
    return address(g_timestamps[msg.sender][_rewardAddress]._address);
  }

  /**
   * @dev Get timestamp of initial joined timestamp for loyalty address
   * @param _rewardAddress being queried for timestamp information
   */
  function getJoinedTimestamp(address _rewardAddress)
  external
  whenNotPaused
  override
  returns(uint256)
  {
    /// Validate calling address (msg.sender)
    require(msg.sender != address(0), 'Invalid {from}e');
    /// Validate caller is valid controller contract
    require(msg.sender == address(contractAddress), 'Unauthorized {From}');
    /// Validate specified address (_rewardAddress)
    require(_rewardAddress != address(0), 'Invalid reward address');
    /// Validate specified address has a timestamp
    require(g_timestamps[msg.sender][_rewardAddress]._address == address(_rewardAddress), 'No timestamp c');
    /// Return deposit timestamp indicating success
    return g_timestamps[msg.sender][_rewardAddress]._joined;
  }

  /**
   * @dev Get timestamp of last deposit for loyalty address
   * @param _rewardAddress being queried for timestamp information
   */
  function getDepositTimestamp(address _rewardAddress)
  external
  whenNotPaused
  override
  returns(uint256)
  {
    /// Validate calling address (msg.sender)
    require(msg.sender != address(0), 'Invalid {from}e');
    /// Validate caller is valid controller contract
    require(msg.sender == address(contractAddress), 'Unauthorized {From}');
    /// Validate specified address (_rewardAddress)
    require(_rewardAddress != address(0), 'Invalid reward address');
    /// Validate specified address has a timestamp
    require(g_timestamps[msg.sender][_rewardAddress]._address == address(_rewardAddress), 'No timestamp d');
    /// Return deposit timestamp indicating success
    return g_timestamps[msg.sender][_rewardAddress]._deposit;
  }

  /**
   * @dev Get timestamp of reward maturity for loyalty address
   * @param _rewardAddress being queried for timestamp information
   */
  function getRewardTimestamp(address _rewardAddress)
  external
  whenNotPaused
  override
  returns(uint256)
  {
    /// Validate calling address (msg.sender)
    require(msg.sender != address(0), 'Invalid {from}f');
    /// Validate caller is valid controller contract
    require(msg.sender == address(contractAddress), 'Unauthorized {From}');
    /// Validate specified address (_rewardAddress)
    require(_rewardAddress != address(0), 'Invalid reward address');
    /// Return reward timestamp indicating success
    return g_timestamps[msg.sender][_rewardAddress]._reward;
  }


  /**
   * @dev Determine if address specified has a timestamp record
   * @param _rewardAddress being queried for timestamp existance
   */
  function hasTimestamp(address _rewardAddress)
  external
  whenNotPaused
  override
  returns(bool)
  {
    /// Validate calling address (msg.sender)
    require(msg.sender != address(0), 'Invalid {from}g');
    /// Validate caller is valid controller contract
    require(msg.sender == address(contractAddress), 'Unauthorized {From}');
    /// Validate specified address (_rewardAddress)
    require(_rewardAddress != address(0), 'Invalid reward address');
    /// Determine if timestamp record matches reward address
    // if(g_timestamps[msg.sender][_rewardAddress]._address == address(_rewardAddress)) {
    //   /// yes, then return success
    //   return true;
    // }
    if(g_timestamps[msg.sender][_rewardAddress]._address != address(_rewardAddress))
    {
      emit TimestampHasTimestamp(false);
      return false;
    }

    /// Return success
    emit TimestampHasTimestamp(true);
    return true;
  }

  /**
   * @dev Calculate time remaining in seconds until this address' reward matures
   * @param _rewardAddress to query remaining time before reward matures
   */
  function getTimeRemaining(address _rewardAddress)
  external
  whenNotPaused
  override
  returns(uint256, bool, uint256)
  {
    /// Validate calling address (msg.sender)
    require(msg.sender != address(0), 'Invalid {from}h');
    /// Validate caller is valid controller contract
    require(msg.sender == address(contractAddress), 'Unauthorized {From}');
    /// Validate specified address (_rewardAddress)
    require(_rewardAddress != address(0), 'Invalid reward address');
    /// Validate specified address has a timestamp
    require(g_timestamps[msg.sender][_rewardAddress]._address == address(_rewardAddress), 'No timestamp f');
    /// Deterimine if reward address timestamp record has matured
    if(g_timestamps[msg.sender][_rewardAddress]._reward > block.timestamp) {
      /// No, then return indicating remaining time and false to indicate failure
      return (g_timestamps[msg.sender][_rewardAddress]._reward - block.timestamp, false, g_timestamps[msg.sender][_rewardAddress]._deposit);
    }

    /// Return indicating time since reward maturing and true to indicate success
    return (block.timestamp - g_timestamps[msg.sender][_rewardAddress]._reward, true, g_timestamps[msg.sender][_rewardAddress]._deposit);
  }

    /**
   * @dev Determine if reward is mature for  address
   * @param _rewardAddress Address requesting addition in to loyalty timestamp collection
   */
  function isRewardReady(address _rewardAddress)
  external
  whenNotPaused
  override
  returns(bool)
  {
    /// Validate calling address (msg.sender)
    require(msg.sender != address(0), 'Invalid {from}i');
    /// Validate caller is valid controller contract
    require(msg.sender == address(contractAddress), 'Unauthorized {From}');
    /// Validate specified address (_rewardAddress)
    require(_rewardAddress != address(0), 'Invalid reward address');
    /// Validate specified address has a timestamp
    require(g_timestamps[msg.sender][_rewardAddress]._address == address(_rewardAddress), 'No timestamp g');
    /// Deterimine if reward address timestamp record has matured
    if(g_timestamps[msg.sender][_rewardAddress]._reward > block.timestamp) {
      /// No, then return false to indicate failure
      return false;
    }

    /// Return success
    return true;
  }

  /**
   * @dev Change the stored loyalty controller contract address
   * @param _newAddress of new loyalty controller contract address
   */
  function setContractAddress(address _newAddress)
  external
  onlyOwner
  nonReentrant
  override
  {
    /// Validate calling address (msg.sender)
    require(msg.sender != address(0), 'Invalid {from}j');
    /// Validate specified address (_newAddress)
    require(_newAddress != address(0), 'Invalid contract address');
    address currentAddress = contractAddress;
    /// Set current address to new controller contract address
    contractAddress = _newAddress;
    /// Emit event log to the block chain for future web3 use
    emit ContractAddressChanged(currentAddress, _newAddress);
  }

  /**
   * @dev Return the stored authorized controller address
   * @return Address of loyalty controller contract
   */
  function getContractAddress()
  external
  whenNotPaused
  override
  returns(address)
  {
    /// Return current controller contract address
    return address(contractAddress);
  }

  /**
   * @dev Change the stored loyalty time period
   * @param _newTimePeriod of new reward period (in seconds)
   */
  function setTimePeriod(uint256 _newTimePeriod)
  external
  onlyOwner
  nonReentrant
  override
  {
    /// Validate calling address (msg.sender)
    require(msg.sender != address(0), 'Invalid {from}k');
    /// Validate specified time period
    require(_newTimePeriod >= 60 seconds, 'Time period < 60s');
    uint256 currentTimePeriod = timePeriod;
    timePeriod = _newTimePeriod;
    /// Emit event log to the block chain for future web3 use
    emit TimePeriodChanged(currentTimePeriod, _newTimePeriod);
  }

  /**
   * @dev Return the current loyalty timer period
   * @return Current stored value of loyalty time period
   */
  function getTimePeriod()
  external
  whenNotPaused
  override
  returns(uint256)
  {
    /// Return current time period
    return timePeriod;
  }

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
	event TimestampDeleted( bool indexed _timestampDeleted );

  /**
   * @dev Event signal: Timestamp for address was reset
   */
  event TimestampReset(address _rewardAddress);

  /**
   * @dev Event signal: Current hasTimestamp value
   */
  event TimestampHasTimestamp(bool _hasTimestamp);

}