#!/bin/bash
while true
do
  for l in example # list config files here
  do
    echo -n "Running yours investor for ${l} at " ; date
    DEBUG=yours-investor NODE_ENV=${l} node index.js
    echo -n "Done running yours investor for ${l} at " ; date
  done
  napTime=$[ ( $RANDOM % 60 ) + 60 ]s
  echo -n "Sleeping for ${napTime} at " ; date
  sleep $napTime
done