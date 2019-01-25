var VeracityRegister = artifacts.require("./VeracityRegister.sol");

module.exports = function(deployer) {
  deployer.deploy(VeracityRegister);
};
