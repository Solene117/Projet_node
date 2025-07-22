<template>
  <div class="min-h-screen flex flex-col">
    <Header :currentTab="currentTab" :userRole="userRole" :isLoggedIn="isLoggedIn" @change-tab="handleChangeTab" @logout="handleLogout"/>

    <main class="flex-grow">
      <RouterView />
    </main>

    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const route = useRoute()

const currentTab = ref('home')
const { userRole, isLoggedIn, fetchUser, logout } = useAuth()


function handleChangeTab(tab) {
  currentTab.value = tab

  if (tab === 'home') router.push('/')
  else if (tab === 'reservation') router.push('/reservations')
  else if (tab === 'addLocker') router.push('/lockers')
}

function handleLogout() {
  logout()
  router.push('/login')
}

onMounted(fetchUser)
watch(() => route.fullPath, fetchUser)
</script>
