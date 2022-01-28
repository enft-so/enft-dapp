<script>
    
    let title = 'KatrinChi';
    let realName = 'Katrin Chirkova';
    let about = 'About';
</script>

<div class="flex w-full gap-4">
    <div>
        <img src="img/dummy_face.png" alt="" class="rounded-full w-32 grayscale" style="filter: grayscale(100%);" />
        <div class="flex gap-2 justify-center w-full mt-3">
            <i class="fab fa-twitter"></i>
            <i class="fab fa-instagram"></i>
            <i class="fas fa-globe"></i>
            <i class="far fa-clock"></i>
        </div>
    </div>
    <div class="flex-1">
        <div class=" font-bold font-sans">{title}</div>
        <div>{realName}</div>
        <div>{about}</div>
    </div>
    <div class="flex flex-col justify-between">
        <div class="flex gap-8 w-full justify-between">
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
            <i class="fas fa-upload"></i>
            <div class="cursor-pointer  py-1 px-4 border border-gray-900 rounded-sm"> Settings</div>
        </div>
    </div>
</div>
