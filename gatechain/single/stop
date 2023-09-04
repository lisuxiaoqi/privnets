#!/bin/bash
#set -eo pipefail

echo "Stopping rpc server"
ps -ef|grep -e "[e]vm rest-server"|awk '{print $2}'|xargs kill

echo "Stopping gated"
ps -ef|grep -w -e "[g]ated"|awk '{print $2}'|xargs kill


echo "Stopped"
ps -ef|grep -e "[e]vm rest-server"
ps -ef|grep -w -e "[g]ated"

exit 0
