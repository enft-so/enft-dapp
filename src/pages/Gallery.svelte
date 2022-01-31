<script lang="ts">
    import EditGallery from "./../components/EditGallery.svelte";
    import Gallery404 from "./../components/Gallery404.svelte";
    import GalleryHeader from "../components/GalleryHeader.svelte";
    import Footer from "src/components/Footer.svelte";
    import NavHeader from "src/components/NavHeader.svelte";
    import PageLoading from "src/components/PageLoading.svelte";
    import LiveAuctions from "src/components/LiveAuctions.svelte";
    import OwnedArtworks from "src/components/OwnedArtworks.svelte";
    import { gallery, user } from "src/stores";
    import GallerySections from "src/components/GallerySections.svelte";
    import { getGalleryName, laodGalleryByName } from "src/enftapi";
    import ArtistProfile from "src/components/ArtistProfile.svelte";
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
            gallery.update(og=>{
                og.tokenId = g.tokenId
                og.twitter = g.twitter;
                og.instagram = g.instagram;
                og.homepage = g.homepage;
                og.auctionhouse = g.auctionhouse;
                og.deviantart = g.deviantart;
                return og;
            })

            notFound = false;

            if ($gallery.galleryName == $gallery.ownGallery) {
                await gallery.loadGalleryWithStashItems($user.bearer, $gallery.galleryName, $gallery.addresses);
            } else {
                await gallery.loadGallery($gallery.galleryName);
            }
            gallery.joinChannel("gallery:" + $gallery.galleryName, $user.bearer);
        } else {
            notFound = true;
        }
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
            <EditGallery />
        {:else}
            <div class=" max-w-5xl px-4 w-full">
                <ArtistProfile edit={editGallery} />
                <!-- <GalleryHeader edit={editGallery} /> -->

                <LiveAuctions edit={editGallery} mintingAddressList={$gallery.addresses} />
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
