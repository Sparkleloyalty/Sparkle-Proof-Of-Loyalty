const SparkleRewardTiers = artifacts.require('./SparkleRewardTiers');

module.exports = function(deployer, network, accounts) {
	return deployer.then(() => {
			return deployer.deploy(SparkleRewardTiers);
		});
};