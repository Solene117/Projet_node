<template>
  <div id="app" class="min-h-screen flex flex-col items-center">
    <header class="w-full py-6 text-center">
      <LogoutButton :isLoggedIn="isLoggedIn" />
      <h1 class="text-3xl font-bold text-white">Gestion des casiers</h1>
    </header>
    <main>
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router';
import LogoutButton from './components/LogoutButton.vue';
import { useRouter, useRoute } from 'vue-router'
import { ref, computed, onMounted, watch } from 'vue'
import { useAuth } from './composables/useAuth';

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

async function checkAuth () {
  const token = localStorage.getItem('token')
  if (!token) {
    userRole.value   = 'user'
    isLoggedIn.value = false
    return
  }

  try {
    const res = await fetch('http://localhost:3033/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    })

    if (!res.ok) throw new Error('token invalide')

    const user = await res.json()
    // Par ex. { id: 7, name: 'Alice', role: 'admin' }
    userRole.value   = (user.role === 'admin') ? 'admin' : 'user'
    isLoggedIn.value = true
  } catch (err) {
    // Token expiré ou requête en échec ➜ on repasse “invité”
    localStorage.removeItem('token')
    userRole.value   = 'user'
    isLoggedIn.value = false
    console.warn('checkAuth :', err)
  }
}
onMounted(checkAuth)
watch(() => route.fullPath, checkAuth)
</script>
