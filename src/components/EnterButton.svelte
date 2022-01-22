<script lang="ts">
    import { nfts, wallet, WalletStates } from "src/store";
    import LoaderEllipsis from "./../components/LoaderEllipsis.svelte";
    import { push } from "svelte-spa-router";
    import { getGalleryName, loadMemberTokenIds, nftlogin } from "src/enftapi";
    import { gallery, user } from "src/stores";
    import { isYoroiWalletAccessibleForRead, requestYoroiWalletReadAcess, sendNFtToSelf } from "src/yoroiDappConnector";

    let dappConnectorInstalled = true;
    let walletConnectionError = false;
    let hasMemberNft = false;

    async function validateMemberNft() {
        console.log("validateMemberNft");
        console.log("$nfts", $nfts);
        const memberNfts = await loadMemberTokenIds();

        //TODO: wait till wallet nfts are loaded
        const ownedMemberNfts = $nfts.filter((nft) => memberNfts.some((id) => id == nft.tokenId));
        if (ownedMemberNfts.length > 0) {
            hasMemberNft = true;
            return ownedMemberNfts;
        }
    }

    async function enter() {
        // already logged in?
        if ($user.bearer) {
            const galleryName = await getGalleryName($user.bearer);
            if (galleryName) {
                gallery.setOwnGallery(galleryName);
                push("/" + galleryName);
                return;
            }
        }

        if (!$wallet.dappConnectorInstalled) {
            dappConnectorInstalled = false;
            return;
        }
        try {
            // TODO: optional wallet initialization
            await wallet.initDappConnectorYoroiWallet();
            const ownedAccessNfts = await validateMemberNft();
            if (ownedAccessNfts.length > 0) {
                const tokenId = ownedAccessNfts[0].tokenId;
                const canRead = await isYoroiWalletAccessibleForRead();
                if (!canRead) {
                    await requestYoroiWalletReadAcess();
                    // probably need a loop here, since focus loss might have given a rejection....
                }
                let signedTx = await sendNFtToSelf(tokenId);
                if (signedTx) {
                    const authToken = await nftlogin(tokenId, signedTx);
                    if (authToken) {
                        console.log({ authToken });
                        user.setBearer(authToken);

                        const galleryName = await getGalleryName($user.bearer);
                        if (galleryName) {
                            gallery.setOwnGallery(galleryName);
                            push("/" + galleryName);
                            return;
                        } else {
                            push("/new");
                            return;
                        }
                    }
                }
            }
        } catch (e) {
            walletConnectionError = true;
        }
    }
</script>

{#if dappConnectorInstalled}
    {#if !walletConnectionError}
        {#if $wallet.connectorWalletState == WalletStates.UNINITIALIZED}
            <div class="text-primary text-xl  text-center mt-2">
                <div class="cursor-pointer text-sm px-10 py-2 bg-gray-900 text-gray-100" on:click={enter}>enter</div>
            </div>
        {:else if $wallet.connectorWalletState == WalletStates.INITIALIZING || $wallet.connectorWalletState == WalletStates.FETCHING}
            <div class="text-center mt-2">
                <div class="text-sm px-10 py-2 bg-gray-900 text-gray-100" style="height:36px;">
                    <LoaderEllipsis />
                </div>
            </div>
        {:else if hasMemberNft}
            <div class="text-sm text-gray-600  text-center mt-2">Waiting for Yoroi  to sign... no funds will leave your wallet.</div>
        {:else if !hasMemberNft}
            <div class="text-sm text-gray-600  text-center mt-2">Required Member NFT not owned by address:</div>
            <div class="text-sm text-gray-600  text-center mt-2">{$wallet.changeAddress}</div>
        {/if}
    {:else}
        <div class="text-sm  text-center mt-2">There is an issue with Yoroi. Join Discord or Telegram for help.</div>
    {/if}
{:else}
    <div class="text-gray-600 py-2">
        Please install
        <a class="font-bold" href="https://chrome.google.com/webstore/detail/yoroi-nightly/poonlenmfdfbjfeeballhiibknlknepo" target="blank">Yoroi Nightly.</a>
    </div>
{/if}
