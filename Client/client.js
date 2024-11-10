const {profile} =require('./profile')
const {Wallets,Gateway} =require('fabric-network')
const path=require('path')
const fs=require('fs')

class ClientApplication{
    async generateAndSubmitTxn(role,identityLabel,channelName,chaincodeName,contractName,txnType,transientData,txnName,...args){
        let gateway=new Gateway()
        try{
            this.Profile=profile[role.toLowerCase()]
           // console.log(">>>>>>>>>",this.Profile)
            const ccpPath=path.resolve(this.Profile["CP"])
            const ccp=JSON.parse(fs.readFileSync(ccpPath,'utf-8'))
            let wallet=await Wallets.newFileSystemWallet(this.Profile["Wallet"])
            await gateway.connect(ccp,{wallet,identity:identityLabel,discovery:{enabled:true,asLocalhost:true}})
            let channel=await gateway.getNetwork(channelName)
            let contract=await channel.getContract(chaincodeName,contractName)
            let result
            if(txnType=="invokeTxn"){
            result=await contract.submitTransaction(txnName,...args)
            }else if(txnType=="queryTxn"){
            result=await contract.evaluateTransaction(txnName,...args)
            }else{
                result=await contract.createTransaction(txnName).setTransient(transientData).submit(...args)
            }
            return result
        }catch(error){
            console.log("Error occured",error)
        }finally{
            console.log("Disconnect from the gateway")
            gateway.disconnect()
        }
    }
}
module.exports={ClientApplication} 

