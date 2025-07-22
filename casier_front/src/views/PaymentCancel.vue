<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
    <div class="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
      <div class="flex justify-center mb-6">
        <div class="w-16 h-16 flex items-center justify-center bg-yellow-100 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
      
      <h1 class="mb-4 text-2xl font-bold text-center text-yellow-700">Paiement annulé</h1>
      
      <p class="mb-6 text-center text-gray-600">
        Votre paiement a été annulé. Aucun montant n'a été prélevé sur votre carte.
      </p>

      <div v-if="loading" class="flex justify-center mb-4">
        <div class="w-8 h-8 border-t-4 border-b-4 border-yellow-500 rounded-full animate-spin"></div>
      </div>

      <div v-else-if="error" class="p-4 mb-4 text-red-700 bg-red-100 rounded-lg">
        <p>{{ error }}</p>
      </div>

      <div v-if="reservationId" class="p-4 mb-4 bg-yellow-50 rounded-lg">
        <p class="mb-2">Souhaitez-vous annuler complètement votre réservation ?</p>
        <div class="flex space-x-2">
          <button 
            @click="cancelReservation" 
            class="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
            :disabled="cancelLoading"
          >
            {{ cancelLoading ? 'Annulation...' : 'Annuler la réservation' }}
          </button>
          <button 
            @click="retryPayment" 
            class="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
          >
            Réessayer le paiement
          </button>
        </div>
      </div>

      <div class="flex justify-center mt-4">
        <button 
          @click="goToHome" 
          class="px-6 py-2 mr-2 text-white transition bg-blue-600 rounded hover:bg-blue-700"
        >
          Accueil
        </button>
        <button 
          @click="goToReservations" 
          class="px-6 py-2 text-white transition bg-green-600 rounded hover:bg-green-700"
        >
          Mes réservations
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const reservationId = ref(route.query.reservation_id)
const loading = ref(false)
const cancelLoading = ref(false)
const error = ref(null)

// Annuler la réservation
const cancelReservation = async () => {
  if (!confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
    return
  }
  
  cancelLoading.value = true
  error.value = null
  
  try {
    const token = localStorage.getItem('token')
    const response = await fetch('http://localhost:3033/api/payments/cancel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        reservationId: reservationId.value
      })
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Erreur lors de l\'annulation')
    }
    
    alert('Réservation annulée avec succès')
    router.push('/reservations')
  } catch (err) {
    error.value = err.message
  } finally {
    cancelLoading.value = false
  }
}

// Réessayer le paiement
const retryPayment = () => {
  router.push(`/payment?reservationId=${reservationId.value}`)
}

// Navigation
const goToHome = () => {
  router.push('/')
}

const goToReservations = () => {
  router.push('/reservations')
}
</script> 