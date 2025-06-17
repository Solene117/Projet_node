<template>
    <div class="max-h-screen p-4 flex justify-center">
        <div class="bg-white border border-gray-200 rounded-lg shadow-sm p-6 w-full max-w-md">
            <h1 class="text-xl font-semibold mb-4 text-blue-600 text-center">Inscription</h1>
            
            <!-- Messages de succès/erreur -->
            <div v-if="message" class="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                {{ message }}
            </div>
            <div v-if="error" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {{ error }}
            </div>
            
            <form @submit.prevent="handleSubmit" class="register-form">
                <div class="mb-4">
                    <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                    <input 
                        type="text" 
                        id="firstName"
                        v-model="firstName"
                        required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-black"
                    />
                </div>

                <div class="mb-4">
                    <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                    <input 
                        type="text" 
                        id="lastName"
                        v-model="lastName"
                        required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-black"
                    />
                </div>

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

                <div class="mb-4">
                    <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                    <input 
                        type="password" 
                        id="password"
                        v-model="password"
                        required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-black"
                    />
                    <span class="block text-xs text-gray-600 mt-1">
                        Le mot de passe doit contenir au moins 6 caractères, une majuscule et un chiffre
                    </span>
                </div>

                <button 
                    type="submit" 
                    :disabled="loading"
                    class="w-full bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
                    {{ loading ? 'Inscription en cours...' : 'S\'inscrire' }}
                </button>

                <div class="login-link">
                    Déjà un compte ? 
                    <router-link to="/login">Se connecter</router-link>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const API_BASE_URL = import.meta.env.API_BASE_URL || 'http://localhost:3033'
const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)
const message = ref('')
const error = ref('')

const handleSubmit = async () => {
    loading.value = true
    error.value = ''
    message.value = ''

    try {
        const response = await axios.post(`${API_BASE_URL}/api/auth/register`, {
            firstName: firstName.value,
            lastName: lastName.value,
            email: email.value,
            password: password.value
        })

        message.value = response.data.message || 'Inscription réussie !'
        
        // Réinitialiser le formulaire
        firstName.value = ''
        lastName.value = ''
        email.value = ''
        password.value = ''

    } catch (err) {
        error.value = err.response?.data?.message || 'Erreur lors de l\'inscription'
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
.register-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 20px;
    background-color: #f5f5f5;
}

.register-card {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
}

h1 {
    color: #333;
    text-align: center;
    margin-bottom: 2rem;
    font-size: 1.5rem;
}

.form-group {
    margin-bottom: 1.5rem;
}

label {
    display: block;
    margin-bottom: 0.5rem;
    color: #666;
    font-size: 0.9rem;
}

input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    transition: border-color 0.2s;
}

input:focus {
    outline: none;
    border-color: #4CAF50;
}

.password-requirements {
    display: block;
    font-size: 0.8rem;
    color: #666;
    margin-top: 0.5rem;
}

button {
    width: 100%;
    padding: 0.75rem;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s;
    margin-top: 1rem;
}

button:hover {
    background-color: #45a049;
}

.login-link {
    text-align: center;
    margin-top: 1.5rem;
    color: #666;
    font-size: 0.9rem;
}

.login-link a {
    color: #4CAF50;
    text-decoration: none;
    margin-left: 0.5rem;
}

a:hover {
    text-decoration: underline;
}
</style>