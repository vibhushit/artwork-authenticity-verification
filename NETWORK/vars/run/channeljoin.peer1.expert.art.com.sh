#!/bin/bash
# Script to join a peer to a channel
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_ID=cli
export CORE_PEER_ADDRESS=192.168.221.156:7003
export CORE_PEER_TLS_ROOTCERT_FILE=/vars/keyfiles/peerOrganizations/expert.art.com/peers/peer1.expert.art.com/tls/ca.crt
export CORE_PEER_LOCALMSPID=expert-art-com
export CORE_PEER_MSPCONFIGPATH=/vars/keyfiles/peerOrganizations/expert.art.com/users/Admin@expert.art.com/msp
export ORDERER_ADDRESS=192.168.221.156:7011
export ORDERER_TLS_CA=/vars/keyfiles/ordererOrganizations/art.com/orderers/orderer3.art.com/tls/ca.crt
if [ ! -f "artchannel.genesis.block" ]; then
  peer channel fetch oldest -o $ORDERER_ADDRESS --cafile $ORDERER_TLS_CA \
  --tls -c artchannel /vars/artchannel.genesis.block
fi

peer channel join -b /vars/artchannel.genesis.block \
  -o $ORDERER_ADDRESS --cafile $ORDERER_TLS_CA --tls
