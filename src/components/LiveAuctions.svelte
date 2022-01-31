<script lang="ts">
    import { auctions } from "src/store";
    import AuctionItem from "./AuctionItem.svelte";

    export let mintingAddressList = [];
    export let edit;
    let displayLiveAuctions = true;
    function toggleLiveAuctions(){
        displayLiveAuctions = !displayLiveAuctions;
    }
</script>

{#if edit}
<div class="editable mt-12">
    <div class="flex justify-between w-full pt-2 px-4">
        <div class="text-primary">Ergoauctions</div>
        <div class="cursor-pointer " on:click={toggleLiveAuctions}>
            {#if displayLiveAuctions}
                <i class="far fa-eye"></i>
            {:else}
                <i class="far fa-eye-slash"></i>
            {/if}
        </div>
    </div>
    <div style="min-height:200px;" class=" mb-6 flex items-center justify-center">
        <!-- {#each mintingAddressList as address} -->
            <!-- <input class="text-gray-600" value={address} /> -->
        <!-- {/each} -->
    </div>
</div>
{:else if $auctions.filter((a) => mintingAddressList.some(address => address == a.artist)).length > 0}
    <div class="flex flex-col  mt-12">
        <div class="flex text-primary">
            <div>
                <div style="height:0.75em" />
                <div class="">Live Auctions</div>
            </div>
            <div>
                <div class="text-xs mt-1">({$auctions.filter((a) => mintingAddressList.some(address => address == a.artist)).length})</div>
                <div/>
            </div>
        </div>
        
        <div class="flex flex-wrap items-end gap-6 my-3">
            {#each $auctions.filter((a) => mintingAddressList.some(address => address == a.artist)) as auction}
                <div class=" wq-3 ">
                    <AuctionItem {auction} />
                </div>
            {/each}
        </div>
    </div>
{/if}

<style type="text/postcss">
    @media only screen and (max-width: 640px) {
        .wq-3 {
            width: calc((100%) / 2 - 1.5rem);
        }

    }
    @media only screen and (min-width: 641px) {
        .wq-3 {
            width: calc((100%) / 3 - 1rem);
        }

    }
</style>
