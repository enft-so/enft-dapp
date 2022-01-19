<script lang="ts">
    import { gallery } from "src/stores";
</script>
    
    {#each $gallery.sections.filter(s => s.items?.length > 0) as section}
        <div class="mt-10">
            
            <div class="text-primary w-full" placeholder="title">{section.title}</div>
            <div class="text-gray-600 w-full mb-6"  placeholder="desciption">{section.description}</div>
            <section 
                class="flex flex-wrap items-center gap-6 min-h-200  mb-20">

                {#each section.items as item}
                        <img src={item.src} alt="" class="width-3"/>
                {/each}
            </section>
        </div>
    {/each}

<style>
    .min-h-200{
        min-height: 200px;
    }

    .width-3 {
        width:calc((100% - 3rem )/3);
    }
</style>