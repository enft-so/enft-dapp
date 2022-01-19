<script lang="ts">
    import Footer from "src/components/Footer.svelte";
    import { getGalleryName, isNameAvailable, registerGalleryName } from "src/enftapi";
import app from "src/main";
    import { gallery, user } from "src/stores";
    import { onMount } from "svelte";
    import { push } from "svelte-spa-router";
    export let params;

    let newGalleryHint = "Choose your gallery name, it can NOT be changed later.";
    const registrationFailed = "Gallery Name registration failed.";

    const MIN_LENGTH = 6;
    const MAX_LENGTH = 24;
    let galleryName = "";
    let isUnique = false;
    async function setGalleryNameAndContinue() {
        if (isUnique) {
            const registered = await registerGalleryName({galleryName, bearer: $user.bearer});
            if (!registered) {
                newGalleryHint = registrationFailed;
                return false;
            } else {
                gallery.setName(galleryName);
                push("/" + galleryName + "/edit");
            }
        }
    }

    async function checkIfGalleyNameIsUnique() {
        isUnique = false;
        if (galleryName.length >= MIN_LENGTH) {
            isUnique = await isNameAvailable(galleryName);
            console.log({isUnique})
        }
    }

    //TODO: letters and numbers
    function onKeyDown(e) {
        let inputValue = e.target.value;
        e.target.value = inputValue
            .split("")
            .filter((c) => c.match(/[A-Za-z0-9]/))
            .join("");
        galleryName = e.target.value;
        checkIfGalleyNameIsUnique();
    }

    onMount(async () => {
        let name = await getGalleryName();
        if (name) {
            push("/" + name);
        }
    });
</script>

<div class="min-h-full flex flex-col">
    <div class="w-full flex flex-col items-center justify-center flex-1" style="min-height:100vh;">
        <div class="">
            <div>{newGalleryHint}</div>
            <input
                type="text"
                class="text-primary text-4xl leading-6 mt-2"
                spellcheck="false"
                maxlength={MAX_LENGTH}
                placeholder="GalleryName"
                on:keydown={(e) => {
                    return onKeyDown(e);
                }}
                on:input={(e) => onKeyDown(e)}
                value = "KatrinCh"
            />
            <div class="text-sm">
                <div><i class="far fa-check-square" /> don't be evil ;)</div>
                <div>
                    {#if 6 <= galleryName.length && galleryName.length <= 24}
                        <i class="far fa-check-square" />
                    {:else}
                        <i class="far fa-square" />
                    {/if}
                    length 6 - 24
                </div>
                <div>
                    {#if isUnique}
                        <i class="far fa-check-square" />
                    {:else}
                        <i class="far fa-square" />
                    {/if}
                    unique
                </div>
            </div>
            <div class="text-primary text-xl  text-center mt-8">
                <div class="cursor-pointer text-sm px-10 py-2 bg-gray-900 text-gray-100" on:click={setGalleryNameAndContinue}>continue</div>
            </div>
        </div>
    </div>
    <Footer />
</div>
