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

  const gasPrice = parseInt((await web3.eth.getGasPrice()) * 1.5);
  const nonce = (await web3.eth.getTransactionCount(ownerAddr)) + 1;
  console.log(`Gas price is ${gasPrice}`);

  console.log("Multi harvest started.");
  const harvest = async (contractAddr, nonce) => {
    const contract = new web3.eth.Contract(abi, contractAddr);
    await contract.methods.harvest().send({
      from: ownerAddr,
      gasPrice,
      gas: 10000000,
      nonce,
    });
  };
  for (let i = 0, ni = contractAddrs.length; i < ni; i++) {
    console.log("Harvest: " + contractAddrs[i]);
    await harvest(contractAddrs[i].trim(), nonce + i);
  }
  console.log("Multi harvest completed.");
}

contractcall();
