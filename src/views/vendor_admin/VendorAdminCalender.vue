<template>
  <FullCalendar :options="calendarOptions" />
</template>

<script setup>
import { ref } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'

const calendarOptions = ref({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth'
})
</script>

<style scoped>
#calendar {
  height: 600px;
  /* 确保日历容器有足够的高度 */
  width: 100%;
  /* 确保宽度为100% */
}

#event-modal,
#edit-event-modal {
  display: block;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  max-width: 400px;
  width: 100%;
  z-index: 1000;
}
</style>