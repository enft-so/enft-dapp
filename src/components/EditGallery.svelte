<script lang="ts">
    import { flip } from "svelte/animate";
    import { dndzone } from "svelte-dnd-action";
    import { nanoid } from 'nanoid'
    const flipDurationMs = 150;

    import EditSection from "./EditSection.svelte";
    import GalleryHeader from "./GalleryHeader.svelte";
    import GalleryStash from "./GalleryStash.svelte";
    import { gallery } from "src/stores";

    export let onDoneEditing;

    function handleDndConsiderColumns(e) {
        gallery.updateSections(e.detail.items)
    }
    function handleDndFinalizeColumns(e) {
        gallery.updateSections(e.detail.items)
    }
    function handleItemFinalize(sectionId, newItems) {
        let sections = $gallery.sections;
        sections.find(s => s.id == sectionId).items = newItems;
        gallery.updateSections(sections)
    }
    function handleStashItemFinalize(newItems) {
        gallery.updateStashItems(newItems)
    }

    function addSection() {
        const newSection = {
            id: nanoid(),
            title: "",
            description: "",
            items: [],
        };
        gallery.updateSections([...$gallery.sections, newSection]);
    }
    function deleteSection(id) {
        gallery.updateStashItems([ ...$gallery.sections.find((s) => s.id == id).items, ...$gallery.stash.items] )
        gallery.updateSections($gallery.sections.filter((s) => s.id != id));
    }
</script>

<div class="flex">
    <div class="flex" style="width:400px; max-width:50%; height:100%; overflow-y:scroll; position:fixed;">
        <GalleryStash items={$gallery.stash.items} onDrop={(newItems) => handleStashItemFinalize(newItems)} />
    </div>
    <div class="px-4" style="margin-left:400px; width:1024px;">
        <GalleryHeader edit={true} />
        <section
            use:dndzone={{ items: $gallery.sections, flipDurationMs, type: "column" }}
            on:consider={handleDndConsiderColumns}
            on:finalize={handleDndFinalizeColumns}
        >
            {#each $gallery.sections as { id, title, description, items }, idx (id)}
                <div animate:flip={{ duration: flipDurationMs }} class=" mt-10 editable">
                    <EditSection {id} {title} {description} {items} onDrop={(newItems) => handleItemFinalize(id, newItems)} />
                    <div class="w-full flex justify-end">
                        <div class="text-primary text-sm cursor-pointer px-10 py-2" on:click={() => deleteSection(id)}>delete section</div>
                    </div>
                </div>
            {/each}
        </section>
        <div style="height:200px;" class="mt-10 mb-6 flex items-center justify-center cursor-pointer editable" on:click={addSection}>
            <div class="text-primary text-sm px-10 py-2">add section</div>
        </div>
        <div class="w-full flex justify-end">
            <div class="text-primary text-xl  text-center mt-2">
                <div class="mb-10 cursor-pointer text-sm px-10 py-2 bg-gray-900 text-gray-100" on:click={onDoneEditing}>done</div>
            </div>
        </div>
    </div>
</div>

<style>
</style>
