# Sparkle Proof Of Loyalty

Proof of Loyalty smart contract built on Ethereum (Note this Contract should be considered an example of a basic framework for token loyalty based on block.timestamp). This contracts should be considered compatible with any [ERC-20 Token Standard](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md). 

* Development environment: Truffle 
* Testing Framework: Truffle (recommended) Remix (optional) 
* Ethereum MainNet Contract  [MainNet Link](): Currently not for production
* Ethereum MainNet Contract Address: Currently not for production
* Ropsten TestNet Contract: [TestNet Link](https://ropsten.etherscan.io/address/0xb954c94ed1e96be6cc55d0b62a4089f610d8afea#code)
* Ropsten TestNet Contract Address: 0xb954c94Ed1E96Be6cc55d0b62A4089f610d8aFEA

| ℹ️ **Contributors**: Please see the [Development](#development) section of this README. |
| --- |

### Definition

**Proof Of loyalty** - To prevent denial-of-service attacks and other service abuses by requiring an unchanged state or particular condition for a predetermined period of time.


### Sparkle Token Information 

Sparkle (SPRKL) is a decentralized permissionless network, which means that no central entity has the authority to edit the ledger, shut down the chain, or change its protocols. Sparkle’s main use case act’s a digital asset that can be transferred, traded, bought and sold. Sparkle was built using [OpenZeppelin](https://github.com/OpenZeppelin/openzeppelin-contracts) a library for secure smart contract development.

**Note** This token was developed to produce very finite supply similar to Bitcoin their will never be more than 70 million sparkle mined or in circulation

| **Field**          | **Type** | **value**                                              |
| :--------------- | :-------- | :------------------------------------------------------ |
| Name               | string   | Sparkle |
| Symbol             | string   | SPRKL |
| Total Supply       | uint256  | 70,000,000 |
| Loyalty Supply     | uint256  | 35,000,000 |
| Treasury Supply    | uint256  | 30,000,000 |
| AirDrop Supply     | uint256  | 5,000,000 |
| Circulating Supply | uint256  | 2,347,450|
| Mintable           | Boolean  | False |


### Loyalty Information 

This section can be used by developers as a glossary for variable definitions defined in [LoyaltySettings.sol](https://github.com/JonahGlasgow/Sparkle-Proof-Of-Loyalty/blob/document-updates-2/contracts/loyaltySettings.sol) for developer support or any additional questions about Proof Of Loyalty before contributing please join our [telegram](https://t.me/Sparklemobile).

**Note** All rewards are distributed on a first com first serve basis, keep in mind Sparkles limited supply

| **Field**       | **Type** | **Description**                                              |
| :------------ | :-------- | :------------------------------------------------------------ |
| _miner          | address  | The address who owns and deposits Sparkle tokens |
| _value          | uint256  | The amount sent to the loyalty contract |
| _loyaltyNeeded  | Boolean  | The minimum amount needed to enter into a loyalty lifecycle |
| _loyaltyDays    | uint256  | The amount of day since your initial deposit or previous reward date |
| _multiplier     | uint256  | The uint used to calculate a multiplier bonus which can be added to any miners daily rewards lifecycle |
| _timeLength     | uint256  | The minimum amount of time required before a loyalty reward can be calculated |
| _depositTime    | uint256  | The recorded time of a miners deposit date |
| _rewardTime     | uint256  | The minimum amount of time a miner must wait before claiming rewards |
| _rewardApproved | Boolean  | A statement used to validate a miners has correctly calculated his loyalty days and is now ready to calculate their reward amount|
| _rewardAmount   | uint256  | The amount calculated after a miners reward has been approved and before the final bonus multiplier calculation  |

### Loyalty Reward Structure 

This section should be used as a guide when entering Sparkle's Proof Of Loyalty reward system. The user acknowledges that potential risks or lost of tokens may occur with any use of the Sparkle Loyalty Platform and ETH and expressly agrees not to hold liable Sparkle Mobile Inc. or the Ethereum Team should any foreseen or unforeseen event occurs.  

**Unix time** is the number of seconds that have elapsed since the Unix epoch, that is the time 00:00:00 UTC on 1 January 1970, minus leap seconds. Leap seconds are ignored, with a leap second having the same Unix time as the second before it, and every day is treated as if it contains exactly 86400 seconds.

**Daily percentage** can only have a maximum of 8 digits of decimal and is boosted by 10e7 in order to store as uint256.

| **Field**          | **Type** | **Price**                                              |
| :--------------- | :-------- | :------------------------------------------------------ |
| Minimum loyalty needed      | uint256  | 1000 SPRKL |
| Maximum loyalty needed      | uint256  | N/a |
| Annual reward percentage    | uint256  | 30%  |
| Daily reward percentage     | uint256  | 0.00081967 = 30% / (365+1) |
| Minimum loyalty time length | uint256  | 86400 seconds |
| Minimum loyalty days        | uint256  | 1 day = 86400 seconds |
| Maximum loyalty days        | uint256  | 365 days |
| Standard bonus multiplier   | uint256  | 1.00000000 * 10e7 |
| Upgraded bonus multiplier 1 | uint256  | 1.25000000 * 10e7 |
| Upgraded bonus multiplier 2 | uint256  | 1.50000000 * 10e7 |



### Daily Bonus Multiplier

Adding a **Bonus multiplier** will boost your daily rewards by up to 1.50x

| **Field**          | **Type** | **Price**                                              |
| :--------------- | :-------- | :------------------------------------------------------ |
| Standard bonus multiplier   | uint256  | Free |
| Upgraded bonus multiplier 1 | uint256  | 0.15 Ether |
| Upgraded bonus multiplier 2 | uint256  | 0.20 Ether |


### Basic (UML) Diagram For Textual Description

The Unified Modeling Language [(UML)](https://plantuml.com/) is a general-purpose, developmental, modeling language which quickly helps developers visualize their software designs. Please note this diagram is subject to change with on going development and should be interpreted as a preliminary example of a basic Proof of Loyalty lifecycle. 

<img src= "https://plantuml-server.kkeisuke.app/png/nLVDRkCs43vRJq70XxO9RBS1MXG1ThiRfxieqFmWBden38EMHZ5h_WWaPLT8zn5wsUsfbxn27osFq27rOygHlSqYY_fWaD_yS6Q-uKXwPIpLDXSy-e8C1YHLcj3Sge46cO0cJAASyrEoj3OpfwEHe7e5DkCqXk6QcPnoO_E4gM6in8XP4EO7ztz91Rpu3HOBCqHTkJr0PPOfQN0PHP5PCPbHJGNHAfT9hBJ4Cq--9g4evjGOSXVrpcYyklMAOyKnpclAuQq6a2XI6gCjuKcccRmj1Uy2FyQ21cMB3CQxdiu1icicLr4PepyHgXYPHBiKqoK__NWpnjZk8e8_hyZa4ZIpLABKAJU2t608Rz1p2rrJRTg80BjKYGTxnm_tV_rf5PPxacSPBxxygi8MbBiJhj86GKRKnc4UiPfAauBs6vfbMgtRWZTQ2GIm6kv75mO5iIKJci85jSlFbb7VnIfoxeBnwuIjcxN95ysQ9acp5YgfOosP_rZLUtTrHkzAXlP47UWzt7_ukydUjVnqcYFF9zz-DvjrPDSRJAS22uk-28QgmPWNBoi3CfkHUSMGwTRSQ-fjFPUGUDCc238F6k7_wfVUCPEn1chWTSi-WGwqFm_TzkS2KobNYrpBxIhinO3VSx2KSKYUWUTk_j0ILLnb9Owc7SWKOg5uGy7t3iCicS3fjg_wHqVpUOoJpEeyjahFvqT7JRtT4SscTDviQx_j8bnj95rmU8Qhw9AeEisbeJOuKlVTpqCvUCDcnynLiyT70uvER327c2NBMitJGhTT4S91tXESpQk3UGUqLqKAeR8HTe6wc_vxqOx3Th1g1VBIjybZV5Brod7GArvmNZTCBMfkCWelwE-7BtCt5K6bViMYfCKlJ7nwiMxmaUZuY8ktETN9PvcJszR3RBoNroNYo_BnsNYjbKglKf-dcu_n4kALs-5xYCYUUXaDs74xZ1fkN7gWVKhLvO-qD0WSbI4MyCDLGRaj9c0j9cIUZQH7pVxihBNQDSurtczxmTnrtM6qIZ6bUGoscy-AlfzBJR8rsbBOQMUGDNeBvxd8d96jjMzyoPDFuBsCCcJzuVxzFrKqPqhcvfjEzCIZQt_RphYALrKkVfmbE5QACKu_Myr2v9w96zWWKtw_ONQPQBe9ZF1vcId3x1R2hddK5wCMc-Kxps0mxL_ITJ7xusNryba9XiDfltvdTSA6xLCo6ZaN5P-ZKTH-kdPuh2TmAAhRiakstwezUeDvrULwZtYt-mEr9oIzUnUx0ZYainl58Tso7hiQJmWsUeMVMlXzz2y0.png">



### Quick Usage

* External script runner that executes scripts within a Truffle environment.

Developers who want to set up there own project directory:

```
$ truffle init
```

### Solc Compiler 

Make sure Docker is installed on your machine so truffle can obtain the proper solc compiler version:

```
$ truffle compile 
```

Verify contract was compiled successful using:
   
```  
- solc: 0.4.25+commit.59dbf8f1.Linux.g++

```

From there, you can run `truffle compile`, `truffle migrate` and `truffle test` to compile your contracts, deploy those contracts to the network, and run their associated unit tests.

### Development

We welcome pull requests. To get started, just fork this repo and clone it locally

```  
$ git clone https://github.com/YOURFORKEDPROJECT
```

To get started please see the [Quick Usage](#QuickUsage) section of this README.

### Security Considerations While Using block.timestamp

There are three main considerations when using a timestamp to execute a critical function in a contract, especially when actions involve fund transfer.

#### 1.Timestamp Manipulation

Be aware that the timestamp of the block can be manipulated by a miner up to 15 seconds. 

```  
uint256 constant private salt =  block.timestamp;

function random(uint Max) constant private returns (uint256 result){
    //get the best seed for randomness
    uint256 x = salt * 100/Max;
    uint256 y = salt * block.number/(salt % 5) ;
    uint256 seed = block.number/3 + (salt % 300) + Last_Payout + y;
    uint256 h = uint256(block.blockhash(seed));

    return uint256((h / x)) % Max + 1; //random number between 1 and Max
}
```

When a contract uses the timestamp to seed a random number, the miner can actually post a timestamp within 15 seconds of the block being validated, effectively allowing the miner to precompute an option more favorable to their chances in the lottery. Timestamps are not random and should not be used in that context. To clear the consensus is block.timestamp should never be used as a source of randomness but rather a source of accuracy.

#### 2.The 15-second Rule
The [Yellow Paper](https://ethereum.github.io/yellowpaper/paper.pdf) (Ethereum's reference specification) does not specify a constraint on how much blocks can drift in time, but it does specify that each timestamp should be bigger than the timestamp of its parent. Popular Ethereum protocol implementations [Geth](https://github.com/ethereum/go-ethereum/blob/4e474c74dc2ac1d26b339c32064d0bac98775e77/consensus/ethash/consensus.go#L45) and [Parity](https://github.com/OpenEthereum/open-ethereum/blob/73db5dda8c0109bb6bc1392624875078f973be14/ethcore/src/verification/verification.rs#L296-L307) both reject blocks with timestamp more than 15 seconds in future. Therefore, a good rule of thumb in evaluating timestamp usage is:

| ℹ️ **Note**: If the scale of your time-dependent event can vary by 15 seconds and maintain integrity, it is safe to use a block.timestamp. |
| --- |

#### 3.Avoid using block.number as a timestamp

It is possible to estimate a time delta using the block.number property and [average block time](https://etherscan.io/chart/blocktime), however this is not future proof as block times may change (such as [fork reorganizations and the difficulty bomb](https://github.com/ethereum/EIPs/issues/649)). In a sale spanning days, the 15-second rule allows one to achieve a more reliable estimate of time.

See [SWC-116](https://swcregistry.io/docs/SWC-116)


### Security Measures In The Event of Malicious Actors 

#### Pause Contract
* LoyaltySettings.sol can be paused by using the setFaucetAddress function to remove the declared faucet address. Note this will also prevent anyone from withdrawing tokens which were previously sent to the contract along with any expected rewards. 

#### Redeploy Contract
* In the most extreme measures the contract owner can pause the contract then remove all tokens from the faucet address. After the contract has been successfully paused we can manually send tokens back to their respected owners and redeploy a new contract with the required changes that need to be done.    


### Proof Of Loyalty *Pros* 

* Block.timestamp event can vary by 15 seconds and maintain integrity
* Lightweight contract resulting in low gas execution calls
* User friendly for large communities 
* No randomized reward process, everyone will be rewarded based on token loyalty 
* Day Multiplier is executed with limited gas cost (no forloops are used for this function)
* Compounding interest can be included or removed depending on reward amount calculations (only during contract development cannot be changed after the contract is deployed)
* Interest Multiplier allows for multi tier rewards based on the conditions set during development (ie bob hold 1000 tokens he gets 10% APR sara holds 2000 tokens and she gets 20% APR ) 
* Loyalty tokens are stored at an external address to prevent such attacks 
* Loyalty rewards are given at the end of the loyalty cycle when the user calls withdraw loyalty to prevent malicious spending during supposed token loyalty 

### Proof of Loyalty *Cons/Issues* 

Unknown storage growth over long periods of time with extremely large communities. Even tho the msg.senders strut mapping is deleted upon withdrawal, if the mapping exceeds 10000 addresses its hard to say the rewards values wouldn't be eaten by the gas cost to map over the array and execute the transaction. (this is why we recommend setting a required loyalty amount. Keep in mind to make this amount fair)
One could assume due to a community actively trading this issue may not occur for a long period of time which a new contract can be redeployed. 

### Known Issues 
 Known issues can be viewed publicly using pre audit reports compiled by [Chainsecurity](https://securify.chainsecurity.com/)

### Bug Bounty

Bug bounties are subject to approved pull request or users bugs found by interactions with our TestNet contract. Both will result in a bounty reward

### Test File

Please add all bugs found with the appropriate test.js file alongside your purposed contract solutions.

### Contributors

If you wish to learn more about the project please join our [telegram](https://t.me/Sparklemobile) with your github username and ask our admins how to start earning rewards.



### Sources
* [The-15-second-rule](https://consensys.github.io/smart-contract-best-practices/recommendations/#the-15-second-rule)
* [SWCregistry ](https://swcregistry.io/)
* [Build Highly Secure, Decentralized Application](https://books.google.ca/books/about/Advanced_Blockchain_Development.html?id=lOiZDwAAQBAJ&printsec=frontcover&source=kp_read_button&redir_esc=y#v=twopage&q&f=false)
