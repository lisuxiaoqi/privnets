const { ethers } = require("hardhat");
async function deploy(deployer) {
    const Contract = await ethers.getContractFactory("Sample", deployer);
    const contract = await Contract.deploy();
    await contract.deployed();
    console.log("Contract deployed to address:", contract.address);
    return contract.address;
}

async function call(contractAddress, deployer) {
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
    const [deployer] = await ethers.getSigners();
    console.log(
        "Deploying contracts with the account:",
        deployer.address
    );

    const address = await deploy(deployer);
    await call(address,deployer);
}

main() .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
