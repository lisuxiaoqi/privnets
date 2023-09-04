echo "\n[Init test environment]"
cd txtest
(cd hardhat;npm install)

# choose network configured in hardhat
export NETWORK=gtlocal

# test std transfer
echo "\n[Test transfer from std account to eth account]"
bash std_transfer.sh

# test eth transfer
echo "\n[Test transfer from eth account to eth account]"
bash eth_transfer.sh

# test contract deployment and call
echo "\n[Test contract deployment and call]"
bash contract.sh

# test eip1559
echo "\n[Test EIP1559]"
bash eip1559.sh
