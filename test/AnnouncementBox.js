
const { assertInvalidOpcode } = require('./helpers/assertJump');
var AnnouncementBox = artifacts.require('../contracts/AnnouncementBox.sol');

contract('AnnouncementBox', function(accounts) {
  let ab 
  let owner
  let competitor
  let competitorName 


  beforeEach(async function() {
    ab = await AnnouncementBox.new()
    owner = await ab.owner()
    competitor = accounts[1]
    competitorName = 'Bob'
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
      let expectedMeters = 'encrypted_meters'
      await ab.sendAnnouncement(competitorName, expectedMeters, {from: competitor})

      var actualAnnouncement = await ab.announcements.call(competitor)

      assert.equal(competitorName, actualAnnouncement[0], "fails sending secret announcement");
      assert.equal(expectedMeters, actualAnnouncement[1], "fails sending secret announcement");
    })

    it('does not allows competitors to submit 2 announcements', async function(){
      let expectedMeters = 'encrypted_meters'
      await ab.sendAnnouncement(competitorName, expectedMeters, {from: competitor})
			return assertInvalidOpcode(async () => {
        await ab.sendAnnouncement(competitorName, expectedMeters, {from: competitor})
			})
    })

    it('adds competitor to competitors list', async function(){
      let expectedMeters = 'encrypted_meters'
      await ab.sendAnnouncement(competitorName, expectedMeters, {from: competitor})

      var expectedCompetitor = await ab.competitors.call(0);

      assert.equal(expectedCompetitor, competitor, "fails to add competitor");
    })

    describe('when box is locked', function(){
      beforeEach(async function() {
        await ab.lock({from: owner})
      })

      it('should not allow competitors to submit annoncement', async function() {
        let expectedMeters = 'encrypted_meters'
        return assertInvalidOpcode(async () => {
          await ab.sendAnnouncement(competitorName, expectedMeters, {from: competitor})
        })
      });
    });
  })
})
