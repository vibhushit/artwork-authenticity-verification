#!/bin/bash
cd $FABRIC_CFG_PATH
# cryptogen generate --config crypto-config.yaml --output keyfiles
configtxgen -profile OrdererGenesis -outputBlock genesis.block -channelID systemchannel

configtxgen -printOrg artist-art-com > JoinRequest_artist-art-com.json
configtxgen -printOrg expert-art-com > JoinRequest_expert-art-com.json
configtxgen -printOrg gallery-art-com > JoinRequest_gallery-art-com.json
