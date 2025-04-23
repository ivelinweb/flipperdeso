import { ethers } from "ethers";
import Contract from "../../contracts/build/contracts/ProfileImageFactory.json"

// const provider = new ethers.providers.InfuraProvider('rinkeby2', INFURA_API_KEY);

const prepare = (provider) => {
    // Updated for Sei EVM Testnet (Atlantic-2)
    const contractAddress = '0xC6dD53Fc5ddAEA85EdbFdD149784C0B3cA6AFbD3'
    const contractABI = Contract.abi;
    const contract = new ethers.Contract(contractAddress, contractABI, provider);
    return contract;
}

export default async function createUserContract(provider){

    const contract = prepare(provider)

    const signer = await provider.getSigner();

    const contractWithSigner = contract.connect(signer);

    try{
        console.log("creating contract")
        const transaction = await contractWithSigner.createUserPhoto(60)
        transaction.wait();
        console.log("finished")
        console.log(transaction)
        return transaction;
    } catch (e) {
        console.log(e)
        return null;
    }
}
//   writeContractVariable();