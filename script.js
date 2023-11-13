const contractAddress = '0xB6A529b4535c00c81F369de32f45B4C5C6169bF7';
const contractABI = [
    {
        "inputs": [],
        "stateMutability": "payable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "to",
                "type": "address"
            }
        ],
        "name": "RewardDistributed",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "completedBy",
                "type": "address"
            }
        ],
        "name": "TaskCompleted",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "title",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "deadline",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "createdBy",
                "type": "address"
            }
        ],
        "name": "TaskCreated",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "taskId",
                "type": "uint256"
            }
        ],
        "name": "completeTask",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "title",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "description",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "taskCost",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "deadline",
                "type": "uint256"
            }
        ],
        "name": "createTask",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            }
        ],
        "name": "getTasks",
        "outputs": [
            {
                "internalType": "uint256[]",
                "name": "",
                "type": "uint256[]"
            },
            {
                "internalType": "string[]",
                "name": "",
                "type": "string[]"
            },
            {
                "internalType": "string[]",
                "name": "",
                "type": "string[]"
            },
            {
                "internalType": "uint256[]",
                "name": "",
                "type": "uint256[]"
            },
            {
                "internalType": "uint256[]",
                "name": "",
                "type": "uint256[]"
            },
            {
                "internalType": "bool[]",
                "name": "",
                "type": "bool[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "rewardPool",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "userLists",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "title",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "description",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "taskCost",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "deadline",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "completed",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

let web3;
let contract;

window.addEventListener('load', async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        contract = new web3.eth.Contract(contractABI, contractAddress);
        // Set up the click event listener for the "Show Tasks" button
        document.getElementById('showTasks').addEventListener('click', loadTasks);
        // Set up the click event listener for the "Add" button
        document.getElementById('addTask').addEventListener('click', addNewTask);
    } else {
        console.log("Please install MetaMask");
    }
});

async function connectToMetaMask() {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
        try {
            const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
            console.log(accounts[0]); // You might want to do something with the connected account
        } catch (err) {
            console.error(err.message);
        }
    } else {
        console.log("Please install MetaMask");
    }
}

async function loadTasks() {
    try {
        // Ensure MetaMask is available and the user is connected
        if (typeof window.ethereum !== 'undefined') {
            // Request the user's account address
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const account = accounts[0];

            // Call the smart contract function to get the tasks array for the connected user
            const tasksData = await contract.methods.getTasks(account).call();

            // Select the task list element
            const taskList = document.getElementById('taskList');
            taskList.innerHTML = ''; // Clear current list

            // Assuming the lengths of all arrays are the same, use any of them to determine the number of tasks
            const numberOfTasks = tasksData[0].length;

            // Iterate over the length of the returned arrays
            for (let i = 0; i < numberOfTasks; i++) {
                // Create a list item for each task
                const listItem = document.createElement('li');
                // Create HTML for each task attribute and append it to the list item
                listItem.innerHTML = `
                    <p><strong>Task ID:</strong> ${tasksData[0][i]}</p>
                    <p><strong>Title:</strong> ${tasksData[1][i]}</p>
                    <p><strong>Description:</strong> ${tasksData[2][i]}</p>
                    <p><strong>Bounty:</strong> ${tasksData[3][i]}</p>
                    <p><strong>Deadline:</strong> ${new Date(parseInt(tasksData[4][i]) * 1000).toLocaleDateString()}</p>
                    <p><strong>Completed:</strong> ${tasksData[5][i]}</p>
                `;
                // Append the list item to the task list
                taskList.appendChild(listItem);
            }
        } else {
            console.log('Please install MetaMask!');
        }
    } catch (error) {
        console.error('Error loading tasks:', error);
    }
}


async function addNewTask() {
    console.log('RABOTAET!');
    // First, clear any existing error messages
    clearError();

    try {
        // Get values from input fields
        const taskTitle = document.getElementById('taskTitle').value.trim();
        const taskDescription = document.getElementById('taskDescription').value.trim();
        const bountyAmount = document.getElementById('bountyAmount').value.trim();
        const deadline = document.getElementById('deadline').value;

        // Check for empty fields and show an error if any are found
        if (!taskTitle || !taskDescription || !bountyAmount || !deadline) {
            displayError('Please fill in all the fields before adding a task.');
            return; // Exit the function early if any fields are empty
        }

        // Convert deadline to a Unix timestamp
        const deadlineTimestamp = new Date(deadline).getTime() / 1000;

        // Ensure MetaMask is available and the user is connected
        if (typeof window.ethereum !== 'undefined') {
            const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
            const account = accounts[0];

            // Call the smart contract function to create a new task
            await contract.methods.createTask(taskTitle, taskDescription, bountyAmount, deadlineTimestamp).send({from: account});

            // Optionally, clear the input fields and refresh the task list or give some user feedback here
            document.getElementById('taskTitle').value = '';
            document.getElementById('taskDescription').value = '';
            document.getElementById('bountyAmount').value = '';
            document.getElementById('deadline').value = '';

            // You can also add code here to update the UI to indicate that the task has been added successfully
        } else {
            console.log('Please install MetaMask!');
        }
    } catch (error) {
        console.error('Error adding new task:', error);
        displayError('Failed to add the task. Please try again.');
    }
}

async function completeTask() {
    try {
        // Get the task ID from the input field
        const taskId = document.getElementById('taskId').value.trim();
        if (!taskId) {
            displayError('Please enter a valid task ID.');
            return;
        }

        // Ensure MetaMask is available and the user is connected
        if (typeof window.ethereum !== 'undefined') {
            const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
            const account = accounts[0];

            // Call the smart contract function to complete the task
            await contract.methods.completeTask(taskId).send({from: account});

            // Optionally, refresh the task list or give some user feedback here
        } else {
            console.log('Please install MetaMask!');
        }
    } catch (error) {
        console.error('Error completing the task:', error);
        displayError('Failed to complete the task. Please try again.');
    }
}

// Set up the click event listener for the "Done" button
document.getElementById('rewardUser').addEventListener('click', completeTask);

function displayError(message) {
    const errorBanner = document.getElementById('errorBanner');
    if (!errorBanner) {
        // Create the error banner if it does not exist
        const newErrorBanner = document.createElement('div');
        newErrorBanner.id = 'errorBanner';
        newErrorBanner.textContent = message;
        newErrorBanner.style.color = 'red';
        newErrorBanner.style.padding = '10px';
        newErrorBanner.style.marginBottom = '10px';
        document.body.insertBefore(newErrorBanner, document.body.firstChild);
    } else {
        // Update the error banner if it already exists
        errorBanner.textContent = message;
        errorBanner.style.display = 'block'; // Make sure it's visible
    }
}

function clearError() {
    const errorBanner = document.getElementById('errorBanner');
    if (errorBanner) {
        errorBanner.style.display = 'none'; // Hide the error banner
    }
}


// Set up the click event listener for the "Show Tasks" button
document.getElementById('showTasks').addEventListener('click', loadTasks);