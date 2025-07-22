<template>
    <div class="max-h-screen p-4 flex justify-center items-center">
        <div class="bg-white border border-gray-200 rounded-lg shadow-sm p-6 w-full max-w-md">
            <h1 class="text-xl font-semibold mb-4 text-blue-600 text-center">Connexion</h1>
            
            <!-- Messages de succès/erreur -->
            <div v-if="message" class="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                {{ message }}
            </div>
            <div v-if="error" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {{ error }}
            </div>
            
            <form @submit.prevent="handleSubmit" class="login-form">
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
                </div>

                <div class="form-links">
                    <router-link to="/forgot-password">Mot de passe oublié ?</router-link>
                </div>

                <button 
                    type="submit" 
                    :disabled="loading"
                    class="w-full bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
                    {{ loading ? 'Connexion en cours...' : 'Se connecter' }}
                </button>

                <div class="register-link">
                    Pas encore de compte ? 
                    <router-link to="/register">S'inscrire</router-link>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const API_BASE_URL = import.meta.env.API_BASE_URL || 'http://localhost:3033'

const email = ref('')
const password = ref('')
const loading = ref(false)
const message = ref('')
const error = ref('')
const { setToken } = useAuth()

const handleSubmit = async () => {
    loading.value = true
    error.value = ''
    message.value = ''

    try {
        const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
            email: email.value,
            password: password.value
        })

        const token = response.data.token
        setToken(token)

        message.value = response.data.message || 'Connexion réussie !'
        router.push('/')

    } catch (err) {
        error.value = err.response?.data?.message || 'Erreur lors de la connexion'
    } finally {
        loading.value = false
    }
}

</script>

<style scoped>
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 20px;
    background-color: #f5f5f5;
}

.login-card {
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

.form-links {
    text-align: right;
    margin-bottom: 1rem;
}

.form-links a {
    color: #4CAF50;
    text-decoration: none;
    font-size: 0.9rem;
}

.register-link {
    text-align: center;
    margin-top: 1.5rem;
    color: #666;
    font-size: 0.9rem;
}

.register-link a {
    color: #4CAF50;
    text-decoration: none;
    margin-left: 0.5rem;
}

a:hover {
    text-decoration: underline;
}
</style>