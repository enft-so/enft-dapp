<script lang="ts">
    export let auction
</script>

<a href={`https://ergoauctions.org/#/auction/specific/${auction.boxId}`} target="_blank">
<img src={auction.src} alt="" />
<div class="meta-info-padding px-4">
    <!-- <div class="text-primary mt-1">{auction.name}</div> -->
    <div class="w-full flex justify-between items-end mt-1">
        <div class= "text-sm leading-4">{auction.nextBid/ 1e9} Σ</div><div class="text-xs">{auction.timeLeft}</div>
    </div>
</div>
</a>

<style type="text/postcss">
    @media only screen and (max-width: 640px) {
        .meta-info-padding {
            padding:0
        }

    }
    @media only screen and (min-width: 641px) {
        .meta-info-padding {
            @apply px-4
        }

    }
</style>