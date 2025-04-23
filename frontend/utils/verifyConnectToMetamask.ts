// @ts-nocheck
import { switchToSeiNetwork } from './seiNetworkConfig';

export const verifyConnectToMetamask = async () => {
    if (typeof window.ethereum !== 'undefined') {
        // Try to switch to Sei network first
        const switched = await switchToSeiNetwork();
        if (!switched) {
            console.warn('Failed to switch to Sei network');
        }

        // Get accounts
        return await window.ethereum.request({ method: 'eth_accounts' })
    }
    else {
        throw new Error('Metamask not installed');
    }
}