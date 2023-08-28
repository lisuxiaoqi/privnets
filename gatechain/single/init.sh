#/bin/bash
set -x
set -eo pipefail

CHAINID=gate-66
#address:gt11380m6lv6xr9fphasqunurpfus50h6eu4vgy8cvhrzayut9xkhju2zvfmergng55pee48u9
MNEMONIC="tobacco ankle suffer present believe choose sweet deliver coin sauce mix rich diamond gauge grape then burst purse interest potato buffalo silk upon pretty"


# clean cache files
rm -rf ~/.gated
rm -rf ~/.gatecli

# init config
gated init private --chain-id=$CHAINID


# create validator
gatecli account create validator1 --recover -m "$MNEMONIC"

# add validator to config (APP layer)
gated add-genesis-account $(gatecli account show-key validator1 -a) 1000000000000000000000000000NANOGT

# add validator to genesis.json (GateMint layer)
gated add-consensus-account $(gatecli account show-key validator1 -a)

# update config.json
sed -i '' 's/"IsWebSocketServerActive": false/"IsWebSocketServerActive":true/g' ~/.gated/config.json
sed -i '' 's/"IsIndexerActive": false/"IsIndexerActive": true/g' ~/.gated/config.json

echo "Init gated successfully"

