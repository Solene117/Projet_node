<template>
  <button @click="onClick" :disabled="userRole !== 'admin'"
    class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50">
    {{ show ? 'Masquer l’ajout' : 'Ajouter un casier' }}
  </button>
</template>

<script setup>
import { defineProps } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  show: Boolean,
  userRole: String
})

const router = useRouter()
function onClick() {
  props.show
    ? router.push('/')
    : router.push('/lockers')
}
</script>
