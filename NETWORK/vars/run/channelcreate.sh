#!/bin/bash
# Script to create channel block 0 and then create channel
cp $FABRIC_CFG_PATH/core.yaml /vars/core.yaml
cd /vars
export FABRIC_CFG_PATH=/vars
configtxgen -profile OrgChannel \
  -outputCreateChannelTx artchannel.tx -channelID artchannel

export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_ID=cli
export CORE_PEER_ADDRESS=192.168.221.156:7004
export CORE_PEER_TLS_ROOTCERT_FILE=/vars/keyfiles/peerOrganizations/artist.art.com/peers/peer1.artist.art.com/tls/ca.crt
export CORE_PEER_LOCALMSPID=artist-art-com
export CORE_PEER_MSPCONFIGPATH=/vars/keyfiles/peerOrganizations/artist.art.com/users/Admin@artist.art.com/msp
export ORDERER_ADDRESS=192.168.221.156:7009
export ORDERER_TLS_CA=/vars/keyfiles/ordererOrganizations/art.com/orderers/orderer1.art.com/tls/ca.crt
peer channel create -c artchannel -f artchannel.tx -o $ORDERER_ADDRESS \
  --cafile $ORDERER_TLS_CA --tls
