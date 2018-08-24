pragma solidity ^0.4.24;

import "./SafeMath.sol";
import "./Blacklist.sol";

contract Voting {
    using SafeMath for uint256;
    struct Poll {
        address target;
        bool ban; //true = ban, false = unban
        uint256 startTime;
        uint256 endTime;
        address[] joinedAdresses;
        bool result;
        bool ended;
    }

    Blacklist public blacklistContract;
    
    mapping(address => bool) public isTarget;
    mapping(address => mapping (uint256 => bool)) public votesByAddress;
    mapping(address => mapping (uint256 => bool)) public joinedByAddress;
    //mapping(address => bool) banned;
    
    Poll[] public polls;
    
    event PollCreatedSuccess(address _from, address _target);
    event VoteSuccess(address _from, uint256 _id);
    
    modifier onlyGoodMan() {
        require(!blacklistContract.inBlacklist(msg.sender) && !isTarget[msg.sender], "banned or is target of a poll");
        _;
    }
    
//////////////////////////////////////////////////////////////////
   
    constructor (address _blacklistAddress) public{
        blacklistContract = Blacklist(_blacklistAddress);
    }
    
    function pollCreate(address _target, bool _ban, uint256 _startTime, uint256 _endTime) public {
        require(!isTarget[_target], "is target of a poll");
        require(blacklistContract.inBlacklist(_target) != _ban, "already banned or unbanned");
        isTarget[_target] = true;
        Poll memory _poll;
        _poll.target = _target;
        _poll.ban = _ban;
        _poll.startTime = _startTime;
        _poll.endTime = _endTime;
        polls.push(_poll);
        emit PollCreatedSuccess(msg.sender, _target);
    }
    
    function vote(uint256 id, bool agree) public onlyGoodMan {
        require(id < polls.length, "id not exist");
        Poll memory poll = polls[id];
        require(now >= poll.startTime && now <= poll.endTime, " not during voting time");
        
        if (!joinedByAddress[msg.sender][id]) {
            joinedByAddress[msg.sender][id] = true;
            polls[id].joinedAdresses.push(msg.sender);
        }
        
        votesByAddress[msg.sender][id] = agree;
        emit VoteSuccess(msg.sender, id);
    }
    
    function isSubjectApproved(uint256 yesCounter, uint256 noCounter) internal pure returns(bool) {
        return yesCounter > noCounter;
    }
    
    function getPollResult(uint256 id) private view returns(bool) {
        require(id < polls.length, "id not exist");
        Poll memory poll = polls[id];
        uint256 yesCounter = 0;
        uint256 noCounter = 0;
        for (uint256 i = 0; i < poll.joinedAdresses.length; i++ ) {
            address _address = poll.joinedAdresses[i];
            bool voteValue = votesByAddress[_address][id];
            if (voteValue) yesCounter = yesCounter.add(_address.balance); else 
            noCounter = noCounter.add(_address.balance);
        }
        return isSubjectApproved(yesCounter, noCounter);
    }
    
    function pollEnforce(uint256 id) private {
        require(id < polls.length, "id not exist");
        Poll memory poll = polls[id];
        //vote to ban
        if (poll.ban)
        blacklistContract.addAddressToBlacklist(poll.target); else 
        //vote to unban
        blacklistContract.removeAddressFromBlacklist(poll.target);
    }
    
    function tryToFinalize(uint256 id) public returns(bool) {
        require(id < polls.length, "id not exist");
        Poll memory poll = polls[id];
        if ((now < poll.endTime) || (poll.ended)) {
            return false;
        }
        poll.result = getPollResult(id);
        delete poll.joinedAdresses;
        if (poll.result) pollEnforce(id);
        poll.ended = true;
        isTarget[poll.target] = false;
        return true;
    }
    
    function testAddWithCall(address _address) public {
        blacklistContract.addAddressToBlacklist(_address);
    }
    
    function testRemoveWithCall(address _address) public {
        blacklistContract.removeAddressFromBlacklist(_address);
    }
}