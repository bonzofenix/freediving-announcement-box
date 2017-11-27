pragma solidity ^0.4.4;

import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

contract AnnouncementBox is Ownable{
  //struct CompetitorAnnoncement {
  //  string name;
  //  string meters;
  //}

  event Test(string str);
  bool public locked = false;
  address public owner;

  mapping (address => string) public announcements;
  address[100] public competitors;
  uint public competitorsCount;

  function AnnouncementBox() {
    owner = msg.sender;
  }

  function lock() onlyOwner public{
		locked = true;
  }

  function sendAnnouncement(string _meters) public{
    require(!locked);
    Test(_meters);
    announcements[msg.sender] = _meters;
    competitors[competitorsCount] = msg.sender;
    competitorsCount++;
    Test(announcements[msg.sender]);
  }
}
