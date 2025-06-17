<template>
  <div id="app" class="min-h-screen flex flex-col items-center gap-3">
    <header class="w-full py-6 text-center">
      <h1 class="text-3xl font-bold text-white">Gestion des casiers</h1>
    </header>
    <main class="w-full max-w-4xl px-4 mt-8">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
  import { RouterView } from 'vue-router';
</script>
