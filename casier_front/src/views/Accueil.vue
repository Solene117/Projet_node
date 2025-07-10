<template>
  <div class="min-h-screen flex flex-col items-center">
    <main>
      <div v-if="!isLoggedIn" class="text-center p-6 bg-yellow-100 border border-yellow-400 rounded-lg mb-4">
        <p class="text-yellow-800">Veuillez vous connecter pour accéder aux fonctionnalités.</p>
      </div>
      <div class="flex gap-4 justify-center">
        <AddLockerButton :show="showActions.locker" :userRole="userRole"
                         @click="toggleActions('locker')" />
        <ReserveLockerButton :show="showActions.reservation" :isLoggedIn="isLoggedIn"
                             @click="toggleActions('reservation')" />
      </div>
      <div v-if="showActions.locker">
      </div>
      <div v-if="showActions.reservation">
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth' 
import AddLockerButton from '@/components/AddLockerButton.vue'
import ReserveLockerButton from '@/components/ReserveLockerButton.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const { userRole, isLoggedIn } = useAuth() 

const showActions = ref({ locker: false, reservation: false })

function toggleActions(type) {
  showActions.value[type] = !showActions.value[type]
  const other = type === 'locker' ? 'reservation' : 'locker'
  if (showActions.value[type]) showActions.value[other] = false

  if (type === 'locker' && showActions.value.locker) router.push('/lockers')
  else if (type === 'reservation' && showActions.value.reservation) router.push('/reservations')
}
</script>

