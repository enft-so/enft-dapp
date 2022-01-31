<script lang="ts">
    import { gallery } from "src/stores";
    import { push } from "svelte-spa-router";

    export let edit;
    function editMode() {
        push("/" + $gallery.galleryName + "/edit");
    }
</script>

<div class="flex flex-col gap-2 mt-6" class:editable={edit} class:p-2={edit}>
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
            <div class="cursor-pointer mt-2 text-gray-500 text-sm" on:click={editMode}><i class="fas fa-edit" /> edit</div>
        {/if}
    </div>
</div>
