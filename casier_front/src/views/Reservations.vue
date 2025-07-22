<template>
  <div class="flex items-center justify-center px-4 py-6">
    <div class="rounded-lg shadow p-6 bg-white w-full max-w-md mt-4">
      <h2 class="text-xl font-semibold mb-4 text-center text-green-700">Réserver un casier</h2>

      <form @submit.prevent="reserveLocker" class="space-y-4">
        <div>
          <label class="block text-black mb-1">Sélectionnez un casier</label>
          <select v-model="selectedLockerId" required class="border rounded p-2 w-full text-black">
            <option disabled value="">-- Choisissez un casier --</option>
            <option
              v-for="locker in allLockers"
              :key="locker._id"
              :value="locker._id"
              :disabled="locker.status === 'reserved'"
              :class="{ 'text-gray-400': locker.status === 'reserved' }"
            >
              Casier #{{ locker.number }} - {{ locker.size }}
              <span v-if="locker.status === 'reserved'"> (Réservé)</span>
            </option>
          </select>
        </div>

        <div>
          <label class="block text-black mb-1">Durée (en heures)</label>
          <input
            type="number"
            v-model="durationHours"
            required
            class="border rounded p-2 w-full text-black"
            min="1"
            max="24"
            @input="onDurationInput"
          />
        </div>

        <button
          type="submit"
          class="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Réserver
        </button>

        <p v-if="successMessage" class="text-green-700 mt-2">{{ successMessage }}</p>
      </form>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const selectedLockerId = ref('')
const durationHours = ref(1)
const successMessage = ref('')
const allLockers = ref([])

const fetchLockers = async () => {
  try {
    const token = localStorage.getItem('token')
    const res = await axios.get('http://localhost:3033/api/lockers', {
      headers: { Authorization: `Bearer ${token}` }
    })
    allLockers.value = res.data
  } catch (error) {
    console.error('Erreur récupération casiers', error)
  }
}

const reserveLocker = async () => {
  try {
    const token = localStorage.getItem('token')
    await axios.post(
      'http://localhost:3033/api/reservations',
      { lockerId: selectedLockerId.value, durationHours: durationHours.value },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    successMessage.value = 'Réservation réussie ! Un email de confirmation vous a été envoyé.'
    fetchLockers()
  } catch (err) {
    console.error(err)
    successMessage.value = 'Erreur lors de la réservation.'
  }
}

function onDurationInput(e) {
  const val = Number(e.target.value)
  if (val > 24) {
    durationHours.value = 24
  } else if (val < 1) {
    durationHours.value = 1
  } else {
    durationHours.value = val
  }
}

onMounted(fetchLockers)
</script>

