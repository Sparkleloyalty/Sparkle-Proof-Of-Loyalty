pragma solidity 0.4.25;

import './ERC20.sol';
import './Ownable.sol';
import './ReentrancyGuard.sol';
import './SafeMath.sol';



contract loyaltySettings is Ownable, ReentrancyGuard, ERC20{

using SafeMath for uint256;

uint256 public currentMiners = 0;  // @dev a method to keep tract of current miners
address public loyaltyfaucet;      // @dev main token faucet address (for security reasons tokens are stored externally)
address public bonusAccount;       // @dev main address to recieve ether (for security reasons ether is forwarded externally)
address public tokenAddress;       // @dev Main smartcontract address
uint256 public loyaltyNeeded;      // @dev token amount required for loyalty contract (optional can be modified)
uint256 public timeLegnth;         // @dev exspected loyalty legnth (cannot be modified after deployment )  24 hrs = 86400 seconds
uint256 public basePercentage;     // @dev annual percentage calculation (30/100) / (365 + 1) =  0.00081967
uint256 private multiplierOne;     // @dev Loyalty multiplier standard rate
uint256 private multiplierTwo;     // @dev Loyalty multiplier 1st bonus rate
uint256 private multiplierThree;   // @dev Loyalty multiplier 2nd bonus rate
uint256 private etherAmount1;      // @dev price for bonus Loyalty multiplier 1
uint256 private etherAmount2;      // @dev price for bonus Loyalty multiplier 2

constructor(address _token, address _loyaltyfaucet, address _bonusAccount )
  Ownable()
  ERC20()
  ReentrancyGuard()
public {
  tokenAddress    =  _token;
  loyaltyfaucet   =  _loyaltyfaucet;
  bonusAccount    =  _bonusAccount;
  timeLegnth      =  60; 
  basePercentage  =  0.00081967 * 10e7; 
  multiplierOne   =  1.0000000 * 10e7;
  multiplierTwo   =  1.25000000 * 10e7;
  multiplierThree =  1.50000000 * 10e7;
  loyaltyNeeded   =  1000 * (10**8);
  etherAmount1    =  0.15 ether;
  etherAmount2    =  0.2 ether;
}

mapping (address =>  ProofOfLoyalty) public loyaltyTimestamp; //@dev map loyalty hodlers call data


struct ProofOfLoyalty{

   address _miner;
   bool    _loyaltyNeeded;
   bool    _rewardApproved;
   uint256 _value;
   uint256 _rewardAmount;
   uint256 _loyaltyDays;
   uint256 _multiplier;
   uint256 _depositTime;
   uint256 _rewardTime;

}



/**
* @dev user can deposit 0.5 eth to activate loyalty _multiplier x1.25
*/

function loyaltyBonus1() external nonReentrant() payable returns (bool multiplierAdded) {
ProofOfLoyalty storage POL = loyaltyTimestamp[msg.sender];
  require (msg.sender == POL._miner,'miner address does not match sender address');
  require (multiplierTwo == 1.25000000 * 10e7,'multiplier must not be tanpered with');
  require (msg.value >= etherAmount1,'Please send the correct amount to enter loyalty bonus');
if (POL._miner == msg.sender){
  POL._multiplier = multiplierTwo;
  address(bonusAccount).transfer(etherAmount1);
}
else{
  return false;
 }
}


/**
* @dev user can deposit 1 eth to activate loyalty _multiplier x1.50
*/

function loyaltyBonus2() external nonReentrant() payable returns (bool multiplierAdded){
ProofOfLoyalty storage POL = loyaltyTimestamp[msg.sender];
  require (msg.sender == POL._miner,'miner address does not match sender address');
  require (multiplierThree == 1.50000000 * 10e7,'multiplier must not be tanpered with');
  require (msg.value >= etherAmount2,'Please send the correct amount to enter loyalty bonus');
if (POL._miner == msg.sender){
  POL._multiplier = multiplierThree;
  address(bonusAccount).transfer(etherAmount2);
 }
 else {
  return false;
 }
}



/**
* @dev A method for loyalty hodlers to verify block loyalty
*/

function verifyBlockLoyalty () external returns (bool verified) {
ProofOfLoyalty storage POL = loyaltyTimestamp[msg.sender];
  require(POL._loyaltyNeeded == true, 'User is not a loyalty holder');
  require(block.timestamp > POL._rewardTime,'Users reward has not yet been approved');
  require(msg.sender == POL._miner,'Users has not deposited tokens');
if (block.timestamp > POL._rewardTime) {
  POL._rewardApproved = true;
  dailyCounter();
}
if (block.timestamp < POL._rewardTime) {
  revert("Loyalty age not accepted");
}
else{
  return false;
 }
}



/**
* @dev internal function to count days since user last reward
*/

function dailyCounter () internal returns (uint256) {
ProofOfLoyalty storage POL = loyaltyTimestamp[msg.sender];
  require (timeLegnth == 60, 'loyalty timeLegnths do not match');
  require (POL._loyaltyNeeded == true, 'User is not a loyalty holder');
  require (msg.sender == POL._miner,'miner address does not match sender address');
if (msg.sender == POL._miner){
  POL._loyaltyDays = (block.timestamp-POL._rewardTime)/timeLegnth;
}
if (POL._loyaltyDays < 1){
  POL._loyaltyDays = 0;
}
else{
  return POL._loyaltyDays;
 }
}

/**
* @dev A method for loyalty hodlers to claim loyalty reward daily and will not allow users to claim twice
* in the event a user can claim twice in one day user will be returned the same value as before (0 *_value) + _value = _value
*/

function claimReward () external returns (bool transferComplete) {
ProofOfLoyalty storage POL = loyaltyTimestamp[msg.sender];
  require (timeLegnth == 60, 'loyalty timeLegnths do not match');
  require (basePercentage == 0.00081967 * 10e7,'Base percentage is not allowed to be changed');
  require (POL._loyaltyNeeded == true, 'Please make a deposit before attempting to claim your reward');
  require (POL._loyaltyDays >= 1,'User must wait the appropiate time before claiming loyalty');
  require (POL._loyaltyDays > 0,'User cannot claim loyalty reward twice in one day');
  require (msg.sender == POL._miner,'miner address does not match sender address');
  require (POL._rewardApproved = true,"Users reward has not yet been approved");
if (POL._loyaltyDays >= 1) {
  POL._rewardAmount = ((POL._rewardAmount+(( basePercentage * POL._value)*POL._multiplier)*POL._loyaltyDays)/10e7)/10e7 + POL._rewardAmount;
  POL._depositTime = block.timestamp;
  POL._rewardTime = timeLegnth+block.timestamp;
}
if (POL._rewardApproved = true){
  POL._loyaltyDays = 0;
  POL._rewardApproved = false;
}
else {
  return false;
 }
}

/**
* @dev allowsloyalty hodler to withdraw tokens stored in the account
* for daily reward structure, user must deposit tokens in order to claim rewards
*/

function withdrawLoyalty () external nonReentrant() returns (bool withdrawComplete){
ProofOfLoyalty storage POL = loyaltyTimestamp[msg.sender];
  require(tokenAddress == 0x9bb1E675CF9D585Cf615382959D74C337d50337F,'Please use the correct token');
  require (POL._loyaltyNeeded == true, 'Please make a deposit before attempting a withdraw');
  require (POL._value == POL._value, 'Please user the same address used for loyalty deposit');
  require (POL._rewardAmount == POL._rewardAmount, 'Please use the same address used for loyalty deposit');
  require (msg.sender == POL._miner,'miner address does not match sender address');
if (msg.sender == POL._miner) {
  currentMiners -= 1;
  ERC20(tokenAddress).transferFrom(loyaltyfaucet,POL._miner, POL._rewardAmount);
  ERC20(tokenAddress).transfer(POL._miner,POL._value);
  delete loyaltyTimestamp[msg.sender];
}
else{
  return false;
 }
}

/**
* @dev depositloyalty allows users to deposit tokens and partisipate in POL
* bi weekly reward structure, user must deposit tokens in order to claim rewards
*/

function depositLoyalty( address _miner,  uint256 _value) external nonReentrant() returns (bool LoyaltyAccepted){
ProofOfLoyalty storage POL = loyaltyTimestamp[msg.sender];
  require (timeLegnth == 60, 'loyalty timeLegnths do not match');
  require (multiplierOne == 1.0000000 * 10e7,'multiplier must not be tampered with');
  require(loyaltyNeeded == 1000 * (10**8),'User did not send the minimum loyalty amount');
  require(tokenAddress == 0x9bb1E675CF9D585Cf615382959D74C337d50337F,'Please use the correct token');
  require(_value >= loyaltyNeeded,'User did not send the minimum loyalty amount');
if ( _value >= loyaltyNeeded) {
  uint256 _currentMiners = currentMiners;
  _currentMiners += 1;
  POL._miner = _miner;
  POL._loyaltyNeeded = true;
  POL._rewardApproved = false; 
  POL._value = POL._value + _value; 
  POL._rewardAmount = 0;
  POL._loyaltyDays = 0;
  POL._multiplier = multiplierOne;
  POL._depositTime = block.timestamp;
  POL._rewardTime = timeLegnth+block.timestamp;
  ERC20(tokenAddress).transferFrom(msg.sender, this, _value);
}
else {
  revert ('Unexspected error ');
  return false;
     }
   }
}