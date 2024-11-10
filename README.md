Artwork Authenticity Verification using Hyperledger Fabric
-----------------------------------------------------------

This project aims to provide a decentralized and transparent solution for verifying the authenticity of artwork using the Hyperledger Fabric blockchain framework.

Introduction
------------

Art forgery and counterfeit art are major challenges faced by the art industry. This project leverages the Hyperledger Fabric blockchain to ensure the authenticity and provenance of artwork. By recording and verifying the history of each artwork on the blockchain, art collectors, galleries, and artists can have confidence in the authenticity of the artwork they own or deal with.

Features
--------

- Creation and registration of new artworks on the blockchain.
- Verification of artwork ownership and authenticity.
- Tracking the history and provenance of artworks.
- Secure and immutable storage of artwork data.
- Integration with smart contracts for executing transactions and enforcing business logic.

Installation
------------

1. Clone the repository

2. Install the dependencies: (npm install)

3. Configure the Hyperledger Fabric Network
    - Open the terminal and navigate to the "Network" folder.
    - Run the following command to install all the required dependencies: (./installDependencies.sh )
    - Next, set up the "bin" folder by running the following command: (./installDependencies.sh bin ) ,This step will configure the "bin" folder, which contains various binaries required for network operations.
    - Start the Hyperledger Fabric network by running the following command: ( ./startNetwork.sh ) , This command will initiate the minifab network, allowing you to interact with the network and deploy smart contracts.
    - Launch Visual Studio Code and manually add the IBM Extension. If you don't have the IBM Extension, you can download it from this link: https://gitlab.com/CHF_KBA/kba_chf_ibmblockchainplatformextension_vscode/-/raw/main/ibm-blockchain-platform-2.0.8.vsix?inline=false.
    - Configure the wallets, environment, and gateways in the IBM Extension. This will establish the necessary connections and configurations to interact with the network.
    - Open the "Artwork" folder in Visual Studio Code, located in the chaincode directory. This folder contains the smart contract code for the Artwork contract.
    - Use the IBM Extension to package the smart contract. This step bundles the contract code and dependencies into a deployable package.
    - Deploy the smart contract onto the network using the IBM Extension. This will instantiate the contract on the network and make it available for transaction execution.
    - Utilize the configured gateways in the IBM Extension to perform various transactions on the network. You can execute functions defined in the smart contract and interact with the deployed contract.

By following these steps, you will have successfully set up the Hyperledger Fabric network, deployed the smart contract, and be ready to perform transactions using the gateways.

Usage
-----

1. You can use the IBM Extension to perform the transactions through different gateways.
2. You can also navigate to API directory and run node app.js in therminal and use the post man to interact with the network.

Contributing
------------

Contributions to this project are welcome! If you find any issues or have suggestions for improvements, please submit an issue or a pull request.

License
-------

license-free
