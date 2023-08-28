FROM=gt11380m6lv6xr9fphasqunurpfus50h6eu4vgy8cvhrzayut9xkhju2zvfmergng55pee48u9
TO=0x8d63Bd4B972794b67aA83CDaf09dB5655b4e00CC
#1000GT
AMOUNT=1000000000000NANOGT

printf "before transfer, %s:%s\n" $FROM $(gatecli account balance $FROM)
printf "before transfer, %s:%s\n" $TO $(gatecli account balance $TO)

printf "transfer std tx from %s to %s\n" $FROM $TO
gatecli tx send --from $FROM $TO $AMOUNT --chain-id gate-66 --fees 100000NANOGT -y

sleep 5
printf "after transfer, %s:%s\n" $FROM $(gatecli account balance $FROM)
printf "after transfer, %s:%s\n" $TO $(gatecli account balance $TO)

