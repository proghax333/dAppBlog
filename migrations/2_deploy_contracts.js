const Blog = artifacts.require("Blog");

module.exports = function (deployer) {
  deployer.deploy(Blog, "The Decentralized Apps Blog");
};
