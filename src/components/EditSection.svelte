<script lang="ts">
    import { flip } from "svelte/animate";
    import { dndzone } from "svelte-dnd-action";
    import { gallery } from "src/stores";

    export let id;
    export let title;
    export let description;
    export let items;
    export let onDrop;

    const flipDurationMs = 150;
    function handleDndConsider(e) {
        items = e.detail.items;
    }
    function handleDndFinalize(e) {
        items = e.detail.items;
        onDrop(items);
    }
    function editSectionTitle(e) {
        gallery.updateSectionTitle(id, e.target.value);
    }
    function editSectionDescription(e) {
        gallery.updateSectionDescription(id, e.target.value);
    }
</script>

<div class="p-2">
    <input class="text-primary w-full" placeholder="title" value={title} on:input={(e) => editSectionTitle(e)} />
    <input class="text-gray-600 w-full" placeholder="desciption" value={description} on:input={(e) => editSectionDescription(e)} />

    <section
        class="flex flex-wrap items-center gap-6 min-h-200"
        use:dndzone={{ items, flipDurationMs }}
        on:consider={handleDndConsider}
        on:finalize={handleDndFinalize}
    >
        {#each items as item (item.id)}
            <img src={item.src} alt="" class="width-3" animate:flip={{ duration: flipDurationMs }} />
        {/each}
    </section>
</div>

<style>
    .min-h-200 {
        min-height: 200px;
    }

    .width-3 {
        width: calc((100% - 3rem) / 3);
    }
</style>
