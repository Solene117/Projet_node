<template>
    <header class="bg-blue-600 text-white flex flex-col shadow-md">
        <div class="flex items-center justify-between px-6 py-4">
            <h1 class="text-xl font-bold cursor-pointer" @click="goHome">ResLock</h1>

            <div class="flex items-center gap-6">
                <nav class="flex gap-4">
                    <button @click="handleTabClick('reservation')"
                        class="group relative px-4 py-2 rounded-md font-medium transition-colors duration-200" :class="{
                            'opacity-50 cursor-not-allowed': !props.isLoggedIn,
                            'bg-white text-blue-600 shadow-md': props.currentTab === 'reservation',
                        }">
                        Réserver un casier


                        <div v-if="!props.isLoggedIn"
                            class="absolute left-1/2 -translate-x-1/2 top-8 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 pointer-events-none transition whitespace-nowrap z-10">
                            Veuillez vous connecter
                        </div>
                    </button>


                    <button v-if="props.isLoggedIn && props.userRole === 'admin'" :class="tabClass('addLocker')"
                        @click="handleTabClick('addLocker')">
                        Ajouter un casier
                    </button>

                </nav>

                <div class="cursor-pointer" @click="goToProfile"
                    :title="props.isLoggedIn ? 'Se déconnecter' : 'Se connecter'">
                    <svg v-if="!props.isLoggedIn" xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="currentColor"
                        viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" />
                        <path fill-rule="evenodd" d="M4 20c0-2.21 3.58-4 8-4s8 1.79 8 4v1H4v-1z" clip-rule="evenodd" />
                    </svg>

                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="currentColor"
                        viewBox="0 0 24 24">
                        <path fill-rule="evenodd"
                            d="M16.707 7.293a1 1 0 010 1.414L14.414 11H21a1 1 0 110 2h-6.586l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0zM3 5a2 2 0 012-2h7a2 2 0 012 2v3a1 1 0 11-2 0V5H5v14h7v-3a1 1 0 112 0v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5z"
                            clip-rule="evenodd" />
                    </svg>
                </div>
            </div>
        </div>

        <p v-if="message" class="text-sm text-center text-yellow-200 bg-blue-500 py-1">
            {{ message }}
        </p>
    </header>
</template>


<script setup>
import { defineProps, defineEmits, ref } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
    currentTab: String,
    isLoggedIn: Boolean,
    userRole: String,
})

const emits = defineEmits(['change-tab', 'logout'])

const router = useRouter()
const message = ref('')

function goHome() {
    emits('change-tab', 'home')
}

function goToProfile() {
    emits('change-tab', 'home')
    if (!props.isLoggedIn) {
        router.push('/login')
    } else {
        emits('logout')
    }
}

function handleTabClick(tab) {
    message.value = ''

    if (!props.isLoggedIn) {
        message.value = 'Veuillez vous connecter pour accéder à cette fonctionnalité.'
        return
    }

    if (tab === 'addLocker' && props.userRole !== 'admin') {
        message.value = 'Seuls les administrateurs peuvent ajouter un casier.'
        return
    }

    emits('change-tab', tab)
}

function tabClass(tabName, disabled = false) {
    return [
        'px-4 py-2 rounded-md font-medium transition-colors duration-200',
        disabled
            ? 'opacity-50 cursor-not-allowed'
            : props.currentTab === tabName
                ? 'bg-white text-blue-600 shadow-md'
                : 'hover:bg-blue-500/30'
    ]
}
</script>