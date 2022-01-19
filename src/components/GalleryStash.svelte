<script lang="ts">
    import { flip } from "svelte/animate";
    import { dndzone } from "svelte-dnd-action";
    import { gallery } from "src/stores";

    export let items;
    export let onDrop;

    const flipDurationMs = 150;
    function handleDndConsider(e) {
        items = e.detail.items;
    }
    function handleDndFinalize(e) {
        items = e.detail.items;
        console.log("Stash::handleDndFinalize", items);
        onDrop(items);
        //
        //gallery.updateStashItems(...items);
    }
</script>

<section
    class="flex flex-wrap items-center gap-2 min-h-200 editable pr-2"
    style="height: max-content; min-height:100%;width:100%;"
    use:dndzone={{ items, flipDurationMs }}
    on:consider={handleDndConsider}
    on:finalize={handleDndFinalize}
>
    {#each items as item (item.id)}
        <img src={item.src} alt="" class="width-2" animate:flip={{ duration: flipDurationMs }} />
    {/each}
</section>

<style>
    .min-h-200 {
        min-height: 200px;
    }

    .width-2 {
        width: calc((100% - 1rem) / 2);
    }
</style>
