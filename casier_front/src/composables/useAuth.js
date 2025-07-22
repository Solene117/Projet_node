// src/composables/useAuth.js
import { ref, computed } from 'vue'

const token = ref(localStorage.getItem('token') || null)
const userRole = ref('user')
const isLoggedIn = computed(() => !!token.value)

async function fetchUser() {
  if (!token.value) return
  try {
    const res = await fetch('http://localhost:3033/api/auth/me', {
      headers: { Authorization: `Bearer ${token.value}` }
    })
    if (!res.ok) throw new Error('Unauthorized')
    const user = await res.json()
    userRole.value = user.role || 'user'
  } catch {
    logout()
  }
}

function setToken(newToken) {
  token.value = newToken
  localStorage.setItem('token', newToken)
  fetchUser()
}

function logout() {
  token.value = null
  userRole.value = 'user'
  localStorage.removeItem('token')
}

export function useAuth() {
  return {
    token,
    isLoggedIn,
    userRole,
    setToken,
    logout,
    fetchUser,
  }
}
