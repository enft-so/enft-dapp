<script lang="ts">
    export let ownedNfts = [];
</script>

<div class="flex flex-col  mt-12">
    <div class="flex text-primary">
        <div>
            <div style="height:0.75em" />
            <div class="">Owned</div>
        </div>
        <div>
            <div class="text-xs mt-1">({ownedNfts.length})</div>
            <div />
        </div>
    </div>
    
    <div class="flex flex-wrap items-end gap-6 my-3">
        {#each ownedNfts as nft}
            <div class=" wq-3 ">
                <img src={nft.src} alt="" />
            </div>
        {/each}
    </div>
</div>

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
