# Sparkle-Proof-Of-Loyalty

Proof of Loyalty smart contract built on Ethereum (Note this Contract should be considered an example of a basic framework for token loyalty based on block.timestamp)

* Development environment: Truffle 
* Testing Framework: Truffle (recommended) Remix (optional) 
* Ethereum MainNet Contract  [MainNet Link](): Currently not for production
* Ethereum MainNet Contract Address: Currently not for production
* Ropsten TestNet Contract: [TestNet Link](https://ropsten.etherscan.io/address/0xb954c94ed1e96be6cc55d0b62a4089f610d8afea#code)
* Ropsten TestNet Contract Address: 0xb954c94Ed1E96Be6cc55d0b62A4089f610d8aFEA

| ℹ️ **Contributors**: Please see the [Development](#development) section of this README. |
| --- |


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


#### Security Measures In The Event of Malicious Actors 

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
[The-15-second-rule](https://consensys.github.io/smart-contract-best-practices/recommendations/#the-15-second-rule)
[SWCregistry ](https://swcregistry.io/)
[Build Highly Secure, Decentralized Application](https://books.google.ca/books/about/Advanced_Blockchain_Development.html?id=lOiZDwAAQBAJ&printsec=frontcover&source=kp_read_button&redir_esc=y#v=twopage&q&f=false)