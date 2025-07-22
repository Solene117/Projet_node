<template>
    <div class="min-h-screen p-4 flex justify-center items-center">
        <div class="bg-white border border-gray-200 rounded-lg shadow-sm p-6 w-full max-w-md">
            <h1 class="text-xl font-semibold mb-4 text-blue-600 text-center">Réinitialisation du mot de passe</h1>
            
            <!-- Messages de succès/erreur -->
            <div v-if="message" class="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                {{ message }}
            </div>
            <div v-if="error" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {{ error }}
            </div>
            
            <form @submit.prevent="validateForm" class="reset-form">
                <div class="mb-4">
                    <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
                    <input 
                        type="password" 
                        id="password"
                        v-model="password"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-black"
                        :class="{ 'error': passwordError }"
                        @input="validatePassword"
                    />
                    <span class="error-message" v-if="passwordError">{{ passwordError }}</span>
                </div>

                <div class="mb-4">
                    <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe</label>
                    <input 
                        type="password" 
                        id="confirmPassword"
                        v-model="confirmPassword"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-black"
                        :class="{ 'error': confirmPasswordError }"
                        @input="validateConfirmPassword"
                    />
                    <span class="error-message" v-if="confirmPasswordError">{{ confirmPasswordError }}</span>
                </div>

                <button 
                    type="submit" 
                    :disabled="!isFormValid || loading"
                    class="w-full bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
                    {{ loading ? 'Réinitialisation en cours...' : 'Réinitialiser le mot de passe' }}
                </button>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const route = useRoute()
const router = useRouter()

const password = ref('')
const confirmPassword = ref('')
const passwordError = ref('')
const confirmPasswordError = ref('')
const loading = ref(false)
const message = ref('')
const error = ref('')

const validatePassword = () => {
    if (password.value.length < 6) {
        passwordError.value = 'Le mot de passe doit contenir au moins 6 caractères'
    } else if (!/[A-Z]/.test(password.value)) {
        passwordError.value = 'Le mot de passe doit contenir au moins une majuscule'
    } else if (!/[0-9]/.test(password.value)) {
        passwordError.value = 'Le mot de passe doit contenir au moins un chiffre'
    } else {
        passwordError.value = ''
    }
    validateConfirmPassword()
}

const validateConfirmPassword = () => {
    if (confirmPassword.value && password.value !== confirmPassword.value) {
        confirmPasswordError.value = 'Les mots de passe ne correspondent pas'
    } else {
        confirmPasswordError.value = ''
    }
}

const isFormValid = computed(() => {
    return password.value.length >= 6 && 
           password.value === confirmPassword.value && 
           !passwordError.value && 
           !confirmPasswordError.value
})

const validateForm = async () => {
    if (isFormValid.value) {
        loading.value = true
        error.value = ''
        message.value = ''
        const token = route.query.token

        try {
            const response = await axios.post(`${API_BASE_URL}/api/auth/reset-password`, {
                token: token,
                password: password.value
            })

            message.value = response.data.message || 'Mot de passe réinitialisé avec succès !'
            
            // Rediriger vers la page de connexion après 2 secondes
            setTimeout(() => {
                router.push('/login')
            }, 500)

        } catch (err) {
            console.log(err)
            error.value = err.response?.data?.message || 'Erreur lors de la réinitialisation'
        } finally {
            loading.value = false
        }
    }
}
</script>

<style scoped>
.reset-password-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 20px;
    background-color: #f5f5f5;
}

.reset-password-card {
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

input.error {
    border-color: #dc3545;
}

.error-message {
    color: #dc3545;
    font-size: 0.8rem;
    margin-top: 0.25rem;
    display: block;
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
}

button:hover:not(:disabled) {
    background-color: #45a049;
}

button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
}
</style>