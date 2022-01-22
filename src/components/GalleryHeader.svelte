<script lang="ts">
    import { gallery } from "src/stores";

    export let edit;
    function editDescription(e) {
        const description = e.target.value;
        gallery.setDescription(description);
    }
</script>

<div class="flex flex-col gap-2 mt-6" class:editable={edit} class:p-2={edit}>
    <div class="text-primary text-4xl">
        {$gallery.galleryName}
    </div>
    {#if edit}
        <input class="text-gray-600" on:input={(e) => editDescription(e)} placeholder="drop a few words here" value={$gallery.galleryDescription} />
    {:else if $gallery.galleryDescription}
        <div class="text-gray-600">{$gallery.galleryDescription}</div>
    {/if}
</div>
