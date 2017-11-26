var AnnouncementBox = artifacts.require("./AnnouncementBox.sol");

module.exports = function(deployer) {
    deployer.deploy(AnnouncementBox);
//  deployer.link(ConvertLib, MetaCoin);
//  deployer.deploy(MetaCoin);
};
