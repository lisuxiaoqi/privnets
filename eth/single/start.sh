geth --identity single --rpc.enabledeprecatedpersonal  --rpc.allow-unprotected-txs  --nodiscover \
--http \
--http.api eth,web3,personal,net \
--datadir /Users/lc/nets/eth/single/data \
--networkid 66 --mine --miner.threads 1 \
--gcmode archive \
--miner.etherbase 0xac0c996558b8e6c7a241d0c965e6f8328482044e \
--unlock 0xac0c996558b8e6c7a241d0c965e6f8328482044e --allow-insecure-unlock --password pwd \
console 2>eth.log
