<script lang="ts">
import { uploadAvatar } from "src/enftapi";

import { gallery, user } from "src/stores";

    import { onMount } from "svelte";

    const AVA_PREFIX = "https://absole.io/ava/";

    export let edit;
    let avatar;

    let fileinput;
    let imgPlaceholder = "https://i.pravatar.cc/300";
    let MAX_AVATAR_PICTURE_SIZE = 1 * 1024 * 1024;

    const onFileSelected = (e) => {
        imageIsLargeError = MAX_AVATAR_PICTURE_SIZE < e.target.files[0].size;
        if (imageIsLargeError || e.target.files[0].size < 1) {
            return;
        }
        let image = e.target.files[0];
        let reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = (e) => {
            avatar = e.target.result;
            uploadAvatar({file: image, bearer: $user.bearer});
        };
    };

    function imageExists(img) {
        return fetch(img, { method: "HEAD" })
            .then((res) => {
                if (res.ok) {
                    return true;
                } else {
                    return false;
                }
            })
            .catch((err) => false);
    }

    let imageIsLargeError = false;
    onMount(() => {
        imageIsLargeError = false;
    });
</script>

<div class="relative w-36  h-36">
    {#if avatar}
        <img src={avatar} alt="" class="absolute rounded-full w-36  h-36" style="filter: grayscale(100%);" />
    {:else}
        {#await imageExists(AVA_PREFIX + $gallery.tokenId + '_profile')}
            <div class="absolute rounded-full w-36 h-36 bg-gray-500"></div>
        {:then hasProfilePicuture}
            {#if hasProfilePicuture}
                <img src={AVA_PREFIX + $gallery.tokenId + '_profile'} alt="" class="absolute rounded-full w-36 h-36" style="filter: grayscale(100%);" />
            {:else}
                <img src={imgPlaceholder} alt="" class="absolute rounded-full w-36  h-36" style="filter: grayscale(100%);" />
            {/if}
        {/await}
    {/if}

    {#if edit}
        <div
            class="absolute w-36 h-36 avatar-overlay cursor-pointer"
            on:click={() => {
                fileinput.click();
            }}
        >
            <div class="h-full w-full flex justify-center items-end p-3">
                {#if imageIsLargeError}
                    1MB max :(
                {:else}
                    <i class="fas fa-plus text-gray-600" />
                {/if}
            </div>
        </div>
    {/if}
    <input style="display:none" type="file" accept=".jpg, .jpeg, .png" on:change={(e) => onFileSelected(e)} bind:this={fileinput} />
</div>

<style>
    .avatar-overlay {
        background: linear-gradient(0deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.6) 30%, rgba(255, 255, 255, 0) 30%);
    }
</style>
