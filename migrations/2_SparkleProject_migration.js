
//   Sparkle ERC20 Complient Token  
//   name:     "Sparkle",
//   symbol:   "SPRKL",
//   decimals: "8",
//   amount: 70000000 * (10**8)

const Sparkle = artifacts.require("./Sparkle")

module.exports = (deployer, Owner) => deployer
.then(() => migrateSparkle (deployer, Owner))
.then(() => sparkleSummary (deployer, Owner));

function migrateSparkle (deployer, Owner) {
  deployer.deploy(Sparkle,{overwrite: false});
};


async function sparkleSummary (Owner){
    const sparkleInstance = (await Sparkle.deployed());
    console.log (`=====================================
   Deployed Contract: 
   Sparkle: 0x4b7ad3a56810032782afce12d7d27122bdb96eff
   Name: Sparkle
   Symbol: SPRKL
   Decimal: 8
   Amount: 70,000,000 * (10**8)
   =====================================
   Version: V1.0.0
   Date:    November 2018
   Company: Sparkle Mobile Inc
   Developer: Jonah Glasgow  
   =====================================
   `);
}