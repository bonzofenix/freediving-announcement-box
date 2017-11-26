
const { assertInvalidOpcode } = require('./helpers/assertJump');
var AnnouncementBox = artifacts.require('../contracts/AnnouncementBox.sol');
var openpgp = require('openpgp');
var textEncoding = require('text-encoding');

openpgp.initWorker({ path: 'openpgp.worker.js' }) // set the relative web worker path
openpgp.config.aead_protect = true // activate fast AES-GCM mode (not yet OpenPGP standard)


contract('AnnouncementBox', function(accounts) {
  let ab 
  let owner

  beforeEach(async function() {
    ab = await AnnouncementBox.new();
    owner = await ab.owner();
  });

  it("set contract creator as owner", async function(){
    assert.equal(owner, accounts[0], "fails setting owner");
  });
  
  //describe('#unlockBox', function(){
  //  it('should prevent non-owners from unlocking the box', async function() {
  //    const other = accounts[2]
  //    const owner = await ab.owner.call()
  //    assert.isTrue(owner !== other)

	//		return assertInvalidOpcode(async () => {
  //      await ab.unlock({from: other});
	//		})
  //  });

  //  it('should set box as unlocked', async function(){
  //    const other = accounts[2];
  //    locked = await ab.locked.call()
  //    assert.isTrue(locked);
  //    await ab.unlock({from: owner});
  //    locked = await ab.locked.call()
  //    assert.isFalse(locked);
  //  });
  //}); 

  //describe('#sendSecretAnnouncement', function(){
  //  describe('when box is unlocked', function(){
  //    beforeEach(async function() {
  //      await ab.unlock()
  //    });

  //    it('allows competitors to submit announcements', async function(){
  //      const other = accounts[2];

  //      let depth = '100'
  //      let pin = '1234'

  //      options = {
  //        data: depth,      // input as Uint8Array (or String)
  //        passwords: [pin], // multiple passwords possible
  //        armor: false      // don't ASCII armor (for Uint8Array output)
  //      };

  //      ciphertext = await openpgp.encrypt(options);

  //      var secretAnnouncement = new textEncoding.TextDecoder("utf-8").decode(ciphertext.message.packets.write());

  //      await ab.sendSecretAnnouncement(secretAnnouncement, {from: other});


  //      var actualSecretAnnouncement = await ab.secretAnnouncements.call(other);

  //      assert.equal(secretAnnouncement, actualSecretAnnouncement, "fails sending secret announcement");
  //    })
  //  })

  //})

  //describe('#revealSecretAnnouncement', function(){
  //  describe('when box is locked', function(){
  //    it('does not allows competitors to reveal announcements', async function(){
	//			locked = await ab.locked.call()
	//			assert.isTrue(locked);

	//			return assertInvalidOpcode(async () => {
	//				await ac.revealSecretAnnouncement('1234', {from: other});
	//			})
  //    })
  //  })

  //  describe('when box is unlocked', function(){
  //  })
  //})
})
