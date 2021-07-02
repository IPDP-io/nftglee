#!/bin/bash


while true
do
  docker exec -it silliquid elements-cli -datadir=/config generatetoaddress 1 $(docker exec -it silliquid elements-cli -datadir=/config getnewaddress)
  sleep 8
done
