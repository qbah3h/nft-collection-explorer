import TokenABI from "./token_abi.js"

document.addEventListener("DOMContentLoaded", () => {
    const web3 = new Web3(window.ethereum)
    
    document.getElementById("load_button").addEventListener("click", async () => {
        const walletAddress = document.getElementById("wallet_address").value
        let token_abi = document.getElementById("token_abi").value
        let contract_address = document.getElementById("contract_address").value
        if(!token_abi) {
            token_abi = TokenABI
        }
        if(!contract_address) {
            contract_address = '0x45DB714f24f5A313569c41683047f1d49e78Ba07'
        }

        const contract = new web3.eth.Contract(token_abi, contract_address)
        contract.defaultAccount = walletAddress
        const walletBalance = await contract.methods.balanceOf(walletAddress).call()

        document.getElementById("nfts").innerHTML = ""

        for (let i = 0; i < walletBalance; i++) {
            const tokenId = await contract.methods.tokenOfOwnerByIndex(walletAddress, i).call()

            let tokenMetadataURI = await contract.methods.tokenURI(tokenId).call()

            if (tokenMetadataURI.startsWith("ipfs://")) {
                tokenMetadataURI = `https://ipfs.io/ipfs/${tokenMetadataURI.split("ipfs://")[1]}`
            }

            const tokenMetadata = await fetch(tokenMetadataURI).then((response) => response.json())

            const tokenElement = document.getElementById("nft_template").content.cloneNode(true)
            tokenElement.querySelector("h1").innerText = tokenMetadata["name"]
            tokenElement.querySelector("a").href = `https://opensea.io/assets/0x45db714f24f5a313569c41683047f1d49e78ba07/${tokenId}`
            tokenElement.querySelector("img").src = tokenMetadata["image"]
            tokenElement.querySelector("img").alt = tokenMetadata["description"]

            document.getElementById("nfts").append(tokenElement)
        }
    })
})