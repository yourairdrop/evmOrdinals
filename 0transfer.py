from web3 import Web3
import time

# 配置
my_address = 'xxx' # 你的地址
private_key = 'xxx' # 你的私钥
to_address = 'xxx' # 转入的地址
node_url = 'https://neon-proxy-mainnet.solana.p2p.org'  # 例如Infura的URL
number_of_transactions = 200  # 你想要发送的交易数量
chain_id = 245022934 # 不同链不同id
hex_data = '0x6e656f6e3a2c7b2270223a226e6f732d3230222c226f70223a226d696e74222c227469636b223a226e656e73222c22616d74223a2231303030227d'
# 16进制数据，不用就删了


# 连接到Polygon网络
w3 = Web3(Web3.HTTPProvider(node_url))
if not w3.is_connected():
    print("Failed to connect to the network")
    exit(1)

# 获取初始nonce值
nonce = w3.eth.get_transaction_count(my_address)

# 发送交易
for i in range(number_of_transactions):
    # 初始化Gas价格
    gas_price = w3.eth.gas_price

    # 交易发送循环
    while True:
        try:
            # 创建交易
            tx = {
                'nonce': nonce,
                'to': to_address,
                'value': w3.to_wei(0, 'ether'),
                'gas': 21000,
                'gasPrice': gas_price,
                'chainId': chain_id,
                'data': hex_data # hex数据，不用就删了
            }

            # 签名交易
            signed_tx = w3.eth.account.sign_transaction(tx, private_key)

            # 发送交易
            tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)
            print(f"Transaction {i+1} sent, tx hash: {tx_hash.hex()}")

            # 等待交易被打包
            w3.eth.wait_for_transaction_receipt(tx_hash)

            # 成功发送交易后跳出循环
            break
        except ValueError as e:
            print(f"Error sending transaction: {e}")
            print("Increasing gas price and retrying...")
            # 提高Gas价格并重试
            gas_price = int(gas_price * 1.2)

    # 为下一个交易更新nonce值
    nonce = w3.eth.get_transaction_count(my_address)
    
    # 输出当前交易的结果，包括nonce
    print(f"Transaction {i+1} completed. Current nonce: {nonce}")
    time.sleep(1)

print("All transactions sent")