<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
    <div class="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
      <h1 class="mb-4 text-xl font-semibold text-center text-green-700">Paiement de votre réservation</h1>
      
      <div v-if="loading" class="flex flex-col items-center justify-center py-8">
        <div class="w-16 h-16 border-t-4 border-b-4 border-green-500 rounded-full animate-spin"></div>
        <p class="mt-4 text-gray-600">Préparation du paiement...</p>
      </div>

      <div v-else-if="error" class="p-4 mb-4 text-red-700 bg-red-100 rounded-lg">
        <p class="font-bold">Erreur :</p>
        <p>{{ error }}</p>
        <button 
          @click="goBack" 
          class="px-4 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Retour
        </button>
      </div>

      <div v-else-if="!reservation" class="p-4 bg-yellow-100 rounded-lg">
        <p>Aucune réservation à payer.</p>
        <button 
          @click="goToReservations" 
          class="px-4 py-2 mt-4 text-white bg-green-500 rounded hover:bg-green-600"
        >
          Créer une réservation
        </button>
      </div>

      <div v-else class="space-y-4">
        <div class="p-4 border rounded-lg bg-gray-50">
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
            
            <div class="text-gray-600 font-semibold">Montant à payer :</div>
            <div class="font-semibold text-green-700">{{ reservation.paymentAmount }}€</div>
          </div>
        </div>
        
        <div class="flex flex-col space-y-2">
          <button 
            @click="processPayment" 
            class="px-4 py-3 font-medium text-white transition bg-green-600 rounded hover:bg-green-700"
            :disabled="loading"
          >
            <span v-if="!loading">Procéder au paiement</span>
            <span v-else>Traitement...</span>
          </button>
          
          <button 
            @click="cancelReservation" 
            class="px-4 py-2 text-gray-700 transition bg-gray-200 rounded hover:bg-gray-300"
          >
            Annuler la réservation
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { loadStripe } from '@stripe/stripe-js'

const route = useRoute()
const router = useRouter()
const reservationId = ref(route.query.reservationId)
const reservation = ref(null)
const lockerDetails = ref(null)
const loading = ref(false)
const error = ref(null)

// Récupérer les détails de la réservation
const fetchReservationDetails = async () => {
  if (!reservationId.value) return

  loading.value = true
  error.value = null
  
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

// Formatter la date
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleString()
}

// Procéder au paiement
const processPayment = async () => {
  loading.value = true
  error.value = null
  
  try {
    const token = localStorage.getItem('token')
    const response = await fetch('http://localhost:3033/api/payments/create-session', {
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
      throw new Error(errorData.message || 'Erreur lors de la création de la session de paiement')
    }
    
    const { url } = await response.json()
    
    // Rediriger vers la page de paiement Stripe
    window.location.href = url
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

// Annuler la réservation
const cancelReservation = async () => {
  if (!confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
    return
  }
  
  loading.value = true
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
    loading.value = false
  }
}

// Navigation
const goBack = () => {
  router.go(-1)
}

const goToReservations = () => {
  router.push('/reservations')
}

onMounted(fetchReservationDetails)
</script> 