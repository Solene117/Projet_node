<template>
    <div class="min-h-screen p-4 flex justify-center items-center">
        <div class="bg-white border border-gray-200 rounded-lg shadow-sm p-6 w-full max-w-md">
            <h1 class="text-xl font-semibold mb-4 text-blue-600 text-center">Mot de passe oublié</h1>
            
            <!-- Messages de succès/erreur -->
            <div v-if="message" class="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                {{ message }}
            </div>
            <div v-if="error" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {{ error }}
            </div>
            
            <form @submit.prevent="handleSubmit" v-if="!message">
                <p class="text-gray-600 text-sm mb-4">
                    Entrez votre adresse email pour recevoir un lien de réinitialisation de votre mot de passe.
                </p>
                
                <div class="mb-4">
                    <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input 
                        type="email" 
                        id="email"
                        v-model="email"
                        required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-black"
                    />
                </div>

                <button 
                    type="submit" 
                    :disabled="loading"
                    class="w-full bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
                    {{ loading ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation' }}
                </button>
            </form>

            <div class="mt-4 text-center">
                <router-link to="/login" class="text-blue-600 hover:underline text-sm">
                    Retour à la connexion
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const API_BASE_URL = import.meta.env.API_BASE_URL || 'http://localhost:3000'

const email = ref('')
const loading = ref(false)
const message = ref('')
const error = ref('')

const handleSubmit = async () => {
    loading.value = true
    error.value = ''
    message.value = ''

    try {
        const response = await axios.post(`${API_BASE_URL}/api/auth/forgot-password`, {
            email: email.value
        })

        message.value = response.data.message || 'Instructions envoyées par email !'

    } catch (err) {
        error.value = err.response?.data?.message || 'Erreur lors de l\'envoi'
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
</style> 