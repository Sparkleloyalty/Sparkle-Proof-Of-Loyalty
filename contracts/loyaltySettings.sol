pragma solidity 0.4.25;

import './Sparkle.sol';
import './ReentrancyGuard.sol';



contract loyaltySettings is Ownable, ReentrancyGuard{

constructor() ReentrancyGuard() public {}

using SafeMath for uint256;

uint256 private currentMiners = 0;  // @dev a method to keep tract of current miners
uint256 private loyaltyRequired = 1000 * (10**8); // @dev token amount required for loyalty contract (optional can be modified)
uint256 private loyaltyNeeded = loyaltyRequired; // @dev modify required loyalty
uint256 private timeLegnth = 60; //@dev exspected loyalty legnth (optional can be modified by contract owner only )  24 hrs = 86400 seconds
uint256 private _timeLegnth = timeLegnth;
bool private _rewardApproved = false; //@dev set bool values false by default
bool private _loyaltyNeeded = false; //@dev set bool values false by default
address private loyaltyfaucet; //@dev main token faucet address (for security reasons tokens are stored externally)
address private bonusAccount;  //@dev main address to recieve ether (for security reasons ether is forwarded externally)
uint256 private _basePercentage = 0.00081967 * 10e7; // @dev annual percentage calculation (30/100) / (365 + 1) =  0.00081967
uint256 private _multiplier = 1.0000000 * 10e7;
uint256 private a = 1.25000000 * 10e7;
uint256 private b = 1.50000000 * 10e7;

mapping (address =>  ProofOfLoyalty) private loyaltyTimestamp; //@dev map loyalty hodlers call data


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


mapping (uint256 =>  publicloyaltyList ) private LoyaltyList;   // @dev mapping public loyalty list call data

struct publicloyaltyList {

  uint256 _value;
  uint256 _depositTime;
  uint256 _rewardTime;

}

/**
* @dev define events which take place by openzepplin SparkleToken.sol
* to communicate with functions inside this contract (This may not be
* required depending on the development of the external token)
*/

event Transfer(
    address indexed _from,
    address indexed _to,
    uint256 _value
);

event Approval(
    address indexed _owner,
    address indexed _spender,
    uint256 _value
);


/**
* @dev Adjust Minimum Block Age To Respected Time Fram

function adjustloyaltyAge (uint256 _timeLegnth) external onlyOwner returns (uint256) {
timeLegnth = _timeLegnth;
return _timeLegnth;
}

*/

/**
* @dev Contract owner sets ProofOfLoyalty token faucet address
*/

function setfaucetAddress (address _loyaltyfaucet) external onlyOwner returns(address){
loyaltyfaucet = _loyaltyfaucet;
return _loyaltyfaucet;
}

/**
* @dev Contract owner sets ProofOfLoyalty bonus deposit address
*/

function setbonusAccount (address _bonusAccount) external onlyOwner returns(address){
bonusAccount = _bonusAccount;
return _bonusAccount;
}


/**
* @dev user can deposit 0.5 eth to activate loyalty _multiplier x1.25
*/

function loyaltyBonus1() nonReentrant() external payable returns (bool multiplierAdded){
ProofOfLoyalty storage POL = loyaltyTimestamp[msg.sender];
uint256 etherAmount1 = 0.15 ether; //@dev multiplier price for bouns 1
require (msg.sender == POL._miner,'miner address does not match sender address');
require (msg.value >= etherAmount1,'Please send the correct amount to enter loyalty bonus');
if (POL._miner == msg.sender){
  POL._multiplier = a;
  emit Transfer (this, bonusAccount, msg.value);
  address(this).transfer(etherAmount1);
}
else{
  return false;
 }
}


/**
* @dev user can deposit 1 eth to activate loyalty _multiplier x1.50
*/

function loyaltyBonus2() nonReentrant() external payable returns (bool multiplierAdded){
ProofOfLoyalty storage POL = loyaltyTimestamp[msg.sender];
uint256 etherAmount2 = 0.2 ether;  //@dev multiplier price for bouns 2
require (msg.sender == POL._miner,'miner address does not match sender address');
require (msg.value >= etherAmount2,'Please send the correct amount to enter loyalty bonus');
if (POL._miner == msg.sender){
  POL._multiplier = b;
  emit Transfer (this, bonusAccount, msg.value);
  address(this).transfer(etherAmount2);
 }
 else {
  return false;
 }
}



/**
* @dev A method for loyalty hodlers to verify block loyalty
*/

function verifyBlockLoyalty() external returns (bool verified) {
ProofOfLoyalty storage POL = loyaltyTimestamp[msg.sender];
require(POL._loyaltyNeeded = true, 'User is not a loyalty holder');
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
require (POL._loyaltyDays >= 1,'User must wait the appropiate time before claiming loyalty');
require (POL._loyaltyDays > 0,'User cannot claim loyalty reward twice in one day');
require (msg.sender == POL._miner,'miner address does not match sender address');
require (POL._rewardApproved = true,"Users reward has not yet been approved");
if (POL._loyaltyDays >= 1) {
  POL._rewardAmount = ((POL._rewardAmount+(( _basePercentage * POL._value)*POL._multiplier)*POL._loyaltyDays)/10e7)/10e7 + POL._rewardAmount;
  POL._depositTime = block.timestamp;
  POL._rewardTime = timeLegnth+block.timestamp;
}
if (POL._rewardApproved = true){
  POL._loyaltyDays = 0;
  POL._rewardApproved = _rewardApproved;
}
else {
  return false;
 }
}

/**
* @dev allowsloyalty hodler to withdraw tokens stored in the account
* for daily reward structure, user must deposit tokens in order to claim rewards
*/

function withdrawLoyalty() nonReentrant() external returns (bool withdrawComplete){
Sparkle token = Sparkle(0x9bb1E675CF9D585Cf615382959D74C337d50337F);
ProofOfLoyalty storage POL = loyaltyTimestamp[msg.sender];
require (POL._value == POL._value, 'Please user the same address used for loyalty deposit');
require (POL._rewardAmount == POL._rewardAmount, 'Please user the same address used for loyalty deposit');
require (msg.sender == POL._miner,'miner address does not match sender address');
if (msg.sender == POL._miner) {
  currentMiners -= 1;
  delete loyaltyTimestamp[msg.sender];
  delete POL._loyaltyNeeded;
  delete POL._rewardApproved;
  token.transferFrom(loyaltyfaucet,POL._miner, POL._rewardAmount);
  token.transfer(POL._miner,POL._value);
}
else{
  return false;
 }
}

/**
* @dev depositloyalty allows users to deposit tokens and partisipate in POL
* bi weekly reward structure, user must deposit tokens in order to claim rewards
*/

function depositLoyalty( address _miner,  uint256 _value) nonReentrant() external returns (bool LoyaltyAccepted){
Sparkle token = Sparkle (0x9bb1E675CF9D585Cf615382959D74C337d50337F);
require(_value >= loyaltyNeeded,'User did not send the minimum loyalty amount');
require(msg.sender == _miner,'Senders address does not match the miner address');
if ( _value >= loyaltyNeeded) {
  uint256 _currentMiners = currentMiners;
  _currentMiners += 1;
  LoyaltyList[_currentMiners] = publicloyaltyList(_value,block.timestamp,timeLegnth+block.timestamp);
  loyaltyTimestamp[msg.sender] = ProofOfLoyalty(_miner, true, _rewardApproved, _value, 0, 0,_multiplier,block.timestamp,timeLegnth+block.timestamp);
  token.transferFrom(msg.sender, this, _value);
}
else {
  return false;
     }
   }
}
