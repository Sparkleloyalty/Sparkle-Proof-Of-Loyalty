pragma solidity 0.4.25;


import './ReentrancyGuard.sol';
import './SparkleToken.sol';


contract loyaltySettings is Ownable, ReentrancyGuard, ERC20{

using SafeMath for uint256;

uint256 public currentMiners = 0;  // @dev a method to keep tract of current miners
address public loyaltyfaucet; //@dev main token faucet address (for security reasons tokens are stored externally)


constructor()
Ownable()
ERC20()
ReentrancyGuard()
public {}

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

mapping (address =>  storageDump) public timestampRemoved; //@dev map timestamp removal

struct storageDump{

   bool _timestampRemoved;
}

/**
* @dev Contract owner sets ProofOfLoyalty token faucet address
*/

function setfaucetAddress (address _loyaltyfaucet) external onlyOwner returns(address){
loyaltyfaucet = _loyaltyfaucet;
return _loyaltyfaucet;
}




/**
* @dev user can deposit 0.5 eth to activate loyalty _multiplier x1.25
*/

function loyaltyBonus1() external nonReentrant() payable returns (bool multiplierAdded) {
ProofOfLoyalty storage POL = loyaltyTimestamp[msg.sender];
uint256 a = 1.25000000 * 10e7;
uint256 etherAmount1 = 0.15 ether;  //@dev multiplier price for bouns 1
address bonusAccount = 0x0925f5c56A59f0A4B5F8Ae4812b68bBdB8CC7Ad0;  //@dev main address to recieve ether
  require (bonusAccount == 0x0925f5c56A59f0A4B5F8Ae4812b68bBdB8CC7Ad0,'bonusAccount address not accepted');
  require (msg.sender == POL._miner,'miner address does not match sender address');
  require (a == 1.25000000 * 10e7,'multiplier must not be tanpered with');
  require (msg.value >= etherAmount1,'Please send the correct amount to enter loyalty bonus');
if (POL._miner == msg.sender){
  POL._multiplier = a;
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
uint256 b = 1.50000000 * 10e7;
uint256 etherAmount2 = 0.2 ether;  //@dev multiplier price for bouns 2
address bonusAccount = 0x0925f5c56A59f0A4B5F8Ae4812b68bBdB8CC7Ad0;  //@dev main address to recieve ether
  require (bonusAccount == 0x0925f5c56A59f0A4B5F8Ae4812b68bBdB8CC7Ad0,'bonusAccount address not accepted');
  require (msg.sender == POL._miner,'miner address does not match sender address');
  require (b == 1.50000000 * 10e7,'multiplier must not be tanpered with');
  require (msg.value >= etherAmount2,'Please send the correct amount to enter loyalty bonus');
if (POL._miner == msg.sender){
  POL._multiplier = b;
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
uint256 timeLegnth = 60; //@dev exspected loyalty legnth (optional can be modified by contract owner only )  24 hrs = 86400 seconds
uint256 _timeLegnth = timeLegnth;
  require (timeLegnth == 60, 'loyalty timeLegnths do not match');
  require (_timeLegnth == timeLegnth, 'loyalty timeLegnths do not match');
  require (POL._loyaltyNeeded == true, 'User is not a loyalty holder');
  require (msg.sender == POL._miner,'miner address does not match sender address');
if (msg.sender == POL._miner){
  POL._loyaltyDays = (block.timestamp-POL._rewardTime)/_timeLegnth;
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
uint256  _basePercentage = 0.00081967 * 10e7; // @dev annual percentage calculation (30/100) / (365 + 1) =  0.00081967
uint256 timeLegnth = 60; //@dev exspected loyalty legnth (optional can be modified by contract owner only )  24 hrs = 86400 seconds
uint256 _timeLegnth = timeLegnth;
  require (timeLegnth == 60, 'loyalty timeLegnths do not match');
  require (_timeLegnth == timeLegnth, 'loyalty timeLegnths do not match');
  require (_basePercentage == 0.00081967 * 10e7,'Base percentage is not allowed to be changed');
  require (POL._loyaltyNeeded == true, 'Please make a deposit before attempting to claim your reward');
  require (POL._loyaltyDays >= 1,'User must wait the appropiate time before claiming loyalty');
  require (POL._loyaltyDays > 0,'User cannot claim loyalty reward twice in one day');
  require (msg.sender == POL._miner,'miner address does not match sender address');
  require (POL._rewardApproved = true,"Users reward has not yet been approved");
if (POL._loyaltyDays >= 1) {
  POL._rewardAmount = ((POL._rewardAmount+(( _basePercentage * POL._value)*POL._multiplier)*POL._loyaltyDays)/10e7)/10e7 + POL._rewardAmount;
  POL._depositTime = block.timestamp;
  POL._rewardTime = _timeLegnth+block.timestamp;
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
Sparkle token = Sparkle(0x9bb1E675CF9D585Cf615382959D74C337d50337F);
ProofOfLoyalty storage POL = loyaltyTimestamp[msg.sender];
address _recipiant = POL._miner;
uint256 _amount = POL._value;
uint256 _reward = POL._rewardAmount;
  require(token == Sparkle(0x9bb1E675CF9D585Cf615382959D74C337d50337F),'Please use the correct token contract');
  require (POL._loyaltyNeeded == true, 'Please make a deposit before attempting a withdraw');
  require (POL._value == POL._value, 'Please user the same address used for loyalty deposit');
  require (POL._rewardAmount == POL._rewardAmount, 'Please use the same address used for loyalty deposit');
  require (_recipiant == POL._miner, 'Please user the same address used for loyalty deposit');
  require (_amount == POL._value, 'Please user the same address used for loyalty deposit');
  require (_reward == POL._rewardAmount, 'Please user the same address used for loyalty deposit');
  require (msg.sender == POL._miner,'miner address does not match sender address');
if (msg.sender == POL._miner) {
  currentMiners -= 1;
  delete loyaltyTimestamp[msg.sender];
  storageDump storage SD = timestampRemoved[msg.sender];
  SD._timestampRemoved = true;
}
if (SD._timestampRemoved == true) {
token.transferFrom(loyaltyfaucet,_recipiant,_reward);
token.transfer(_recipiant,_amount);
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
Sparkle token = Sparkle (0x9bb1E675CF9D585Cf615382959D74C337d50337F);
ProofOfLoyalty storage POL = loyaltyTimestamp[msg.sender];
uint256 _multiplier = 1.0000000 * 10e7;
uint256 loyaltyRequired = 1000 * (10**8); // @dev token amount required for loyalty contract (optional can be modified)
uint256 loyaltyNeeded = loyaltyRequired; // @dev modify required loyalty
uint256 timeLegnth = 60; //@dev exspected loyalty legnth (optional can be modified by contract owner only )  24 hrs = 86400 seconds
uint256 _timeLegnth = timeLegnth;
  require (timeLegnth == 60, 'loyalty timeLegnths do not match');
  require (_timeLegnth == timeLegnth, 'loyalty timeLegnths do not match');
  require (_multiplier == 1.0000000 * 10e7,'multiplier must not be tampered with');
  require(loyaltyRequired == 1000 * (10**8),'User did not send the minimum loyalty amount');
  require(loyaltyRequired == loyaltyNeeded,'User did not send the minimum loyalty amount');
  require(token == Sparkle(0x9bb1E675CF9D585Cf615382959D74C337d50337F),'Please use the correct token contract');
  require(_value >= loyaltyNeeded,'User did not send the minimum loyalty amount');
if ( _value >= loyaltyNeeded) {
  uint256 _currentMiners = currentMiners;
  _currentMiners += 1;
  delete timestampRemoved[msg.sender];
  POL._miner = _miner;
  POL._loyaltyNeeded = true;
  POL._rewardApproved = false;
  POL._value = POL._value + _value;
  POL._rewardAmount = 0;
  POL._loyaltyDays = 0;
  POL._multiplier = _multiplier;
  POL._depositTime = block.timestamp;
  POL._rewardTime = _timeLegnth+block.timestamp;
  token.transferFrom(msg.sender, this, _value);
}
else {
  revert ('Unexspected error ');
  return false;
     }
   }
}