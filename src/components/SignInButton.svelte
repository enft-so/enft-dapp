<script lang="ts">
    import { nfts, wallet, WalletStates } from "src/store";
    import LoaderEllipsis from "./../components/LoaderEllipsis.svelte";
    import { push } from "svelte-spa-router";
    import { getGalleryName, loadMemberTokenIds } from "src/enftapi";
    import { gallery, user } from "src/stores";

    let dappConnectorInstalled = true;
    let walletConnectionError = false;
    let missingMemberNft = false;

    async function validateMemberNft() {
        const memberNfts = await loadMemberTokenIds();
        if ($nfts.some((nft) => memberNfts.some((id) => id == nft.tokenId))) {
            console.log('has member nft')
            missingMemberNft = false;
        } else {
            missingMemberNft = true;
        }
    }

    async function enter() {
        if($user.bearer){
            const galleryName = await getGalleryName($user.bearer);
            if(galleryName){
                gallery.setOwnGallery(galleryName);
                push("/"+galleryName);
                return;
            }
        }
        push("/");
        return;

        if (!$wallet.dappConnectorInstalled) {
            dappConnectorInstalled = false;
            return;
        }
        try {
            await wallet.initDappConnectorYoroiWallet();
            await validateMemberNft();
            if (!missingMemberNft) {
                push("/gallery");
            }
        } catch (e) {
            walletConnectionError = true;
        }
    }
</script>

{#if $user.bearer}
    <div class="cursor-pointer p-4 text-gray-500 text-sm" on:click={user.signout}>SIGN OUT</div>
{:else}
    <div class="cursor-pointer p-4 text-gray-500 text-sm" on:click={enter}>SIGN IN</div>
<!-- {:else if dappConnectorInstalled}
    {#if !walletConnectionError}
        {#if $wallet.connectorWalletState == WalletStates.UNINITIALIZED}
            <div class="cursor-pointer p-4 text-gray-500 text-sm" on:click={enter}>SIGN IN</div>
        {:else if $wallet.connectorWalletState == WalletStates.INITIALIZING || $wallet.connectorWalletState == WalletStates.FETCHING}
            <div class="text-sm px-10 py-2 " style="height:36px;">
                <LoaderEllipsis bg="gray" />
            </div>
        {:else if missingMemberNft}
            <div>
                <div class="text-sm text-gray-600  mt-2">Required Membership NFT not owned by address:</div>
                <div class="text-sm text-gray-600  pr-4">{$wallet.changeAddress}</div>
            </div>
        {/if}
    {:else}
        <div class="text-gray-500 text-sm text-center p-4 mt-2">There is an issue with Yoroi. Join Discord or Telegram for help.</div>
    {/if}
{:else}
    <div class="text-gray-500 text-sm p-4 py-2">
        Please install
        <a class="font-bold" href="https://chrome.google.com/webstore/detail/yoroi/ffnbelfdoeiohenkjibnmadjiehjhajb/reviews" target="blank">Yoroi.</a>
    </div> -->
{/if}
