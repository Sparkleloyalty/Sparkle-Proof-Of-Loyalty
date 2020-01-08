
// Sparkle.sol is required to link with Proof Of Loyalty migration



const loyaltySettings = artifacts.require("./loyaltySettings")

const Sparkle = artifacts.require("./Sparkle")
 
module.exports = (deployer, Owner) => deployer
.then(() => linkMigration (deployer, Owner))
.then(() => deployMigration (deployer, Owner))
.then(() => migrationSummary ( Owner));

function linkMigration(deployer, Owner) {
    return deployer.link(Sparkle, loyaltySettings);
  };

function deployMigration(deployer, Owner) {
  return deployer.deploy(loyaltySettings);
};

async function migrationSummary (Owner){
    const loyaltyInstance = (await loyaltySettings.deployed());
    console.log (`=====================================
   Deployed Contracts: 
   Sparkle: 0x4b7ad3a56810032782afce12d7d27122bdb96eff
   loyaltySettings: ${loyaltySettings.address}
   =====================================
   Version: V1.0.0
   Date:    January 2020
   Company: Sparkle Mobile Inc
   Developer: Jonah Glasgow  
   =====================================
   `);
}