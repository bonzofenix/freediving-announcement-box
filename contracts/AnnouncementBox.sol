pragma solidity ^0.4.4;

import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

contract AnnouncementBox is Ownable{
  //struct CompetitorAnnoncement {
  //  string name;
  //  string meters;
  //}

  event Test(string str);
  event LogNewAnnouncement(string meters, string name);
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
    require( keccak256(announcements[msg.sender]) == keccak256(""));
    Test(_meters);
    announcements[msg.sender] = _meters;
    competitors[competitorsCount] = msg.sender;
    competitorsCount++;
    LogNewAnnouncement(_meters, 'name');
    Test(announcements[msg.sender]);
  }
}
