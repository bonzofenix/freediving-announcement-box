pragma solidity ^0.4.4;

import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

contract AnnouncementBox is Ownable{
 struct Announcement {
   string name;
   string meters;
   bool isValid;
 }

 event LogNewAnnouncement(string name, string meters);
 bool public locked = false;
 address public owner;

 mapping (address => Announcement) public announcements;
 address[100] public competitors;
 uint public competitorsCount;

 function AnnouncementBox() {
   owner = msg.sender;
 }

 function lock() onlyOwner public{
 	locked = true;
 }

 function sendAnnouncement(string _name, string _meters) public{
   Announcement storage a = announcements[msg.sender];

   require(!locked);
   require(keccak256(a.name) == keccak256(""));

   announcements[msg.sender] = Announcement(_name, _meters, true);
   competitors[competitorsCount] = msg.sender;
   competitorsCount++;
   LogNewAnnouncement(_name, _meters);
 }
}
