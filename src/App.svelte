<script lang="ts">
    import Router from "svelte-spa-router";
    import Home from "./pages/Home.svelte";
    import Lab from "./pages/Lab.svelte";
    import Gallery from "./pages/Gallery.svelte";
    import { onDestroy, onMount } from "svelte";
    import { getCurrentAuctions } from "./auctions";
    import { auctions } from "./store";
    import GalleryOnboarding from "./pages/GalleryOnboarding.svelte";
    import { gallery } from "./stores";

    const routes = {
        // Exact path
        "/": Lab,
        //"/": Home,
        "/new": GalleryOnboarding,
        "/:title/:action?": Gallery,
    };

    let auctionsUpdateIntervall;
    let auctionsUpdateRemainingTimeIntervall;

    function calculateRemainingTime(auction) {
        let timeLeft;
        const intervall = {
            start: new Date(),
            end: new Date(auction.endTime),
        };
        if (intervall.end.getTime() < intervall.start.getTime()) {
            timeLeft = "00 : 00 : 00";
        } else {
            let ms = intervall.end.getTime() - intervall.start.getTime();
            let x = ms / 1000;
            let seconds = (Math.round(x % 60) + "").padStart(2, "0");
            x /= 60;
            let minutes = (Math.round(x % 60) + "").padStart(2, "0");
            x /= 60;
            let hours = (Math.round(x % 24) + "").padStart(2, "0");
            x /= 24;
            let days = (Math.round(x % 24) + "").padStart(2, "0");
            timeLeft = (+days > 0 ? days : "") + " : " + hours + " : " + minutes + " : " + seconds;
        }

        auction.timeLeft = timeLeft;
        return auction;
    }

    function updateAuctions() {
        getCurrentAuctions().then((a) => auctions.update(() => a.map(calculateRemainingTime)));
    }

    function updateAllRemainingTime() {
        auctions.update((a) => a.map(calculateRemainingTime));
    }

    onMount(() => {
        //updateAuctions();
        //auctionsUpdateIntervall = setInterval(updateAuctions, 10000);
        //auctionsUpdateIntervall = setInterval(updateAllRemainingTime, 1000);
        gallery.initSocket();
    });

    onDestroy(() => {
        clearInterval(auctionsUpdateIntervall);
        clearInterval(auctionsUpdateRemainingTimeIntervall);
    });
</script>

<Router {routes} restoreScrollState={true} />
