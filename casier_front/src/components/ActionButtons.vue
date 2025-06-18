<!-- src/components/ActionButtons.vue -->
<template>
  <div class="flex gap-4 justify-center mb-6">
    <AddLockerButton
      :show="show.locker"
      :userRole="userRole"
      @toggle="onToggle('locker')"
    />
    <ReserveLockerButton
      :show="show.reservation"
      :isLoggedIn="isLoggedIn"
      @toggle="onToggle('reservation')"
    />
  </div>
</template>

<script setup>
import { defineEmits } from 'vue'
import AddLockerButton from './AddLockerButton.vue'
import ReserveLockerButton from './ReserveLockerButton.vue'

const props = defineProps({
  show: Object,
  userRole: String,
  isLoggedIn: Boolean
})

const emit = defineEmits(['toggle'])

const onToggle = (type) => {
  emit('toggle', type)
}
</script>
