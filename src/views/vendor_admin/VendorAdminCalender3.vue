<template>
  <div>
    <FullCalendar :options="calendarOptions" />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from "vue";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";

const events = ref([]); // 事件列表
const vendorId = 1; // 這裡先寫死，之後可以動態設置

// FullCalendar 的設定
const calendarOptions = reactive({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: "dayGridMonth",
  events: events.value, // 這裡使用 `events`
  selectable: true,
  editable: true,
  eventColor: "#3788d8",
});

// 獲取 API 事件
const fetchEvents = async () => {
  try {
    const response = await axios.get(`http://localhost:8080/api/vendor_admin/calender/${vendorId}`);
    console.log("API 回應資料：", response.data);

    if (Array.isArray(response.data)) {
      events.value = response.data.map(event => ({
        id: event.id,
        title: event.eventTitle,
        start: event.startTime, // 確保格式正確
        end: event.endTime,
        allDay: false,
        backgroundColor: event.color || "#3788d8",
      }));
    } else {
      console.error("API 回應的資料不是陣列：", response.data);
    }
  } catch (error) {
    console.error("無法獲取行事曆事件：", error);
  }
};

// 監聽 `events` 變化，動態更新 FullCalendar
watch(events, (newEvents) => {
  calendarOptions.events = newEvents;
});

// 組件載入時獲取事件
onMounted(fetchEvents);
</script>

<style>
/* 這裡可以加上 CSS 樣式 */
</style>
