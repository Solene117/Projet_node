<template>
  <button @click="onClick" :disabled="!isLoggedIn"
    class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition disabled:opacity-50">
    {{ show ? 'Masquer la réservation' : 'Réserver un casier' }}
  </button>
</template>

<script setup>
import { defineProps } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  show: Boolean,
  isLoggedIn: Boolean
})

const router = useRouter()
function onClick() {
  props.show
    ? router.push('/')
    : router.push('/reservations')
}
</script>
