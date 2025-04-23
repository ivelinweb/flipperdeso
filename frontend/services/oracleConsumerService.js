import { ethers } from "ethers";
import Contract from "../../contracts/build/contracts/Donation.json"

// Updated for Sei EVM Testnet (Atlantic-2)
const prepare = (provider) => {
    // Deployed Donation contract address on Sei EVM Testnet
    const contractAddress = '0xB433a6F3c690D17E78aa3dD87eC01cdc304278a9';
    const contractABI = Contract.abi;
    const contract = new ethers.Contract(contractAddress, contractABI, provider);
    return [contract, contractAddress, contractABI];
}

function readDataFeed(contract) {
    const res = contract.getPriceData()
    return res
}


function convertRating(usdInput, seiwei) {
    const convertedData = seiwei / 10000000000000000n;
    const usdToSei = usdInput / Number(convertedData);
    return usdToSei;
}

export default async function donateAmount(provider, recipient, usdAmount){

    console.log(`Recipient: ${recipient} | Amount: ${usdAmount}`)

    const [contract, contractAddress, contractABI] = prepare(provider)

    console.log("getting signer")
    const signer = await provider.getSigner();

    console.log("getting contract w. signer")
    const contractWithSigner = contract.connect(signer);

    console.log("reading data feed")
    const oracleSei = await readDataFeed(contract);
    console.log("data feed read", oracleSei)

    if (!oracleSei) return "Oracle Error";

    console.log("converting rating")
    const usdToSei = convertRating(usdAmount, oracleSei);
    console.log("converted!", usdToSei)

    const options = {value: ethers.parseEther(usdToSei.toString())}

    console.log("Making transaction")
    try{
        const transaction = await contractWithSigner.transferFunds(recipient, options)
        transaction.wait();
        console.log("finished")
        return "OK";
    } catch (e) {
        console.log(e)
        return "Transaction Error";
    }
}
//   writeContractVariable();