#!/bin/bash
# Script to instantiate chaincode
cp $FABRIC_CFG_PATH/core.yaml /vars/core.yaml
cd /vars
export FABRIC_CFG_PATH=/vars

export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_ID=cli
export CORE_PEER_ADDRESS=192.168.221.156:7004
export CORE_PEER_TLS_ROOTCERT_FILE=/vars/keyfiles/peerOrganizations/artist.art.com/peers/peer1.artist.art.com/tls/ca.crt
export CORE_PEER_LOCALMSPID=artist-art-com
export CORE_PEER_MSPCONFIGPATH=/vars/keyfiles/peerOrganizations/artist.art.com/users/Admin@artist.art.com/msp
export ORDERER_ADDRESS=192.168.221.156:7011
export ORDERER_TLS_CA=/vars/keyfiles/ordererOrganizations/art.com/orderers/orderer3.art.com/tls/ca.crt

# 1. Fetch the channel configuration
peer channel fetch config config_block.pb -o $ORDERER_ADDRESS \
  --cafile $ORDERER_TLS_CA --tls -c artchannel

# 2. Translate the configuration into json format
configtxlator proto_decode --input config_block.pb --type common.Block \
  | jq .data.data[0].payload.data.config > artchannel_current_config.json
echo "--<<-->>--"

# 3. Update the current config in json with the organization anchor peer we want to add
jq '.channel_group.groups.Application.groups."artist-art-com".values += {"AnchorPeers":{"mod_policy": "Admins","value":{"anchor_peers": [{"host": "192.168.221.156","port": 7004}]},"version": "0"}}' artchannel_current_config.json > artchannel_modified_anchor_config.json

# 4. Translate the current config in json format to protobuf format
configtxlator proto_encode --input artchannel_current_config.json \
  --type common.Config --output config.pb

# 5. Translate the desired config in json format to protobuf format
configtxlator proto_encode --input artchannel_modified_anchor_config.json \
  --type common.Config --output modified_config.pb

# 6. Calculate the delta of the current config and desired config
configtxlator compute_update --channel_id artchannel \
  --original config.pb --updated modified_config.pb \
  --output artchannel_anchor_update.pb

# 7. Decode the delta of the config to json format
configtxlator proto_decode --input artchannel_anchor_update.pb \
  --type common.ConfigUpdate | jq . > artchannel_anchor_update.json

# 8. Now wrap of the delta config to fabric envelop block
echo '{"payload":{"header":{"channel_header":{"channel_id":"artchannel", "type":2}},"data":{"config_update":'$(cat artchannel_anchor_update.json)'}}}' | jq . > artchannel_anchor_update_envelope.json

# 9. Encode the json format into protobuf format
configtxlator proto_encode --input artchannel_anchor_update_envelope.json \
  --type common.Envelope --output artchannel_anchor_update_envelope.pb

# 10. Need to sign anchor update envelop by org admin
peer channel update -o $ORDERER_ADDRESS --tls --cafile $ORDERER_TLS_CA \
  -f artchannel_anchor_update_envelope.pb -c artchannel
