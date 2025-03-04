#!/bin/bash
# Script to check node readyness

changes=0
loopindex=0
until [ $changes -ge 1 ] || [ $loopindex -gt 10 ]; do
  val=$(wget -O- http://orderer3.art.com:7060/metrics 2>&1 | grep '^consensus_etcdraft_leader_changes{channel=' || true)
  if [ ! -z "$val" ]; then
    changes=$(echo $val | cut -d ' ' -f 2)
  fi
  sleep 2
  loopindex=$((loopindex+1))
done
