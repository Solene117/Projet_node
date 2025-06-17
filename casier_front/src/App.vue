<template>
  <div id="app" class="min-h-screen flex flex-col items-center">
    <header class="w-full py-6 text-center">
      <h1 class="text-3xl font-bold text-white">Gestion des casiers</h1>
    </header>

    <main class="w-full max-w-4xl px-4 mt-8 space-y-6">
      <div class="flex gap-4 justify-center">
        <button @click="toggleView('locker')" :disabled="userRole !== 'admin'"
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
          title="Seuls les admins peuvent ajouter un casier">
          {{ activeView === 'locker' ? 'Masquer l’ajout' : 'Ajouter un casier' }}
        </button>

        <button @click="toggleView('reservation')" :disabled="!isLoggedIn"
          class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition disabled:opacity-50"
          title="Connectez-vous pour réserver un casier">
          {{ activeView === 'reservation' ? 'Masquer la réservation' : 'Réserver un casier' }}
        </button>
      </div>

      <Locker v-if="activeView === 'locker'" />
      <Reservation v-if="activeView === 'reservation'" />

      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Locker from './views/Lockers.vue'
import Reservation from './views/Reservations.vue'

const userRole = ref('user')
const isLoggedIn = ref(true)

const activeView = ref(null)

function toggleView(view) {
  activeView.value = activeView.value === view ? null : view
}
import { RouterView } from 'vue-router';
</script>
