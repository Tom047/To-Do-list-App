const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ToDoApp", function () {
    let ToDoApp, toDoApp, owner, addr1;

    beforeEach(async function () {
        ToDoApp = await ethers.getContractFactory("ToDoApp");
        [owner, addr1] = await ethers.getSigners();
        toDoApp = await ToDoApp.deploy({ value: ethers.parseEther("10") });
        await toDoApp.waitForDeployment();
    });

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            expect(await toDoApp.owner()).to.equal(owner.address);
        });

        it("Should have initial reward pool", async function () {
            expect(await toDoApp.rewardPool()).to.equal(ethers.parseEther("10"));
        });
    });

    describe("Creating tasks", function () {
        it("Should create a new task and emit event", async function () {
            const taskCost = ethers.parseEther("1");
            const deadline = (await ethers.provider.getBlock('latest')).timestamp + 86400; // One day from now
            await expect(toDoApp.createTask("Task1", "Description1", taskCost, deadline))
                .to.emit(toDoApp, "TaskCreated")
                .withArgs(0, "Task1", deadline, owner.address);
        });
    });

    describe("Completing tasks", function () {
        it("Should allow completing a task", async function () {
            const taskCost = ethers.parseEther("1");
            const deadline = (await ethers.provider.getBlock('latest')).timestamp + 86400; // One day from now
            await toDoApp.createTask("Task1", "Description1", taskCost, deadline);

            await expect(toDoApp.completeTask(0))
                .to.emit(toDoApp, "TaskCompleted")
                .withArgs(0, owner.address);
        });

        it("Should fail to complete a non-existent task", async function () {
            await expect(toDoApp.completeTask(999)).to.be.revertedWith("Task does not exist");
        });

        it("Should fail to complete an already completed task", async function () {
            const taskCost = ethers.parseEther("1");
            const deadline = (await ethers.provider.getBlock('latest')).timestamp + 86400; // One day from now
            await toDoApp.createTask("Task1", "Description1", taskCost, deadline);
            await toDoApp.completeTask(0);

            await expect(toDoApp.completeTask(0)).to.be.revertedWith("Task already completed");
        });
    });

    describe("Reward distribution", function () {
        it("Should distribute rewards correctly", async function () {
            const initialBalance = await ethers.provider.getBalance(owner.address);
            const taskCost = ethers.parseEther("1");
            const reward = BigInt(taskCost) * BigInt(2);
            const deadline = (await ethers.provider.getBlock('latest')).timestamp + 86400;
            await toDoApp.createTask("Task1", "Description1", taskCost, deadline);
            await toDoApp.completeTask(0);

            const finalBalance = await ethers.provider.getBalance(owner.address);
            expect(finalBalance).to.be.closeTo(initialBalance + reward, ethers.parseEther("0.01"));
        });
    });

    describe("Access Control", function () {
        it("Should allow non-owners to access public functions", async function () {
            const taskCost = ethers.parseEther("1");
            const deadline = (await ethers.provider.getBlock('latest')).timestamp + 86400;

            // Attempt to call a public function from a non-owner account
            await expect(toDoApp.connect(addr1).createTask("Task1", "Description1", taskCost, deadline))
                .to.emit(toDoApp, "TaskCreated")
                .withArgs(
                    // Provide the expected values for id, title, deadline, and createdBy
                    0, // Assuming this is the first task and its ID is 0
                    "Task1",
                    deadline,
                    addr1.address // Assuming addr1 is the address that created the task
                );
        });
    });


    describe("Getting tasks", function () {
        it("Should return all tasks for a user", async function () {
            const taskCost = ethers.parseEther("1");
            const deadline = (await ethers.provider.getBlock('latest')).timestamp + 86400; // One day from now
            await toDoApp.createTask("Task1", "Description1", taskCost, deadline);
            await toDoApp.createTask("Task2", "Description2", taskCost, deadline);

            const tasks = await toDoApp.getTasks(owner.address);
            expect(tasks[0].length).to.equal(2); // Checking the number of tasks
            expect(tasks[1][0]).to.equal("Task1"); // Checking the title of the first task
            expect(tasks[1][1]).to.equal("Task2"); // Checking the title of the second task
        });
    });
});
