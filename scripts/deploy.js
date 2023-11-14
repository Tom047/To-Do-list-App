const hre = require("hardhat");

async function main() {
    const signers = await hre.ethers.getSigners();
    if (signers.length === 0) {
        throw new Error("No signers found. Check your network configuration.");
    }

    const deployer = signers[0];
    console.log("Deploying contracts with the account:", deployer.address);

    const balance = await hre.ethers.provider.getBalance(deployer.address);
    console.log("Account balance:", balance.toString());

    const ToDoApp = await hre.ethers.getContractFactory("ToDoApp");
    // Convert 100000 Gwei to Wei
    const valueInWei = "1000000000"; // 100000 Gwei in Wei (100000 * 10^9)

    const toDoApp = await ToDoApp.deploy({
        value: valueInWei, // 100000 Gwei in Wei
        gasPrice: hre.ethers.parseUnits("1", "gwei") // Example gas price, adjust based on current network conditions
    });

    console.log("Awaiting confirmation...");
    await toDoApp.waitForDeployment(); // Wait for the deployment transaction
    console.log("ToDoApp deployed to:", toDoApp.target);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
