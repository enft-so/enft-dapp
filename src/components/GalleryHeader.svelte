<script lang="ts">
    import { gallery } from "src/stores";
    import { push } from "svelte-spa-router";

    export let edit;
    function editMode() {
        push("/" + $gallery.galleryName + "/edit");
    }
</script>

<div class="flex flex-col gap-2 mt-6">
    <div class="text-primary text-4xl">
        {$gallery.galleryName}
    </div>
    {#if edit}
        <input class="text-gray-600" on:input={(e) => gallery.setDescription(e.target.value)} placeholder="drop a few words here" value={$gallery.galleryDescription} />
    {:else if $gallery.galleryDescription}
        <div class="text-gray-600">{$gallery.galleryDescription}</div>
    {/if}
    <div class="flex justify-end w-full">
        {#if $gallery.galleryName == $gallery.ownGallery && !edit}
        <div class="flex justify-end gap-4 items-center">
            <div class="cursor-pointer py-2 px-10 border border-gray-900 text-sm text-primary " on:click={editMode}>
                    Edit
            </div>
        </div>
        {/if}
    </div>
</div>
