
const { assertInvalidOpcode } = require('./helpers/assertJump');
var AnnouncementBox = artifacts.require('../contracts/AnnouncementBox.sol');

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

  it("set box as unlocked by default", async function(){
      locked = await ab.locked()
      assert.isFalse(locked);
  });
  
  describe('#lock', function(){
    it('should prevent non-owners from ocking the box', async function() {
      const other = accounts[2]
      const owner = await ab.owner.call()
      assert.isTrue(owner !== other)

			return assertInvalidOpcode(async () => {
        await ab.lock({from: other});
			})
    });

    it('should set box as locked', async function(){
      const other = accounts[2];
      locked = await ab.locked.call()
      assert.isFalse(locked);
      await ab.lock({from: owner});
      locked = await ab.locked.call()
      assert.isTrue(locked);
    });
  }); 

  describe('#sendAnnouncement', function(){
    it('allows competitors to submit announcements', async function(){
      const other = accounts[2];

      let expectedAnnouncement = 'encrypted_announcement'
      await ab.sendAnnouncement( expectedAnnouncement , {from: other});

      var actualAnnoncement = await ab.annoncements.call(other);

      assert.equal(expectedAnnouncement, actualAnnoncement, "fails sending secret announcement");
    })

    it('adds competitor to competitors list', async function(){
      const other = accounts[2];

      let expectedAnnouncement = 'encrypted_announcement'
      await ab.sendAnnoncement( expectedAnnouncement , {from: other});

      var competitor = await ab.competitors.call(0);

      assert.equal(competitor, other , "fails to add competitor");
    })

    describe('when box is locked', function(){
      beforeEach(async function() {
        await ab.lock({from: owner});
      });

      it('should not allow competitors to submit annoncement', async function() {

        let expectedAnnouncement = 'encrypted_announcement'

        return assertInvalidOpcode(async () => {
          await ab.sendAnnouncement( expectedAnnouncement , {from: accounts[2]});
        })
      });
    });
  })
})
