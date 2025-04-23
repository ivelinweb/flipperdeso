// Sei EVM Testnet (Atlantic-2) configuration
export const seiNetworkConfig = {
  chainId: '0x530', // 1328 in hex
  chainName: 'Sei EVM Testnet (Atlantic-2)',
  nativeCurrency: {
    name: 'SEI',
    symbol: 'SEI',
    decimals: 18
  },
  rpcUrls: ['https://evm-rpc-testnet.sei-apis.com'],
  blockExplorerUrls: ['https://seitrace.com/?chain=atlantic-2']
};

// Function to add Sei network to MetaMask
export const addSeiNetworkToMetaMask = async () => {
  if (!window.ethereum) {
    alert('MetaMask is not installed!');
    return false;
  }

  try {
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [seiNetworkConfig]
    });
    return true;
  } catch (error) {
    console.error('Error adding Sei network to MetaMask:', error);
    return false;
  }
};

// Function to switch to Sei network
export const switchToSeiNetwork = async () => {
  if (!window.ethereum) {
    alert('MetaMask is not installed!');
    return false;
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: seiNetworkConfig.chainId }]
    });
    return true;
  } catch (error) {
    // This error code indicates that the chain has not been added to MetaMask
    if (error.code === 4902) {
      return await addSeiNetworkToMetaMask();
    }
    console.error('Error switching to Sei network:', error);
    return false;
  }
};
