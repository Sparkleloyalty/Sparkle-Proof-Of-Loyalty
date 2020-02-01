# Sparkle-Proof-Of-Loyalty

Proof of Loyalty smart contract built on Ethereum (Note this Contract should be considered an example of a  basic framework for token loyalty based on block.timestamp or block.number)

* Development environment: Truffle 
* Testing Framework: Truffle (recommended)  Remix (optional) 
* Ethereum MainNet Contract: Currently not for production
* Ethereum MaiNet Contract Link: Current not for production
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

### Proof Of Loyalty *Pros* 

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

### Bug Bounty

Bug bounties are subject to approved pull request or users bugs found by interactions with our TestNet contract. Both will result in a bounty reward

### Test File

Please add all bugs found with the appropriate test.js file alongside your purposed contract solutions.

### Contributors

If you wish to learn more about the project please join our [telegram](https://t.me/Sparklemobile) with your github username and ask our admins how to start earning rewards.



