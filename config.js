const config = {
    // 你想要打多少张，这里就设置多少，建议单次别超过 50，不然容易不上链
    repeatCount: 50000,

    // 在当前的 gas 基础上增加多少倍
    increaseGas: 1.2,

    // 每一笔交易停顿多久（毫秒为单位，1000=1秒）
    sleepTime: 1000,

    // 付费金额（默认为 0 转
    payPrice: "0",

    // 你钱包的私钥
    privateKey: "xxxx",

    // 接收地址（也可以是合约地址），如果为空就是给自己发。
    receiveAddress: "xxxxxx",

    // 铭文json数据（替换成你想打的铭文json格式数据）
    //tokenJson: 'data:,{"p":"fair-20","op":"mint","tick":"fair","amt":"1000"}',
	//tokenJson: data:,{"a":"NextInscription","p":"oprc-20","op":"mint","tick":"PoS","amt":"10"}
    tokenJson: 'data:,{"p":"grc-20","op":"mint","tick":"gors","amt":"10"}',

    // RPC结点（兼容 evm 链都行）打哪条链就用哪条链的节点地址
    // eth =>  https://mainnet.infura.io/v3
    // arb => https://arb1.arbitrum.io/rpc
    // polygon => https://polygon-rpc.com
    // op => https://mainnet.optimism.io
    // linea => https://mainnet.infura.io/v3
    // scroll => https://rpc.scroll.io
    // zks => https://mainnet.era.zksync.io
    // bnbchain => https://bsc-dataseed1.bnbchain.org
    // conflux = > https://evm.confluxrpc.com

    // rpcUrl: "https://arb1.arbitrum.io/rpc"
    rpcUrl: "https://rpc.ankr.com/eth_goerli"
}

module.exports = config
