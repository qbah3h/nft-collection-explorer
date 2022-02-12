import TokenABI from "./token_abi.js"

document.addEventListener("DOMContentLoaded", () => {
    const web3 = new Web3(window.ethereum)
    
    document.getElementById("load_button").addEventListener("click", async () => {
        const wallet_address = document.getElementById("wallet_address").value
        let token_abi = document.getElementById("token_abi").value
        let contract_address = document.getElementById("contract_address").value
        if(!token_abi) {
            token_abi = TokenABI
        } else {
            token_abi = JSON.parse(token_abi)
        }
        if(!contract_address) {
            contract_address = '0x45DB714f24f5A313569c41683047f1d49e78Ba07'
        }
        const contract = new web3.eth.Contract(token_abi, contract_address)
        const wallet_balance = await contract.methods.balanceOf(wallet_address).call()

        document.getElementById("nfts").innerHTML = ""

        for (let i = 0; i < wallet_balance; i++) {
            const token_id = await contract.methods.tokenOfOwnerByIndex(wallet_address, i).call()

            let token_metadata_uri = await contract.methods.tokenURI(token_id).call()

            if (token_metadata_uri.startsWith("ipfs://")) {
                token_metadata_uri = `https://ipfs.io/ipfs/${token_metadata_uri.split("ipfs://")[1]}`
            }

            const token_metadata = await fetch(token_metadata_uri).then((response) => response.json())

            const token_element = document.getElementById("nft_template").content.cloneNode(true)
            token_element.querySelector("h1").innerText = token_metadata["name"]
            token_element.querySelector("a").href = `https://opensea.io/assets/${contract_address}/${token_id}`
            token_element.querySelector("img").src = token_metadata["image"]
            token_element.querySelector("img").alt = token_metadata["description"]

            document.getElementById("nfts").append(token_element)
        }
    })
})