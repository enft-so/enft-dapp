<script lang="ts">
    import EnterButton from "src/components/EnterButton.svelte";
    import Footer from "src/components/Footer.svelte";
</script>

<div class="w-full flex flex-col justify-between min-h-full  ">
    <div class="w-full flex justify-center items-center flex-1" style="min-height:100vh">
        <div>
            <div class="flex flex-col items-center">
                <div class="text-primary text-6xl  text-dark-800">ENFT</div>
                <div class="text-primary text-xl  text-center mt-2">
                    <span class="text-gray-600 ml-16 ">Share&nbsp;your&nbsp;Art</span>
                    |
                    <span class="text-gray-600">Show&nbsp;your&nbsp;Collection</span>
                </div>
                <EnterButton />
            </div>
        </div>
    </div>
    <Footer />
</div>

<style type="text/postcss">
    .text-primary {
        font-family: "Roboto Slab", serif;
        font-weight: 300;
    }
</style>
