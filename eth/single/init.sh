rm -rf /Users/lc/nets/eth/single/data
rm -rf eth.log
geth --datadir /Users/lc/nets/eth/single/data  init /Users/lc/nets/eth/single/genesis.json

rm -rf  /Users/lc/nets/eth/single/data/keystore
cp -r keystore /Users/lc/nets/eth/single/data/
