<template>
  <div class="p-8 max-w-4xl mx-auto w-full">
    <section class="text-center text-gray-700">
      <h2 class="text-2xl font-semibold mb-4">Pourquoi utiliser des casiers ?</h2>
      <p class="text-lg leading-relaxed mb-6">
        Les casiers offrent un espace sécurisé pour stocker vos affaires personnelles.
        Ils sont particulièrement utiles dans les lieux publics comme les universités,
        les salles de sport, ou les espaces de coworking. Notre système permet de gérer
        facilement la réservation et la libération de casiers pour une meilleure organisation.
      </p>
      <img
        src="@/assets/lockers.jpg"
        alt="Illustration de casiers"
        class="mx-auto rounded-lg shadow-md max-h-[400px] object-cover"
      />
    </section>
  </div>
</template>


<script setup>
import { ref } from 'vue'

const currentTab = ref('home')

function handleChangeTab(tab) {
  currentTab.value = tab
}
</script>
