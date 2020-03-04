pragma solidity 0.4.25;

import './SparkleToken.sol';

contract VerifyTime is Ownable{

using SafeMath for uint256;

address private contractAddress;


constructor()
Ownable()
public{}

mapping (address => mapping (address =>  ProofOfTime)) public checkTimestamp; //@dev map loyalty hodlers call data


struct ProofOfTime {

   address _minerCheck;
   address _contractCheck;
   uint256 _depositTimeCheck;
   uint256 _rewardTimeCheck;
   uint256 _currentTime;
   bool   _timstampPassed;
}


function setContractAddress (address _contractAddress ) external onlyOwner returns (address) {
contractAddress = _contractAddress;
return contractAddress;
}


function setTimestamp(address _miner) external returns (bool) {

ProofOfTime storage POT = checkTimestamp[msg.sender][address(_miner)];
uint256 verifyTimeLegnth = 60;
address contractCheck = address(msg.sender);
uint256 currentTime = block.timestamp;
uint256 depositTime = block.timestamp;
uint256 rewardTime = block.timestamp + verifyTimeLegnth;
require (verifyTimeLegnth == 60, 'timestamps do not match');
require (currentTime == block.timestamp, 'timestamps do not match');
require (depositTime == block.timestamp, 'timestamps do not match');
require (rewardTime == block.timestamp + verifyTimeLegnth, 'timestamps do not match');
require (POT._timstampPassed != true, 'timestamp has not been reset');
require (contractAddress == contractCheck, 'contract address do not match');
require (contractAddress != address(0), 'contract address do not match');
if (POT._timstampPassed != true) {
 POT._minerCheck = _miner;
 POT._contractCheck = contractCheck;
 POT._depositTimeCheck = depositTime;
 POT._rewardTimeCheck = rewardTime;
 POT._currentTime = currentTime;
} else {
revert('Unexspected error');
return false;
 }
}

function checkTimestamp (address _miner) external returns (bool ){
ProofOfTime storage POT = checkTimestamp[address(msg.sender)][address(_miner)];
uint256 verifyTimeLegnth = 60;
address contractCheck = address(msg.sender);
require (POT._timstampPassed != true, 'timestamp has not been reset');
require (POT._contractCheck == contractAddress, 'contract address do not match');
require (POT._depositTimeCheck == POT._depositTimeCheck, 'timestamps do not match');
require (POT._rewardTimeCheck == POT._depositTimeCheck + verifyTimeLegnth, 'time legnths do not match');
require (_miner == POT._minerCheck, 'time legnths do not match');
require (POT._contractCheck == contractCheck, 'contract address do not match');
require (contractAddress == address(msg.sender), 'contract address do not match');
require(block.timestamp > POT._rewardTimeCheck,'Users reward has not yet been approved');
if (block.timestamp > POT._rewardTimeCheck){
return POT._timstampPassed = true;
} else {
revert('Unexspected error');
return false;
 }
}

function resetTimestamp (address _miner) external returns (bool) {
ProofOfTime storage POT = checkTimestamp[address(msg.sender)][address(_miner)];
uint256 verifyTimeLegnth = 60;
address contractCheck = address(msg.sender);
uint256 currentTime = block.timestamp;
uint256 rewardTime = block.timestamp + verifyTimeLegnth;
require (POT._timstampPassed != false, 'timestamp has not been checked');
require (POT._contractCheck == contractAddress, 'contract address do not match');
require (POT._depositTimeCheck == POT._depositTimeCheck, 'timestamps do not match');
require (POT._rewardTimeCheck == POT._depositTimeCheck + verifyTimeLegnth, 'time legnths do not match');
require (_miner == POT._minerCheck, 'time legnths do not match');
require (contractAddress == address(msg.sender), 'contract address do not match');
require (POT._contractCheck == contractCheck, 'contract address do not match');
if (POT._timstampPassed == true){
POT._depositTimeCheck = currentTime;
POT._rewardTimeCheck = rewardTime;
POT._currentTime = currentTime;
delete POT._timstampPassed;
 } else {
revert('Unexspected error');
return false;
 }
}

function removeTimestamp (address _miner) external returns (bool){
ProofOfTime storage POT = checkTimestamp[address(msg.sender)][address(_miner)];
address contractCheck = address(msg.sender);
require (POT._contractCheck == contractAddress, 'contract address do not match');
require (POT._depositTimeCheck == POT._depositTimeCheck, 'timestamps do not match');
require (contractAddress == address(msg.sender), 'contract address do not match');
require (POT._contractCheck == contractCheck, 'contract address do not match');
require (_miner == POT._minerCheck, 'time legnths do not match');
if (_miner == POT._minerCheck){
delete checkTimestamp[address(msg.sender)][address(_miner)];
 } else {
revert('Unexspected error');
return false;
  }
 }
}