pragma solidity ^0.4.4;

import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

contract AnnouncementBox is Ownable{
  event Test(string str);
  bool public locked = true;
  address public owner;
  mapping (address => string) public secretAnnouncements;

  function AnnouncementBox() {
    owner = msg.sender;
  }

  function unlock() onlyOwner public{
		locked = false;
  }

  function sendSecretAnnouncement(string _secretDepth) public{
    Test(_secretDepth);
    secretAnnouncements[msg.sender] = _secretDepth;
    Test(secretAnnouncements[msg.sender]);
  }

  function revealSecretAnnouncement(string _pin) public{
    require(!locked);
    Test(_pin);
  }
}
