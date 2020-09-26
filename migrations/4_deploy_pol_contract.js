const SparkleLoyalty = artifacts.require('./SparkleLoyalty');
const SparkleTimestamp = artifacts.require('./SparkleTimestamp');
const SparkleRewardTiers = artifacts.require('./SparkleRewardTiers');

const onchainSparkleTokenAddressGanache = '0x14d8d4e089a4ae60f315be178434c651d11f9b9a'; // GanacheCLI
const onchainSparkleTokenAddressRopten = '0xb0550ae71eFec2e163f9aDb540b32641511b0a88'; // Ropsten
const onchainSparkleTokenAddressMainnet = '0x0'; // Mainnet

module.exports = async function(deployer, network, accounts) {
	return deployer
	.then(() => {
		return deployer.deploy(SparkleRewardTiers, {overwrite: false});
	})
	.then(() => {
		return deployer.deploy(SparkleTimestamp, {overwrite: false});
	}).then(() => {
		const tokenAddress = 0x0;
		if(network == 'ropsten') {
			tokenAddress = onchainSparkleTokenAddressRopten;
		}
		else if(network == 'mainnet') {
			tokenAddress = onchainSparkleTokenAddressMainnet;
		}
		else {
			tokenAddress = onchainSparkleTokenAddressGanache;
		}

		const tokenAddress = onchainSparkleTokenAddress;
		const treasuryAddress = accounts[1];
		const collectionAddress = accounts[4];
		const timestampAddress = SparkleTimestamp.address;
		const tiersAddress = SparkleRewardTiers.address;

		return deployer.deploy(SparkleLoyalty, tokenAddress, treasuryAddress, collectionAddress, tiersAddress, timestampAddress);
	}).then(() => {
		SparkleRewardTiers.deployed({overwrite: false })
		.then(function (rti) {
			// rti.setContractAddress(SparkleLoyalty.address, {from: accounts[0]});
			SparkleTimestamp.deployed({ overwrite: false })
			.then(function (tsi) {
				tsi.setContractAddress(SparkleLoyalty.address, {from: accounts[0]});
				tsi.setTimePeriod(60*3, {from: accounts[0]});
			});
		});
	});
};