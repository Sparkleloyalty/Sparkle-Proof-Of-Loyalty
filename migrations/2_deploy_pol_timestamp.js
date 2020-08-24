const SparkleTimestamp = artifacts.require('./SparkleTimestamp');

module.exports = function(deployer, network, accounts) {
	return deployer.then(() => {
			return deployer.deploy(SparkleTimestamp);
		});
};