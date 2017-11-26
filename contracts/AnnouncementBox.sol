pragma solidity ^0.4.4;

import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

contract AnnouncementBox is Ownable{
  event Test(string str);
  bool public locked = false;
  address public owner;
  mapping (address => string) public secretAnnouncements;

  function AnnouncementBox() {
    owner = msg.sender;
  }

  function lock() onlyOwner public{
		locked = true;
  }

  function sendSecretAnnouncement(string _secretDepth) public{
    require(!locked);
    Test(_secretDepth);
    secretAnnouncements[msg.sender] = _secretDepth;
    Test(secretAnnouncements[msg.sender]);
  }

  function revealSecretAnnouncement(string _pin) public{
    require(!locked);
    Test(_pin);
  }
}
