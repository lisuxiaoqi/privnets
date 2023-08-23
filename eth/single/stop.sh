ps -ef|grep -w -e "[g]eth"|awk '{print $2}'|xargs kill

ps -ef|grep -w -e "[g]eth"
