import { writable } from 'svelte/store';
import { loadPicturesByTokenIds, loadPicturesFromAddress} from './auctions';

export enum WalletStates {
    UNINITIALIZED,
    FETCHING,
    FETCHING_SUCCESS,
    INITIALIZING,
    CONNECTED,
    ACCESS_DENIED,
}
import {getChangeAddress, isYoroiDappConnectorInstalled, loadErgBalanceFromYoroiWallet, loadTokensFromYoroiWallet, requestYoroiWalletReadAcess} from "./yoroiDappConnector"

export const auctions = writable([]);
export const nfts = writable([]);

let NOTIFY_SUCCESS_DURATION = 2000;


function createWallet() {
	const { subscribe, update } = writable({
        dappConnectorInstalled: isYoroiDappConnectorInstalled(),
        changeAddress: null,
        initDappConnectorOnLoad: !(localStorage.getItem("b_init_wallet_on_load") === null),
        connectorWalletState: WalletStates.UNINITIALIZED,
        nanoErgBalance: null,
    });

	return {
		subscribe,
		disconnectConnetorWallet: () => update(wallet => {
            localStorage.removeItem("b_init_wallet_on_load")
            wallet.initDappConnectorOnLoad = false;
            wallet.connectorWalletState = WalletStates.UNINITIALIZED
            return wallet
        }),
        updateConnectorState: (state)=> update(wallet =>{
            wallet.connectorWalletState = state;
            return wallet
        }),
        initDappConnectorYoroiWallet: async() => {
                window.removeEventListener("ergo_wallet_disconnected", wallet.disconnectConnetorWallet);
                window.addEventListener("ergo_wallet_disconnected", wallet.disconnectConnetorWallet);
            
                wallet.updateConnectorState(WalletStates.INITIALIZING);

                 const access = await requestYoroiWalletReadAcess();
                if (access) {
                    localStorage.setItem("b_init_wallet_on_load", JSON.stringify(true));
                    update(wallet => {wallet.initDappConnectorOnLoad = true; return wallet})
                    wallet.updateConnectorState(WalletStates.FETCHING);
                    const nanoErgBalance = await loadErgBalanceFromYoroiWallet();
                    const changeAddress = await getChangeAddress();
                    update(wallet => {wallet.nanoErgBalance = nanoErgBalance; wallet.changeAddress = changeAddress; return wallet})

                    const walletNfts = await loadTokensFromYoroiWallet();
                    const pictures = await loadPicturesByTokenIds(Object.keys(walletNfts));
                    nfts.update(nfts => pictures)

                    wallet.updateConnectorState(WalletStates.FETCHING_SUCCESS);
                    setTimeout(() => {
                        wallet.updateConnectorState(WalletStates.CONNECTED);
                    }, NOTIFY_SUCCESS_DURATION);
                } else {
                    wallet.updateConnectorState(WalletStates.ACCESS_DENIED);
                    throw new Error('ACCESS_DENIED')
                }
        },
    }
}

export const wallet = createWallet()
