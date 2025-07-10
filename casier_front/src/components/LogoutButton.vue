<template>
    <button
        v-if="!$route.meta.hideLoginButton"
        @click="handleAuthAction" 
        class="fixed top-4 right-4 z-50 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
        {{ props.isLoggedIn ? 'Logout' : 'Login' }}
    </button>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  isLoggedIn: {
    type: Boolean,
    required: true
  }
})

const router = useRouter()

function handleAuthAction() {
  if (props.isLoggedIn) {
    localStorage.removeItem('token')
    window.location.reload()
  } else {
    router.push('/login')
  }
}
</script>