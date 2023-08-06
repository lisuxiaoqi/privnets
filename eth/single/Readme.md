## 运行
* 初始化网络： ./init.sh
* 运行网络： ./start.sh

## 文件说明
* genesis.json。创世区块文件
* keystore。矿工账号及地址
* pwd。矿工的keystore密码
* standard-dev.json。参考用，zksync测试用的创世区块文件
* bak文件。其他可供参考的备份文件

## 其他
采用了clique共识运行本地链，可以避免pos挖矿问题。

启动后可通查看状态：
```azure
//查看节点状态
admin.nodeInfo
//查看最新区块
eth.blockNumber
```
