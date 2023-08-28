const {ethers} = require("hardhat");
const CHAINID = 66;
const FROM = "0x8d63Bd4B972794b67aA83CDaf09dB5655b4e00CC"
const PRIVATE_KEY = "08a59286ea6759517e9cd2f01faf9625f0c7502d5401656a2ef5f3121c977f82"
const TO = "0xe1A3cD33b25487fdcf7ac5d347Dbd2A2Fe18bd07"

const contractABI = [
    {
        "inputs": [],
        "name": "get",
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
                "internalType": "uint256",
                "name": "x",
                "type": "uint256"
            }
        ],
        "name": "set",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

async function sendRawTransactionAsync(signedTx) {
    return new Promise((resolve, reject) => {
        web3.currentProvider.send(
            {
                jsonrpc: '2.0',
                method: 'eth_sendRawTransaction',
                params: [signedTx.rawTransaction],
                id: 253,
            },
            (err, result) => {
                if (err) {
                    console.log("Error", err);
                    reject(err);
                } else {
                    //console.log("OK", result);
                    resolve(result.result);
                }
            }
        );
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getTxReceipt(txHash, delayMs) {
    while (true) {
        const result = await web3.eth.getTransactionReceipt(txHash);
        if(result != null){
            console.log("TransactionReceipt", result);
            break;
        }
        await sleep(delayMs);
    }
}

async function transfer(){
    let b_from =  web3.utils.fromWei(await web3.eth.getBalance(FROM));
    let b_to =  web3.utils.fromWei(await web3.eth.getBalance(TO));
    console.log("before transfer, %s:%s", FROM, b_from);
    console.log("before transfer, %s:%s", TO, b_to);

    const nonce = await web3.eth.getTransactionCount(FROM, 'latest'); // nonce starts counting from 0

    const transaction = {
        'to': TO, // faucet address to return eth
        'value': 100000000000000000000, // 100 ETH
        'gas': 30000,
        'nonce': nonce,
        'maxPriorityFeePerGas':100,
        'maxFeePerGas':1000,
        'chainId': CHAINID
        // optional data field to send message or execute smart contract
    };

    const signedTx = await web3.eth.accounts.signTransaction(transaction, PRIVATE_KEY);
    //console.log(signedTx.rawTransaction);

    const txHash = await sendRawTransactionAsync(signedTx);
    console.log("TransactionHash:", txHash);

    if(txHash == '0x0000000000000000000000000000000000000000000000000000000000000000'){
        console.log("Send Tx failed!")
        return;
    }

    await getTxReceipt(txHash, 20);
    
    b_from =  web3.utils.fromWei(await web3.eth.getBalance(FROM));
    b_to =  web3.utils.fromWei(await web3.eth.getBalance(TO));
    console.log("after transfer, %s:%s", FROM, b_from);
    console.log("after transfer, %s:%s", TO, b_to);
}

async function deploy(deployer) {
    const Contract = await ethers.getContractFactory("Sample", deployer);
    const contract = await Contract.deploy();
    await contract.deployed();
    console.log("Contract deployed to address:", contract.address);
    return contract.address;
}

async function callByLegacy(contractAddress){
    const contract = new web3.eth.Contract(contractABI, contractAddress);
    //
    //get nonce
    const txCount = await web3.eth.getTransactionCount(FROM);

    const txObject = {
        'from': FROM,
        'to': contractAddress,
        'data': contract.methods.set(66).encodeABI(),
        'nonce': txCount,
        'gas': 30000
    };

    // 签名交易
    const signedTx = await web3.eth.accounts.signTransaction(txObject, PRIVATE_KEY);

    // 发送交易,调用set
    const txResult = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    console.log("Contract set result:", txResult)


    // 调用get
    const callResult = await contract.methods.get().call()
    console.log("Contract get result:", callResult)

    //手动调用eth_call,调用get
    const callResult2 = await web3.eth.call({
        to:contractAddress,
        data:contract.methods.get().encodeABI()
    })
    console.log("Contract get result by eth_call:", web3.utils.toDecimal(callResult2));

}

async function callBy1559(contractAddress){
     const contract = new web3.eth.Contract(contractABI, contractAddress);
    //
    //get nonce
    const txCount = await web3.eth.getTransactionCount(FROM);

    const txObject = {
        'from': FROM,
        'to': contractAddress,
        'data': contract.methods.set(1559).encodeABI(),
        'nonce': txCount,
        'gas': 30000,
        'maxPriorityFeePerGas':100,
        'maxFeePerGas':1000,
        'chainId': CHAINID
    };

    // 签名交易
    const signedTx = await web3.eth.accounts.signTransaction(txObject, PRIVATE_KEY);

    // 发送交易,调用set
    const txHash = await sendRawTransactionAsync(signedTx);
    console.log("TransactionHash:", txHash);

    if(txHash == '0x0000000000000000000000000000000000000000000000000000000000000000'){
        console.log("Send Tx failed!")
        return;
    }

    await getTxReceipt(txHash, 20);

   // 调用get
    const callResult = await contract.methods.get().call()
    console.log("Contract get result:", callResult)

    //手动调用eth_call,调用get
    const callResult2 = await web3.eth.call({
        to:contractAddress,
        data:contract.methods.get().encodeABI()
    })
    console.log("Contract get result by eth_call:", web3.utils.toDecimal(callResult2));

}

async function callByHardhat(contractAddress, deployer) {
    const Contract = await ethers.getContractFactory("Sample",deployer);
    const contract = await Contract.attach(contractAddress);
    const number = 22;
    console.log("Write to contract:", number);
    const tx = await contract.set(number);

    receipt = await tx.wait();
    console.log(receipt);

    const counter = await contract.get();
    console.log("Read from contract:", counter);
}

async function main(){
    console.log("----Transfer:")
    await transfer();

    const [deployer] = await ethers.getSigners();
    console.log(
        "Deploying contracts with the account:",
        deployer.address
    );

    console.log("----Contract deployment:")
    const address = await deploy(deployer);
    console.log("----Call with hardhat:")
    await callByHardhat(address,deployer);

    console.log("----Call with legacy:")
    await callByLegacy(address);

    console.log("----Call with 1559:")
    await callBy1559(address);
}

main();
