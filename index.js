require("dotenv").config();
const Web3 = require("web3");
const abi = require("./abi/strategybase.json");

async function contractcall() {
  const provider = process.env.PROVIDER;
  const contractAddrsStr = process.env.CONTRACT_ADDRESSES;
  const contractAddrs = contractAddrsStr.split(",");
  const ownerPrivKey = process.env.OWNER_PRIVKEY;
  const ownerAddr = process.env.OWNER_ADDRESS;

  const web3 = new Web3(provider);
  web3.eth.accounts.wallet.add({
    privateKey: ownerPrivKey,
    address: ownerAddr,
  });
  
  const gasPrice = await web3.eth.getGasPrice();
  console.log(`Gas price is ${gasPrice}`);

  console.log('Multi harvest started.');
  const harvest = async (contractAddr) => {
    const contract = new web3.eth.Contract(abi, contractAddr);
    await contract.methods.harvest().send({
      from: ownerAddr,
      gasPrice,
      gas: 5000000,
    });
  }
  const multiHarvest = [];
  for (let i = 0, ni = contractAddrs.length; i < ni; i++) {
    multiHarvest.push(harvest(contractAddrs[i].trim()))
  }
  await Promise.all(multiHarvest);
  console.log('Multi harvest completed.');
}

contractcall();
