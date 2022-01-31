<script lang="ts">
	import ImageAvatar from './ImageAvatar.svelte';
    import { gallery } from "src/stores";
    import { push } from "svelte-spa-router";

    export let edit;

    function toggleEdit() {
        if (edit) {
            push("/" + $gallery.galleryName);
        } else {
            push("/" + $gallery.galleryName + "/edit");
        }
    }
</script>

<div class="flex w-full gap-4">
    <div>
        <ImageAvatar edit={edit}/>
        <div class="flex gap-2 justify-center w-full mt-4">
            {#if $gallery.twitter}<a href={$gallery.twitter}><i class="fab fa-twitter" /></a>{/if}
            {#if $gallery.instagram}<a href={$gallery.instagram}><i class="fab fa-instagram" /></a>{/if}
            {#if $gallery.homepage}<a href={$gallery.homepage}><i class="fas fa-globe" /></a>{/if}
            {#if $gallery.auctionhouse}<a href={$gallery.auctionhouse}><i class="far fa-clock" /></a>{/if}
            {#if $gallery.deviantart}<a href={$gallery.deviantart}><i class="fab fa-deviantart" /></a>{/if}
        </div>
    </div>
    <div class="flex-1">
        <div class=" text-primary text-2xl mb-2">{$gallery.galleryName}</div>
        {#if edit}
            <input
                class="w-full"
                on:input={(e) => gallery.setRealName(e.target.value)}
                placeholder="Real Name"
                value={$gallery.realName}
            />
        {:else if $gallery.realName}
            <div class="">{$gallery.realName}</div>
        {/if}
        {#if edit}
            <input
                class="text-gray-600 w-full"
                on:input={(e) => gallery.setDescription(e.target.value)}
                placeholder="drop a few words here"
                value={$gallery.galleryDescription}
            />
        {:else if $gallery.galleryDescription}
            <div class="text-gray-600">{$gallery.galleryDescription}</div>
        {/if}
        {#if edit}
            <input
                    class="text-gray-600 w-full"
                    on:input={(e) => gallery.setTwitter(e.target.value)}
                    placeholder="Twitter"
                    value={$gallery.twitter?$gallery.twitter :""}
                />
            <input
                    class="text-gray-600 w-full"
                    on:input={(e) => gallery.setInstagram(e.target.value)}
                    placeholder="Instagram"
                    value={$gallery.instagram?$gallery.instagram :""}
                />
            <input
                    class="text-gray-600 w-full"
                    on:input={(e) => gallery.setHomepage(e.target.value)}
                    placeholder="Homepage"
                    value={$gallery.homepage?$gallery.homepage :""}
                />
            <input
                    class="text-gray-600 w-full"
                    on:input={(e) => gallery.setErgoAuctionhouse(e.target.value)}
                    placeholder="ErgoAuctionhouse"
                    value={$gallery.auctionhouse?$gallery.auctionhouse :""}
                />
            <input
                    class="text-gray-600 w-full"
                    on:input={(e) => gallery.setDeviantArt(e.target.value)}
                    placeholder="DeviantArt"
                    value={$gallery.deviantart?$gallery.deviantart :""}
                />
        {/if}
    </div>
    <div class="flex flex-col justify-between">
        <div class="flex gap-8 w-full justify-between text-sm">
            <div>
                <div>Followers</div>
                <div>Following</div>
                <div>Likes</div>
            </div>
            <div class="text-right">
                <div>∞</div>
                <div>∞</div>
                <div>∞</div>
            </div>
        </div>
        <div class="flex justify-end gap-4 items-center">
            {#if !edit}
                <i class="fas fa-upload" />
            {/if}
            <div class="cursor-pointer  py-1 px-5 border border-gray-900 rounded-sm" on:click={toggleEdit}>
                {#if edit}
                    Done
                {:else}
                    Edit
                {/if}
            </div>
        </div>
    </div>
</div>
