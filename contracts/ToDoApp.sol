// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ToDoApp {
    struct ToDo {
        uint id;
        string title;
        string description;
        uint taskCost;
        uint deadline;
        bool completed;
    }

    address public owner;
    uint256 public rewardPool;
    mapping(address => ToDo[]) public userLists;
    mapping(address => uint) private nextTaskIdForUser;

    event TaskCreated(uint id, string title, uint deadline, address createdBy);
    event TaskCompleted(uint id, address completedBy);
    event RewardDistributed(uint amount, address to);

    constructor() payable {
        owner = msg.sender;
        rewardPool = msg.value;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    function createTask(string memory title, string memory description, uint taskCost, uint deadline) public {
        require(rewardPool >= taskCost * 2, "Insufficient balance in reward pool");
        require(deadline > block.timestamp, "Deadline should be in the future");

        uint taskId = nextTaskIdForUser[msg.sender]++;
        ToDo memory newTask = ToDo(taskId, title, description, taskCost, deadline, false);
        userLists[msg.sender].push(newTask);

        emit TaskCreated(taskId, title, deadline, msg.sender);
    }

    function completeTask(uint taskId) public {
        ToDo[] storage tasks = userLists[msg.sender];
        require(taskId < tasks.length, "Task does not exist");

        ToDo storage task = tasks[taskId];
        require(!task.completed, "Task already completed");
        require(block.timestamp <= task.deadline, "Deadline has passed");

        task.completed = true;
        distributeReward(task.taskCost);
        emit TaskCompleted(taskId, msg.sender);
    }

    function distributeReward(uint taskCost) internal {
        require(rewardPool >= taskCost * 2, "Insufficient reward pool balance");
        uint256 reward = taskCost * 2;
        rewardPool -= reward;
        payable(msg.sender).transfer(reward);
        emit RewardDistributed(reward, msg.sender);
    }

    function getTasks(address user) public view returns (uint[] memory, string[] memory, string[] memory, uint[] memory, uint[] memory, bool[] memory) {
        ToDo[] storage tasks = userLists[user];
        uint[] memory ids = new uint[](tasks.length);
        string[] memory titles = new string[](tasks.length);
        string[] memory descriptions = new string[](tasks.length);
        uint[] memory taskCosts = new uint[](tasks.length);
        uint[] memory deadlines = new uint[](tasks.length);
        bool[] memory completeds = new bool[](tasks.length);

        for (uint i = 0; i < tasks.length; i++) {
            ToDo storage task = tasks[i];
            ids[i] = task.id;
            titles[i] = task.title;
            descriptions[i] = task.description;
            taskCosts[i] = task.taskCost;
            deadlines[i] = task.deadline;
            completeds[i] = task.completed;
        }

        return (ids, titles, descriptions, taskCosts, deadlines, completeds);
    }
}