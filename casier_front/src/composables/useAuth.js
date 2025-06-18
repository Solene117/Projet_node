import { ref, onMounted } from 'vue'

export function useAuth() {
  const userRole = ref('user')
  const isLoggedIn = ref(false)

  onMounted(async () => {
    try {
      const res = await fetch('http://localhost:3033/api/auth/me', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      if (!res.ok) throw new Error()
      const user = await res.json()
      userRole.value = user.role
      isLoggedIn.value = true
    } catch {
      userRole.value = 'user'
      isLoggedIn.value = false
    }
  })

  return { userRole, isLoggedIn }
}
