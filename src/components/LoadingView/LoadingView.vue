<template>
  <div class="loader"></div>
</template>
<script>
export default {
  name: "LoadingView",
};
</script>
<style scoped>
.loader {
  width: 32px;
  aspect-ratio: 4;
  background: radial-gradient(circle closest-side, #fff 90%, #222127) 0 /
    calc(100% / 3) 100% space;
  clip-path: inset(0 100% 0 0);
  animation: l1 1s steps(4) infinite;
}
@keyframes l1 {
  to {
    clip-path: inset(0 -34% 0 0);
  }
}
</style>
