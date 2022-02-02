<script lang="ts">
    export let auction
</script>

<a href={`https://ergoauctions.org/#/auction/specific/${auction.boxId}`} target="_blank">
<img src={auction.src} alt="" />
<div class="meta-info-padding">
    <!-- <div class="text-primary mt-1">{auction.name}</div> -->
    <div class="w-full flex justify-between items-center mt-1 p-2">
        <div class="text-xs text-gray-600 bg-gray-300 rounded-sm px-1">{auction.timeLeft}</div>
        <div class= "text-sm leading-4">{auction.nextBid/ 1e9} Σ</div>
    </div>
</div>
</a>

<style type="text/postcss">
</style>