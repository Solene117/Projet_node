<template>
    <div class="p-4 flex justify-center items-center">
        <div class="bg-white border border-gray-200 rounded-lg shadow-sm p-6 w-full max-w-md">
            <h1 class="text-xl font-semibold mb-4 text-blue-600 text-center">Déconnexion</h1>
            
            <!-- Messages de succès/erreur -->
            <div v-if="message" class="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                {{ message }}
            </div>
            <div v-if="error" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {{ error }}
            </div>
            
            <div v-if="!message && !error" class="text-center">
                <p class="text-gray-600 mb-6">Êtes-vous sûr de vouloir vous déconnecter ?</p>
                
                <div class="flex space-x-3">
                    <button 
                        @click="handleLogout"
                        :disabled="loading"
                        class="flex-1 bg-red-600 text-white px-4 py-2 rounded-md font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
                        {{ loading ? 'Déconnexion...' : 'Oui, déconnecter' }}
                    </button>
                    
                    <router-link 
                        to="/"
                        class="flex-1 bg-gray-600 text-white px-4 py-2 rounded-md font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors text-center">
                        Annuler
                    </router-link>
                </div>
            </div>
            
            <div v-if="message" class="text-center mt-4">
                <router-link to="/login" class="text-blue-600 hover:underline text-sm">
                    Aller à la connexion
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const API_BASE_URL = import.meta.env.API_BASE_URL || 'http://localhost:3033'

const router = useRouter()
const loading = ref(false)
const message = ref('')
const error = ref('')

const handleLogout = async () => {
    loading.value = true
    error.value = ''
    message.value = ''

    try {
        // Appel API pour informer le serveur
        await axios.post(`${API_BASE_URL}/api/auth/logout`, {}, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })

        // Supprimer le token côté client
        localStorage.removeItem('token')
        
        message.value = 'Déconnexion réussie !'
        
        // Rediriger vers la page de connexion après 2 secondes
        setTimeout(() => {
            router.push('/login')
        }, 500)

    } catch (err) {
        error.value = err.response?.data?.message || 'Erreur lors de la déconnexion'
        
        // En cas d'erreur, supprimer quand même le token local
        localStorage.removeItem('token')
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
</style> 