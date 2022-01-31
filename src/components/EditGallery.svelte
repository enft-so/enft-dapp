<script lang="ts">
    import { flip } from "svelte/animate";
    import { dndzone } from "svelte-dnd-action";
    import { nanoid } from "nanoid";
    const flipDurationMs = 150;

    import EditSection from "./EditSection.svelte";
    import GalleryHeader from "./GalleryHeader.svelte";
    import GalleryStash from "./GalleryStash.svelte";
    import { gallery } from "src/stores";
    import { push } from "svelte-spa-router";
    import ArtistProfile from "./ArtistProfile.svelte";
    import LiveAuctions from "./LiveAuctions.svelte";
    import { onMount } from "svelte";

    function handleDndConsiderColumns(e) {
        gallery.updateSections(e.detail.items);
    }
    function handleDndFinalizeColumns(e) {
        gallery.updateSections(e.detail.items);
    }
    function handleItemFinalize(sectionId, newItems) {
        let sections = $gallery.sections;
        sections.find((s) => s.id == sectionId).items = newItems;
        gallery.updateSections(sections);
    }
    function handleStashItemFinalize(newItems) {
        gallery.updateStashItems(newItems);
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
        gallery.updateStashItems([...$gallery.sections.find((s) => s.id == id).items, ...$gallery.stash.items]);
        gallery.updateSections($gallery.sections.filter((s) => s.id != id));
    }

    function onDoneEditing() {
        push("/" + $gallery.ownGallery);
    }

    let header_mode = "GALLERY";
    onMount(() => {
        if ($gallery.galleryName == $gallery.ownGallery && $gallery.realName) {
            header_mode = "PROFILE";
        }
    });
</script>

<div class="flex">
    <div class="flex" style="width:400px; max-width:50%; height:100%; overflow-y:scroll; position:fixed;">
        <GalleryStash items={$gallery.stash.items} onDrop={(newItems) => handleStashItemFinalize(newItems)} />
    </div>
    <div class="px-4" style="margin-left:400px; width:1024px;">
        <div class="editable p-2">
            {#if "PROFILE" == header_mode}
                <ArtistProfile edit={true} />
            {:else}
                <GalleryHeader edit={true} />
            {/if}
            <div class="w-fill flex justify-end items-center gap-4 text-primary text-sm mt-10">
                <div>
                    <label>
                        <input type="radio" bind:group={header_mode} name="header_mode" value={"GALLERY"} style="accent-color: black;"/>
                        gallery
                    </label>
                </div>
                <div>
                    <label>
                        <input type="radio" bind:group={header_mode} name="header_mode" value={"PROFILE"} style="accent-color: black;"/>
                        profile
                    </label>
                </div>
                <div class="cursor-pointer  py-2 px-10 border border-gray-900  text-sm text-primary" on:click={onDoneEditing}>
                        Done
                </div>
            </div>
        </div>
        <!-- <LiveAuctions edit={true} /> -->
        <section
            use:dndzone={{ items: $gallery.sections, flipDurationMs, type: "column" }}
            on:consider={handleDndConsiderColumns}
            on:finalize={handleDndFinalizeColumns}
        >
            {#each $gallery.sections as { id, title, description, items }, idx (id)}
                <div animate:flip={{ duration: flipDurationMs }} class=" mt-10 editable">
                    <EditSection {id} {title} {description} {items} onDrop={(newItems) => handleItemFinalize(id, newItems)} />
                    <div class="w-full flex justify-end p-2">
                        <div class="text-primary text-sm cursor-pointer px-10 py-2 border border-gray-900 text-primary" on:click={() => deleteSection(id)}>delete section</div>
                    </div>
                </div>
            {/each}
        </section>
        <div style="height:200px;" class="mt-10 mb-6 flex items-center justify-center cursor-pointer editable" on:click={addSection}>
            <div class="text-primary text-sm px-10 py-2">add section</div>
        </div>
        <div class="w-full flex justify-end">
            <div class="text-primary text-center mt-2">
                <div class="mb-10 cursor-pointer text-sm px-10 py-2 bg-gray-900 text-gray-100" on:click={onDoneEditing}>done</div>
            </div>
        </div>
    </div>
</div>

<style>
</style>
