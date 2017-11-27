
const { assertInvalidOpcode } = require('./helpers/assertJump');
var AnnouncementBox = artifacts.require('../contracts/AnnouncementBox.sol');

contract('AnnouncementBox', function(accounts) {
  let ab 
  let owner
  let competitor

  beforeEach(async function() {
    ab = await AnnouncementBox.new()
    owner = await ab.owner()
    competitor = accounts[1]
  })

  it("set contract creator as owner", async function(){
    assert.equal(owner, accounts[0], "fails setting owner");
  })

  it("set box as unlocked by default", async function(){
    assert.isFalse(await ab.locked())
  })
  
  describe('#lock', function(){
    it('should prevent non-owners from ocking the box', async function() {
			return assertInvalidOpcode(async () => {
        await ab.lock({from: competitor})
			})
    })

    it('should set box as locked', async function(){
      assert.isFalse(await ab.locked.call())
      await ab.lock({from: owner})
      assert.isTrue(await ab.locked.call())
    })
  })

  describe('#sendAnnouncement', function(){
    it('allows competitors to submit announcements', async function(){
      let expectedAnnouncement = 'encrypted_announcement'
      await ab.sendAnnouncement(expectedAnnouncement, {from: competitor})

      var actualAnnouncement = await ab.announcements.call(competitor)

      assert.equal(expectedAnnouncement, actualAnnouncement, "fails sending secret announcement");
    })

    it('does not allows competitors to submit 2 announcements', async function(){
      let expectedAnnouncement = 'encrypted_announcement'
      await ab.sendAnnouncement( expectedAnnouncement , {from: competitor});
			return assertInvalidOpcode(async () => {
        await ab.sendAnnouncement('other_announcement', {from: competitor});
			})
    })

    it('adds competitor to competitors list', async function(){
      let expectedAnnouncement = 'encrypted_announcement'
      await ab.sendAnnouncement( expectedAnnouncement , {from: competitor});

      var expectedCompetitor = await ab.competitors.call(0);

      assert.equal(expectedCompetitor, competitor, "fails to add competitor");
    })

    describe('when box is locked', function(){
      beforeEach(async function() {
        await ab.lock({from: owner})
      })

      it('should not allow competitors to submit annoncement', async function() {
        let expectedAnnouncement = 'encrypted_announcement'
        return assertInvalidOpcode(async () => {
          await ab.sendAnnouncement( expectedAnnouncement , {from: accounts[2]});
        })
      });
    });
  })
})
