require("dotenv").config();
const Web3 = require("web3");
const abi = require("./abi/strategybase.json");

async function contractcall() {
  let web3 = new Web3(process.env.PROVIDER);
  const contract = new web3.eth.Contract(abi, process.env.CONTRACT_ADDRESS);
  const gasPrice = await web3.eth.getGasPrice();
  web3.eth.accounts.wallet.add({
    privateKey: process.env.OWNER_PRIVKEY,
    address: process.env.OWNER_ADDRESS,
  });

  await contract.methods
    .harvest()
    .send({
      from: process.env.OWNER_ADDRESS,
      gasPrice,
      gas: 5000000
    });
}

contractcall();
