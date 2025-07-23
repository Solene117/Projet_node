<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
    <div class="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
      <div class="flex justify-center mb-6">
        <div class="w-16 h-16 flex items-center justify-center bg-green-100 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>
      
      <h1 class="mb-4 text-2xl font-bold text-center text-green-700">Paiement réussi !</h1>
      
      <p class="mb-6 text-center text-gray-600">
        Votre réservation a été confirmée et votre paiement a bien été reçu.
      </p>

      <div v-if="loading" class="flex justify-center mb-4">
        <div class="w-8 h-8 border-t-4 border-b-4 border-green-500 rounded-full animate-spin"></div>
      </div>

      <div v-else-if="error" class="p-4 mb-4 text-red-700 bg-red-100 rounded-lg">
        <p>{{ error }}</p>
      </div>

      <div v-else-if="reservation" class="p-4 mb-4 border rounded-lg bg-gray-50">
        <h2 class="mb-2 text-lg font-medium">Détails de votre réservation</h2>
        <div class="grid grid-cols-2 gap-2">
          <div class="text-gray-600">Casier :</div>
          <div>{{ lockerDetails ? `#${lockerDetails.number} (${lockerDetails.size})` : 'Chargement...' }}</div>
          
          <div class="text-gray-600">Durée :</div>
          <div>{{ reservation.durationHours }} heure(s)</div>
          
          <div class="text-gray-600">Date de début :</div>
          <div>{{ formatDate(reservation.startDate) }}</div>
          
          <div class="text-gray-600">Expire le :</div>
          <div>{{ formatDate(reservation.expiresAt) }}</div>
          
          <div class="text-gray-600 font-semibold">Montant payé :</div>
          <div class="font-semibold text-green-700">{{ reservation.paymentAmount }}€</div>
        </div>
      </div>

      <div class="flex justify-center">
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
const sessionId = ref(route.query.session_id)
const reservationId = ref(route.query.reservation_id)
const reservation = ref(null)
const lockerDetails = ref(null)
const loading = ref(true)
const error = ref(null)

const confirmPayment = async () => {
  if (!sessionId.value || !reservationId.value) {
    error.value = 'Paramètres manquants pour confirmer le paiement'
    loading.value = false
    return
  }

  try {
    // Confirmer le paiement avec le backend
    const response = await fetch(`http://localhost:3033/api/payments/confirm?session_id=${sessionId.value}&reservation_id=${reservationId.value}`)
    
    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.message || 'Erreur lors de la confirmation du paiement')
    }

    // Récupérer les détails de la réservation
    await fetchReservationDetails()
  } catch (err) {
    error.value = err.message
    loading.value = false
  }
}

const fetchReservationDetails = async () => {
  try {
    const token = localStorage.getItem('token')
    const response = await fetch(`http://localhost:3033/api/reservations/${reservationId.value}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    
    if (!response.ok) {
      throw new Error('Impossible de récupérer les détails de la réservation')
    }
    
    reservation.value = await response.json()
    
    // Récupérer les détails du casier
    const lockerResponse = await fetch(`http://localhost:3033/api/lockers/${reservation.value.locker}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    
    if (lockerResponse.ok) {
      lockerDetails.value = await lockerResponse.json()
    }
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleString()
}

const goToHome = () => {
  router.push('/')
}

const goToReservations = () => {
  router.push('/reservations')
}

onMounted(() => {
  confirmPayment()
})
</script> 