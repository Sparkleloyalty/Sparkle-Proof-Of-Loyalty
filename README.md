# Sparkle Proof Of Loyalty

>The SparkleLoyalty program is built on Ethereum and is comprised of a set specialized contracts that provide the functionality required by the program and should be considered compatible with any [ERC-20 Token Standard](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md).

* Development/Testing environment: Truffle
* MainNet Contract([Link]()): Currently not available
* Ropsten Contract([Link]()): Currently not available

### Definition

>**Proof Of loyalty** - As a consensus mechanism SparkleLoyalty provides rewards to users through a series of smart contracts that deter service abuse through the use of verified and trusted addressing. The SparkeLoyalty program rewards users for simply holding thier Sparkle for a predetermined time period currently set at ~24h.


### Sparkle Token Information

>Sparkle token (SPRKL) is an ERC20 token built on the Ethereum network. The Sparkle token use case is similar to other digital assets and can be bought, sold and traded. Sparkle's use case however diverges from this standard expectation through it's main purpose being to support the SparkleLoyalty program and all program users. Sparkle token was built using the [OpenZeppelin](https://github.com/OpenZeppelin/openzeppelin-contracts) secure contract library for contract development.

| **Field**        | **Type**  | **Value**                                               |
| :--------------- | :-------- | :------------------------------------------------------ |
| Name             | string    | Sparkle |
| Symbol           | string    | SPRKL |
| Decimals         | uint256   | 8 |
| Total Supply     | uint256   | 70,000,000 |
| Mintable         | Boolean   | False |

**Note** Sparkle (SPRKL) was designed with a finite supply of tokens and as such there will never be more than 70 million tokens in circulation.


### Sparkle Token Metrics

>Through various campaigns and give-aways, Sparkle token (SPRKL) has been distributed to introduce new users to the SparkleLoyalty program. Following is a brief table of known Sparkle token current distribution metrics.

| **Field**        | **Type**  | **Value**                                               |
| :--------------- | :-------- | :------------------------------------------------------ |
| AirDrop          | uint256   | TBD |
| Campaigns        | uint256   | TBD |
| Give-Aways       | uint256   | TBD |
| In Circulation   | uint256   | 2,347,450 SPRKL |

**Note** The list is not exaustive and represents a generalized view at the time of writing.


### SparkleLoyalty Information

>SparkleLoyalty is a loyalty reward program designed and developed from the ground up to provide users a secure and robust program that rewards them for simply holding their Sparkle tokens. The SparkleLoyalty program operates similar to a traditional savings account in that it provides users with a consistant rate of return on their deposits that start out at 5%. Unlike a traditional savings account however, SparkleLoyalty program users get to choose the rate in which they claim thier rewards and in addition may choose to purchase a reward upgrade in the form of a Tier1(10%), Tier2(20%), or Tier3(30%) rate boost.

**Note** Rewards are distributed in a, "first come, first served," basis gactored bythe user's claiming and loyalty withdraw habits.


#### Loyalty Treasury Metrics

>Following are the current SparkleLoyalty operations and development treasury address information.

* SparkleLoyalty Treasury: [Loyalty Address](https://etherscan.io/token/0x4b7ad3a56810032782afce12d7d27122bdb96eff?a=0xa90c682f511b384706e592a8cad9121f1c17de86)
* SparkleLoyalty DevTreasury: [Treasury Address](https://etherscan.io/token/0x4b7ad3a56810032782afce12d7d27122bdb96eff?a=0xbea52413e26c38b51cbcb0d3661a25f2097f8574)


#### Loyalty Reward Structure

>The following tables are provided as a guide to new and existing users when desciding to join or remain in the SparkleLoyalty program. The following tables are a reflection of the current program settings at the time of writing.


#### Deposit Specifications

>Following are the minimum/maximum allowed deposit values per address to join the SparkleLoyalty program.

| **Field**        | **Type**  | **Value**                                              |
| :--------------- | :-------- | :----------------------------------------------------- |
| Minimum deposit  | uint256   | 1,000 SPRKL |
| Maximum deposit  | uint256   | 250,000 SPRKL |


#### Maturity Specifications

>Following are the maturity and minimum/maximum allowed days a SparkleLoyalty prgram user may earn on thier deposit over a given period of time.

| **Field**        | **Type**  | **Value**                                              |
| :--------------- | :-------- | :----------------------------------------------------- |
| Maturity Period  | uint256   | 86400 seconds (~24h) |
| Min. Period      | uint256   | 86400 seconds (~24) |
| Max. Period      | uint256   | 31,536,000 seconds (~365d) |


#### Reward/Bonus Specification

>Following are the rates of return available to SparkleLoyalty program members including the available rate boost tiers and thier current pricing.

| **Field**     | **Type**  | **Value**    | **Price**                                 |
| :------------ | :-------- | :----------- | :---------------------------------------- |
| Base Rate     | uint256   | 15% APR      | Free (Default) |
| Tier1 Rate    | uint256   | +10% Bonus   | 0.10 Ethereum |
| Tier2 Rate    | uint256   | +20% Bonus   | 0.20 Ethereum |
| Tier3 Rate    | uint256   | +30% Bonus   | 0.30 Ethereum |

**NOTICE** Users of the SparkleLoyalty program acknowledge that potential risks and/or the loss of tokens may occur through their use of the SparkleLoyalty platform. By joining users of the SparkleLoyalty program agree to not hold SparkleLoyalty Inc, and any and all subsiduaries therein owned wholy or in part liable.


### Security Considerations & Specifications

#### Considerations

>There are three main considerations when using a timestamp to execute a critical function in a contract, especially when actions involve fund transfer.

##### 1. Timestamp Manipulation

>On the Etereum network a malicious miner can manulate the blockchains block timestamp by up to ~15 seconds. While not specific to the SparkleLoyalty program the following snippet of code demonstrates how a malicious miner could manipulate the blocktime stamp to thier advantage.


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

>When a contract uses the timestamp to seed a random number, the miner can actually post a timestamp within 15 seconds of the block being validated, effectively allowing the miner to precompute an option more favorable to them. Timestamps are not random and should not be used in that context. The consensus is the block timestamp should never be used as a source of randomness but rather a source of accuracy.


##### 2. The 15-second Rule

>The Ethereum [Yellow Paper](https://ethereum.github.io/yellowpaper/paper.pdf) does not specify a constraint on how many blocks can drift in time. However it does implement protections against publishing a block to the Ethereum network before the current block timestamp. Ethereum protocol implementations such as [Geth](https://github.com/ethereum/go-ethereum/blob/4e474c74dc2ac1d26b339c32064d0bac98775e77/consensus/ethash/consensus.go#L45) and [Parity](https://github.com/OpenEthereum/open-ethereum/blob/73db5dda8c0109bb6bc1392624875078f973be14/ethcore/src/verification/verification.rs#L296-L307) both reject blocks as described previous but also reject blocks with a timestamp more than 15 seconds into the future.

**Note**: If the resolution of your time-dependent event can vary by 15 seconds, then it may be safe to use a block.timestamp.


##### 3. Avoid using block.number like a block timestamp

>It is possible to estimate a time delta using the block.number property and [average block time](https://etherscan.io/chart/blocktime), however this is not future proof as block times may change (such as [fork reorganizations and the difficulty bomb](https://github.com/ethereum/EIPs/issues/649)). In a sale spanning days, the 15-second rule allows one to achieve a more reliable estimate of time.

See [SWC-116](https://swcregistry.io/docs/SWC-116)


#### Response Expectations

##### Contract Pause
>SparkleLoyalty and the contracts that comprise the program have been designed so they can be paused at any time by SparkleLoyalty Inc. staff. When a serious issue or malicious attack is detected the first action will be to pause the SparkleLoyalty program immediately to prevent any further losses or damange from occurring.

**Note** When paused, all functions and features of the SparkleLoyalty program will be unavailable to users. This includes the ability to claim any additional rewards or withdraw existing loyalty rewards until the SparkleLoyalty program has been re-started or a suitable alternative solution has been implemented.


##### Contract Re-Deployment
>In the extreme case where the SparkleLoyalty program cannot be restarted due to a malicious attack the staff at SparkleLoyalty Inc. reserve the right to re-deploy an updated loyalty contract to the Ethereum block chain and implement a process in which users can transfer theri loyalty balances to the new program and continue operation of the loyalty reward program.

**Note** Our objective is to provide users with the most secure experience when earning loyalty rewards and while this is our driving goal this is not always possible. Should there be some kind of problem with the SparkleLoyalty program we will do our best to corredct the issues as soon as possible with the least amount of distruption to users as possible.


### Developers

#### Getting Started

>Getting started with the SparkleLoyalty program developers will need the following software tools.

##### Requirements

* [NodeJS](https://nodejs.org/en/) (v10.11.0)
* [Docker](https://www.docker.com/) (v19.03.8)
* [TruffleSuite](https://www.trufflesuite.com/) (v5.1.23)
* [Ganache-Cli](https://www.npmjs.com/package/ganache-cli) (v6.9.1)


##### NodeJS Packages

* [OpenZeppelin](https://openzeppelin.com/contracts/) (v2.0)
* [Babel/Core](https://www.npmjs.com/package/@babel/core) (v7.10.4)
* [Truffle/HDWallet](https://www.npmjs.com/package/@truffle/hdwallet-provider/v/1.0.37) (v1.0.37)
* [Truffle-Assertions](https://www.npmjs.com/package/truffle-assertions) (v0.9.2)
* [Chai](https://www.npmjs.com/package/chai) (v4.2.0)
* [DotEnv](https://www.npmjs.com/package/dotenv) (v8.2.0)


##### Install NodeJS

>Please see the link provided above to download and install the NodeJS version appropriate for your development environment and operating system.

**Note** It is beyond the scope of this document to provide the NodeJS installation process as there are many tutorials and content already available that describe the process in detail.


##### Install Docker

>Please see the link provided above to download and install the Docker version appropriate for your development environment and operating system.

**Note** It is beyond the scope of this document to provide the Docker or DockerDesktop installation process as there are many tutorials and content already available that describe the process in detail.


##### Install TruffleSuite

>Developers interested in working with the SparkleLoyalty program repository will need to install the TruffleSuite set of smart contract tools including contract deployment and contract unit testing. To install TruffleSuite please follow the following step.

```
$ npm install -g truffle@5.1.23
```

##### Install Ganache-CLI

>Development of the SparkleLoyalty program was initially performed and deployed to a local Ethereum blockchain provided by Ganache-CLI. To install Ganach-CLI please follow the following step.

```
$ npm install -g ganache-cli
```

##### Clone The SparkeLoyalty Repository

>To begin developing with the SparkleLoyalty program developers will need to clone the source code repository for the project into a folder or directory on their computer to work from. To clone the SparkleLoyalty repository please create a working folder on your computer.

>Once a working folder has been created please navigate into the newly created directory perform one of the following commands from the command line of your development enviroment to clone the repository.

Using SSH:
```
$ git clone git@github.com:Sparklemobile/Sparkle-Proof-Of-Loyalty.git
```

Using: HTTPS

```
$ git clone https://github.com/Sparklemobile/Sparkle-Proof-Of-Loyalty.git
```


##### Initialize Local NodeJS Project

>Now that the SparkleLoyalty program source code has been cloned or downloaded the next step is to initalize the project. This step will install any required dependancies required that were not installed in a previous step. To initialize the newly download SparkleLoyalty repository please enter the following command from the command line of your development environment.

```
$ npm init
```


##### Starting Your Local Blockchain

>Before the contracts are compiled and migrated, a local Ethereum blockchain will be required to deploy the compiled contracts to. This step is being performed now as it seems most logical to have the running development blockchain up before the contracts are compiled and migrated. To start the Ganache-CLI local Ethereum blockchain please enter the following command from the command line of your development environment.

```
$ npm run ganache:cli
```

**Note** Starting the Ganache-CLI local blockchain is not required if the intention is to just compile the contracts in the project.

**Note** The Ganache-CLI local blockchain has been configured to preserve it's data and to be persistant between executions. This means that the local server may be shutdown and restarted while preserving the blockchain state.


##### Compile SparkleLoyalty

>The next step is to compile the SparkleLoyalty program contracts. Currently everything neede to accomplish this task should be installed and ready. To compile the SparkleLoyalty program contract please enter the following command from the command line of your development enviroment.

```
$ truffle compile --all
```


##### Migrate SparkleLoyalty To Local Blockchain

>After the SparkleLoyalty program contracts have been successfully compiled the next step is to deploy or migrate them to the local Ethereum blockchain provided by Ganache-CLI as outlined above. To migrate the compiled SparkleLoyalty contracts to the local blockchain enter the following command from the command line of your development environment.

```
$ truffle migrate --reset
```

**Note** The use of the --reset parameter is intentional and forces Truffle to migrate or deploy all contracts again. Without this parameter Truffle will attempt tp reuse contracts that have already been deployed to the blockchain it has recorded in it's migration file. The use of this parameter here is expressly to force Truffle to migrate all contracts regardless of being modified or not.


##### Run The Tests

>For developers interested in ensuring they have a working version of the SparkleLoyalty program should consider running the provided tests. Running the provided test not only familiarlize teh developer with the functionality of the project but also ensure that eveything is working as expected out of the box.

>A number of solidity contract tests have been provided that cover most if not all of the expected funcationality of the SparkleLoyalty program to ensure that the expected behaviour is intact. To run the tests simple enter the following command from the command line of your development environment.

**Note** For successfull operation of the provided tests users must transfer tokens into the correct account addresses created by ganache-cli. It is left up to the reader to transfer the approriate tokens to the TREASURY and USER1 accounts addresses as specified in the respective test file. For the tests to function it is expected that USER1 address have at least a 1000*10e7 TOKEN balance. The TREASURY address should have at least a 5000*10e7 TOKEN balance.

**Note** Additionally the provided tests assume the Sparkle Token Contract has been previously deployed to the local blockchain or testnet. This project does not include nor migrate the Sparkle Token contract to the target blockchain. Readers interested in executing the tests are required to change the 'onchainSparkleToken' variable to point to their deployed Sparkle Token instance address before performing the tests.


Test: All:
```
$ npm run test:all
```

Test: RewardTiers:
```
$ npm run test:rewardtiers
```

Test: Timestamp:
```
$ npm run test:timestamp
```

Test: Loyalty:
```
$ npm run test:loyalty
```


**Note** Tests relying on specific timing expectations occasionally fail the testing sequence. This is due to fluctuations in time and load on the system running the local blockchain. Often re-running the tests or running the specific test on its own fixes this problem.


#### MythX Audits

>The provided npm scripts that perform MythX Smart Contract Auditing are bound to information not provided in this repository. Readers interested in executing the provided MythX audits will be required to create their own MythX account, setup a MythX api/secret and configure thier development environmemnt to use this information. Once configured the MythX audit scripts should execute without issue.


### Additional Developer Information

>Following are some additional points of information developers interested in SparkleLoyalty program development.

#### Basic (UML) Diagram For Textual Description

>The following [(UML)](https://plantuml.com/) diagram visualy demonstrates the inter-contract relationship of the SparkleLoyalty program and how the various contracts work together to provide functionality to the SparkleLoyalty program and its operational life cycle.

*NEEDS UPDATE*


#### Known Issues

>Known issues can be found on the SparkleLoyalty Program's GitHub Issue tracker as well as viewed publicly using pre-audit reports compiled by [Chainsecurity](https://securify.chainsecurity.com/)


#### When Making Pull Requests a Test File is Required

>When submitting a pull request that attempts to fix an existing bug or is meant to demonstrate the existence of a bug please provide a fully operational test that demonstrates and recreates the issue beineg described.

**Note** Pull requests submitted not accompanied by a working test will be ignored and/or deleted.


### Looking For More Information

>To learn more about the SparkleLoyalty program please join our [telegram](https://t.me/Sparklemobile) and speak with any of our admins regarding how to get started earning rewards.


### Sources
* [The-15-second-rule](https://consensys.github.io/smart-contract-best-practices/recommendations/#the-15-second-rule)
* [SWCregistry ](https://swcregistry.io/)
* [Build Highly Secure, Decentralized Application](https://books.google.ca/books/about/Advanced_Blockchain_Development.html?id=lOiZDwAAQBAJ&printsec=frontcover&source=kp_read_button&redir_esc=y#v=twopage&q&f=false)
