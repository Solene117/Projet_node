<template>
  <div id="app" class="min-h-screen flex flex-col items-center">
    <header class="w-full py-6 text-center">
      <h1 class="text-3xl font-bold text-white">Gestion des casiers</h1>
    </header>

    <main>
      <div v-if="showButtons">
        <div class="flex gap-4 justify-center">
          <!-- Bouton Ajouter/Masquer -->
          <button @click="toggleActions('locker')" :disabled="userRole !== 'admin'"
            class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
            title="Seuls les admins peuvent ajouter un casier">
            {{ showActions.locker ? 'Masquer l’ajout' : 'Ajouter un casier' }}
          </button>

          <!-- Bouton Réserver/Masquer -->
          <button @click="toggleActions('reservation')" :disabled="!isLoggedIn"
            class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition disabled:opacity-50"
            title="Connectez-vous pour réserver un casier">
            {{ showActions.reservation ? 'Masquer la réservation' : 'Réserver un casier' }}
          </button>
        </div>
      </div>

      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { ref, computed, onMounted } from 'vue'

const router = useRouter()
const route = useRoute()

const userRole = ref('user')
const isLoggedIn = ref(false)
const hiddenPaths = ['/register', '/login']
const showButtons = computed(() => !hiddenPaths.includes(route.path))

function goTo(path) {
  router.push(path)
}

const showActions = ref({
  locker: false,
  reservation: false
})

function toggleActions(type) {
  showActions.value[type] = !showActions.value[type]

  const other = type === 'locker' ? 'reservation' : 'locker'
  if (showActions.value[type]) {
    showActions.value[other] = false
  }

  if (type === 'locker' && showActions.value.locker) {
    router.push('/lockers')
  } else if (type === 'reservation' && showActions.value.reservation) {
    router.push('/reservations')
  } else {
    router.push('/')
  }
}

onMounted(async () => {
  try {
    const res = await fetch('http://localhost:3033/api/auth/me', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      }
    })
    if (!res.ok) throw new Error('Non connecté')
    const user = await res.json()
    userRole.value = user.role
    isLoggedIn.value = true
  } catch (e) {
    userRole.value = 'user'
    isLoggedIn.value = false
  }
})
</script>
