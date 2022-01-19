<script lang="ts">
  export let size = 32;
  export let bg = "#ffffff";
  let root = document.documentElement;
  root.style.setProperty("--loader-ellipsis-translate", (3 * size) / 10 + "px");
  root.style.setProperty("--loader-ellipsis-left", size / 10 + "px");
  root.style.setProperty("--loader-ellipsis-left-4", (size / 10) * 4 + "px");
  root.style.setProperty("--loader-ellipsis-left-7", (size / 10) * 7 + "px");
  root.style.setProperty("--loader-ellipsis-top", size * (33 / 80) + "px");
  root.style.setProperty("--loader-ellipsis-size", size * (13 / 80) + "px");
</script>

<div class="lds-ellipsis" style={`width:${size}px;height:${size}px`}>
  <div style={`background-color:${bg};`}/>
  <div style={`background-color:${bg};`}/>
  <div style={`background-color:${bg};`}/>
  <div style={`background-color:${bg};`}/>
</div>

<style>
  .lds-ellipsis {
    display: inline-block;
    position: relative;
  }
  .lds-ellipsis div {
    position: absolute;
    top: var(--loader-ellipsis-top);
    width: var(--loader-ellipsis-size);
    height: var(--loader-ellipsis-size);
    border-radius: 50%;
    animation-timing-function: cubic-bezier(0, 1, 1, 0);
  }
  .lds-ellipsis div:nth-child(1) {
    left: var(--loader-ellipsis-left);
    animation: lds-ellipsis1 0.6s infinite;
  }
  .lds-ellipsis div:nth-child(2) {
    left: var(--loader-ellipsis-left);
    animation: lds-ellipsis2 0.6s infinite;
  }
  .lds-ellipsis div:nth-child(3) {
    left: var(--loader-ellipsis-left-4);
    animation: lds-ellipsis2 0.6s infinite;
  }
  .lds-ellipsis div:nth-child(4) {
    left: var(--loader-ellipsis-left-7);
    animation: lds-ellipsis3 0.6s infinite;
  }
  @keyframes lds-ellipsis1 {
    0% {
      transform: scale(0);
    }
    100% {
      transform: scale(1);
    }
  }
  @keyframes lds-ellipsis3 {
    0% {
      transform: scale(1);
    }
    100% {
      transform: scale(0);
    }
  }
  @keyframes lds-ellipsis2 {
    0% {
      transform: translate(0, 0);
    }
    100% {
      transform: translate(var(--loader-ellipsis-translate), 0);
    }
  }
</style>
