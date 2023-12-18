const { ethers } = require("ethers");
const config = require("./config");
const fs = require('fs');

// 连接到结点
const provider = new ethers.providers.JsonRpcProvider(config.rpcUrl);

// 创建钱包
const wallet = new ethers.Wallet(config.privateKey.trim(), provider);

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 转成16进制
const convertToHexa = (str = '') =>{
   const res = [];
   const { length: len } = str;
   for (let n = 0, l = len; n < l; n ++) {
      const hex = Number(str.charCodeAt(n)).toString(16);
      res.push(hex);
   };
   return `0x${res.join('')}`;
}

// 获取当前账户的 nonce
async function getCurrentNonce(wallet) {
  try {
    const nonce = await wallet.getTransactionCount("pending");
    console.log("Nonce:", nonce);
    return nonce;
  } catch (error) {
    console.error("Error fetching nonce:", error.message);
    throw error;
  }
}

// 获取当前主网 gas 价格
async function getGasPrice() {
  const gasPrice = await provider.getGasPrice();
  return gasPrice;
}

// 获取链上实时 gasLimit
async function getGasLimit(hexData, address) {
  const gasLimit = await provider.estimateGas({
    to: address,
    value: ethers.utils.parseEther("0"),
    data: hexData,
  });

  return gasLimit.toNumber();
}

// 检查交易状态
async function checkTransactionStatus(txHash) {
  while (true) {
    const txReceipt = await provider.getTransactionReceipt(txHash);
    if (txReceipt && txReceipt.confirmations) {
      console.log(`Transaction with hash ${txHash} confirmed`);
      break;
    }
    await sleep(5000); // 等待5秒后再次检查
  }
}

// 转账交易
async function sendTransaction(nonce) {
  const hexData	= convertToHexa(config.tokenJson.trim());
  // 获取实时 gasPrice
  const currentGasPrice = await getGasPrice();
  // 在当前 gasPrice 上增加 一定倍数
  const gasMultiple = parseInt(String(config.increaseGas * 100))
  const increasedGasPrice = currentGasPrice.div(100).mul(gasMultiple);
  // 获取钱包地址
  let address = await wallet.getAddress();
  if (config.receiveAddress !== "") {
    address = config.receiveAddress;
  }
  // 获取当前 gasLimit 限制
  const gasLimit = await getGasLimit(hexData, address);
  // 付费金额
  const payPrice = config.payPrice

  const transaction = {
    to: address,
    value: ethers.utils.parseEther(payPrice),
    data: hexData,
    nonce: nonce,
    gasPrice: increasedGasPrice,
    gasLimit: gasLimit,
  };

  try {
    const tx = await wallet.sendTransaction(transaction);
    console.log(`Transaction with nonce ${nonce} hash:`, tx.hash);
    await checkTransactionStatus(tx.hash); // 等待交易确认
  } catch (error) {
    console.error(`Error in transaction with nonce ${nonce}:`, error.message);
    throw error; // 发生错误时抛出异常，阻止循环继续
  }
}

// 错误日志函数
function logErrorToFile(error) {
  const timestamp = new Date().toISOString();
  const errorMessage = `[${timestamp}] Error: ${error.message}\n`;
  
  fs.appendFile('error_log.txt', errorMessage, (err) => {
    if (err) throw err;
    console.log('The error was logged to error_log.txt');
  });
}

// 发送多次交易
async function sendTransactions() {
  let i = 0;
  while (i < config.repeatCount) {
    try {
      const currentNonce = await getCurrentNonce(wallet); // 每次发送前获取当前nonce
      await sendTransaction(currentNonce);
      i++; // 仅在成功发送交易后递增
    } catch (error) {
      console.error(`Error sending transaction:`, error.message);
      logErrorToFile(error); // 记录错误到文件
      // 不增加i，所以将会重试
    }
    await sleep(config.sleepTime); // 根据配置的睡眠时间等待
  }
}

sendTransactions();
