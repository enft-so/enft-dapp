<script lang="ts">
    import EditGallery from "./../components/EditGallery.svelte";
    import Gallery404 from "./../components/Gallery404.svelte";
    import GalleryHeader from "../components/GalleryHeader.svelte";
    import Footer from "src/components/Footer.svelte";
    import NavHeader from "src/components/NavHeader.svelte";
    import PageLoading from "src/components/PageLoading.svelte";
    import LiveAuctions from "src/components/LiveAuctions.svelte";
    import OwnedArtworks from "src/components/OwnedArtworks.svelte";
    import { push } from "svelte-spa-router";
    import { gallery, user } from "src/stores";
    import GallerySections from "src/components/GallerySections.svelte";
    import { getGalleryName, laodGalleryByName } from "src/enftapi";
    export let params;

    let loading = false;
    let notFound = false;

    let editGallery = false;

    $: titleParam = params.title;
    $: actionParam = params.action;
    $: laodGallery(titleParam);
    $: handleAction(actionParam);

    async function handleAction(actionParam) {
        if (actionParam == "edit") {
            editGallery = true;
        } else {
            editGallery = false;
        }
    }

    async function laodGallery(titleParam) {
        const galleryName = await getGalleryName($user.bearer);
        if (galleryName) gallery.setOwnGallery(galleryName);

        const g = await laodGalleryByName(titleParam);
        if (g) {
            gallery.setName(g.name);
            gallery.setDescription(g.description);
            gallery.setAddresses(g.addresses);
            notFound = false;

            if ($gallery.galleryName == $gallery.ownGallery) {
                await gallery.loadGalleryWithStashItems($user.bearer, $gallery.galleryName, $gallery.addresses);
            }
            else {
                await gallery.loadGallery($gallery.galleryName);
            }
            gallery.joinChannel("gallery:" + $gallery.galleryName, $user.bearer);
        } else {
            notFound = true;
        }
    }

    function onDoneEditing() {
        push("/" + titleParam);
    }
    function editMode() {
        push("/" + titleParam + "/edit");
    }
</script>

<div class="min-h-full flex flex-col">
    <div class="w-full flex flex-col items-center flex-1" style="min-height:100vh;">
        <NavHeader />
        {#if loading}
            <PageLoading />
        {:else if notFound}
            <Gallery404 />
        {:else if editGallery}
            <EditGallery {onDoneEditing} />
        {:else}
            <div class=" max-w-5xl px-4 w-full">
                <GalleryHeader edit={editGallery} />
                <div class="flex justify-end w-full">
                    {#if titleParam == $gallery.ownGallery}
                        <div class="cursor-pointer mt-2 text-gray-500 text-sm" on:click={editMode}><i class="fas fa-edit" /> edit</div>
                    {/if}
                </div>
                <LiveAuctions mintingAddressList={$gallery.addresses} />
                <!-- {#if galleryNfts.length > 0}
                    <OwnedArtworks ownedNfts={galleryNfts} />
                {/if} -->
                <GallerySections />
            </div>
        {/if}
    </div>
    {#if !editGallery}
        <Footer />
    {/if}
</div>
