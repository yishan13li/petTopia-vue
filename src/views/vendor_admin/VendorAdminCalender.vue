<template>
  <div class="content-body">
    <div class="container">
      <FullCalendar ref="calendar" :options="calendarOptions" class="calendar" />
      <div v-if="showEventModal || showEditEventModal" id="modal-overlay"></div>
      <!-- Edit Event Modal -->
      <div v-show="showEditEventModal" id="event-modal">
        <h3>編輯活動</h3>
        <label for="edit-event-title">活動:</label>
        <input type="text" v-model="editEventTitle" id="edit-event-title" required />
        <hr />
        <label for="edit-event-start-date">開始日期:</label>
        <input type="date" v-model="editEventStartDate" id="edit-event-start-date"
          :min="isPastEvent ? editEventStartDate : today" required />
        <input type="time" v-model="editEventStartTime" id="edit-event-start-time" required />
        <hr />
        <label for="edit-event-end-date">結束日期:</label>
        <input type="date" v-model="editEventEndDate" id="edit-event-end-date" :min="editEventStartDate" required />
        <input type="time" v-model="editEventEndTime" id="edit-event-end-time" v />
        <hr />
        <label for="edit-event-color">顏色:</label>
        <input type="color" v-model="editEventColor" id="edit-event-color" required />
        <input type="hidden" v-model="editEventId" id="edit-event-id" />
        <hr />
        <button @click="updateEvent" class="btn btn-outline-primary">更新</button>
        <button v-if="vendorActivityId == null" @click="deleteEvent" class="btn btn-outline-primary">刪除</button>
        <button @click="closeEditEventModal" class="btn btn-outline-primary">取消</button>
      </div>

      <!-- 新增活動 Modal -->
      <div v-if="showEventModal" id="event-modal">
        <h3>新增活動</h3>
        <label for="event-title">活動:</label>
        <input type="text" v-model="eventTitle" id="event-title" placeholder="活動名稱" required />
        <hr />
        <label for="event-start-date">開始日期:</label>
        <input type="date" v-model="eventStartDate" id="event-start-date" :min="currentDateTime" required />
        <input type="time" v-model="eventStartTime" id="event-start-time" required />
        <hr />
        <label for="event-end-date">結束日期:</label>
        <input type="date" v-model="eventEndDate" id="event-end-date" :min="eventStartDate" required />
        <input type="time" v-model="eventEndTime" id="event-end-time" required />
        <hr />
        <label for="event-color">顏色:</label>
        <input type="color" v-model="eventColor" id="event-color" required />
        <hr />
        <button @click="addEvent" class="btn btn-outline-primary">新增</button>
        <button @click="closeAddEventModal" class="btn btn-outline-primary">取消</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import moment from "moment";
import { useAuthStore } from '@/stores/auth'
import Swal from 'sweetalert2'
const authStore = useAuthStore()
const userId = authStore.userId
const vendorId = userId
const calendar = ref(null);
const showEventModal = ref(false);
const showEditEventModal = ref(false);
const events = ref([]);
const eventTitle = ref('');
const eventStartDate = ref('');
const eventStartTime = ref('');
const eventEndDate = ref('');
const eventEndTime = ref('');
const eventColor = ref('#ffffff');

const editEventTitle = ref('');
const editEventStartDate = ref('');
const editEventStartTime = ref('');
const editEventEndDate = ref('');
const editEventEndTime = ref('');
const editEventColor = ref('#ffffff');
const editEventId = ref(null);
const vendorActivityId = ref(null);

// 取得當前日期時間的函數
const getCurrentDateTime = () => {
  let now = new Date();
  return now.toISOString().split("T")[0]; // 格式化為 YYYY-MM-DDTHH:MM
};

// 定義開始和結束時間
const currentDateTime = ref(getCurrentDateTime()); // 取得當前時間
const today = computed(() => new Date().toISOString().split("T")[0]); // 今天的日期
const isPastEvent = computed(() => editEventStartDate.value < today.value); // 判斷是否為過去的事件

const calendarOptions = ref({
  plugins: [dayGridPlugin, timeGridPlugin, listPlugin, resourceTimelinePlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  editable: true,
  selectable: true,
  eventOverlap: false,
  events: events.value,
  eventDidMount: (info) => {
    console.log(info.event); // 调试：查看事件是否正确渲染
  },
  select: (info) => {
    eventStartDate.value = moment(info.start).format("YYYY-MM-DD");
    eventStartTime.value = moment(info.start).format("HH:mm");
    eventEndDate.value = formatDate(info.end ? new Date(info.end - 1) : info.start);
    eventEndTime.value = info.end ? info.end.toISOString().substr(11, 5) : info.start.toISOString().substr(11, 5); // 設定結束時間
    showEventModal.value = true;
  },
  eventClick: (info) => {
    console.log("Event Data:", info.event);  // 检查完整数据
    console.log("Start Time:", info.event.start);  // 确保 start 存在
    console.log("End Time:", info.event.end);  // 确保 end 存在
    console.log("End Time:", info.event);  // 确保 end 存在
    console.log("activityId:", info.event.extendedProps.vendorActivityId);  // 确保 end 存在
    editEventId.value = info.event.id;
    editEventTitle.value = info.event.title;
    vendorActivityId.value = info.event.extendedProps.vendorActivityId;
    editEventStartDate.value = moment(info.event.start).format("YYYY-MM-DD");
    editEventStartTime.value = moment(info.event.start).format("HH:mm");

    editEventEndDate.value = moment(info.event.end).format("YYYY-MM-DD");
    editEventEndTime.value = moment(info.event.end).format("HH:mm");

    editEventColor.value = info.event.backgroundColor;
    showEditEventModal.value = true;

  },
  eventDrop: async (info) => {
    try {
      const updatedEvent = {
        eventId: info.event.id,
        eventTitle: info.event.title,
        start_time: moment(info.event.start).format("YYYY-MM-DDTHH:mm"),
        end_time: info.event.end ? moment(info.event.end).format("YYYY-MM-DDTHH:mm") : moment(info.event.start).format("YYYY-MM-DDTHH:mm"),
        color: info.event.backgroundColor
      };

      // 调用后端 API 更新数据库
      const response = await axios.put(`http://localhost:8080/api/vendor_admin/calendar/update/${updatedEvent.eventId}`, null, {
        params: updatedEvent
      });

      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: '活動已更新！',
          showConfirmButton: true
        });
      }
    } catch (error) {
      console.error("活動更新失敗", error);
      Swal.fire({
        icon: 'error',
        title: '活動更新失敗',
        showConfirmButton: true
      });
      info.revert(); // 撤销拖拽的更改
    }
  }
});

const loadEvents = async () => {
  try {
    const response = await axios.get(`http://localhost:8080/api/vendor_admin/calendar/${vendorId}`);
    console.log("後端回傳數據:", response.data);

    // 確保 Vue 能偵測變更，直接修改 ref([]) 內的值
    events.value = response.data;

    const calendarApi = calendar.value?.getApi();
    if (calendarApi) {
      calendarApi.removeAllEvents(); // 清空日曆，避免重複顯示
      events.value.forEach(event => {
        console.log(`事件: ${event.eventTitle}, startTime: ${event.startTime}, endTime: ${event.endTime},vendorActivityId: ${event.vendorActivity.id}`);

        calendarApi.addEvent({
          id: event.eventId,
          title: event.eventTitle,
          start: event.startTime || new Date().toISOString(), // 確保 startTime 有值
          end: event.endTime, // 確保 endTime 有值
          backgroundColor: event.color || "#ffffff",
          extendedProps: { // 這裡存入 activityId
            vendorActivityId: event.vendorActivity.id
          }

        });
      });
    }
  } catch (error) {
    console.error("獲取活動失敗", error);
  }
};

const formatDate = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const addEvent = async () => {
  if (!eventTitle.value || !eventStartDate.value || !eventStartTime.value) {
    Swal.fire({
      icon: 'warning',
      title: '請填寫完整的活動名稱與開始時間',
      showConfirmButton: true
    });
    return;
  }

  const today = new Date().toISOString().split("T")[0]; // 取得當天日期
  if (eventStartDate.value < today) {
    Swal.fire({
      icon: 'warning',
      title: '開始日期不能小於當天！',
      showConfirmButton: true
    });
    return;
  }

  if (eventEndDate.value < eventStartDate.value ||
    (eventEndDate.value === eventStartDate.value && eventEndTime.value < eventStartTime.value)) {
    Swal.fire({
      icon: 'error',
      title: '結束時間不能早於開始時間！',
      showConfirmButton: true
    });
    return;
  }


  const formData = new FormData();
  formData.append("vendorId", vendorId);  // 你需要用正確的 vendor_id
  formData.append("eventTitle", eventTitle.value);
  formData.append("start_time", `${eventStartDate.value}T${eventStartTime.value}`);
  formData.append("end_time", eventEndDate.value && eventEndTime.value
    ? `${eventEndDate.value}T${eventEndTime.value}`
    : `${eventStartDate.value}T${eventStartTime.value}`);
  formData.append("color", eventColor.value);  // 发送颜色;
  try {
    const response = await axios.post("http://localhost:8080/api/vendor_admin/calendar/add", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',  // 发送表单数据时需要设置此头部
      },
    });

    if (response.status === 201) {
      Swal.fire({
        icon: 'success',
        title: '活動新增成功！',
        showConfirmButton: true
      });

      events.value = [];

      // 你可以根据需要在日历中添加新事件
      const savedEvent = response.data;
      console.log(savedEvent)
      // **直接更新 FullCalendar**
      const calendarApi = calendar.value.getApi();
      calendarApi.addEvent({
        id: savedEvent.eventId,
        title: savedEvent.eventTitle,
        start: savedEvent.startTime,
        end: savedEvent.endTime,
        backgroundColor: savedEvent.color || "#ffffff",
      });

      // **手動更新 `events.value` (可選)**
      events.value.push({
        id: savedEvent.eventId,
        title: savedEvent.eventTitle,
        start: savedEvent.startTime,
        end: savedEvent.endTime,
        backgroundColor: savedEvent.color || "#ffffff",
      });

      console.log(savedEvent);

      calendarApi.refetchEvents();
      clearEventForm();
      showEventModal.value = false;
      events.value = [];

    }
  } catch (error) {
    console.error("新增活動失敗", error);
    Swal.fire({
      icon: 'error',
      title: '新增活動失敗',
      text: '請稍後再試。',
      showConfirmButton: true
    });
  }
};



const updateEvent = async () => {
  if (!editEventId.value || !editEventTitle.value || !editEventStartDate.value || !editEventStartTime.value) {
    Swal.fire({
      icon: 'warning',
      title: '請填寫完整的活動資訊',
      showConfirmButton: true
    });
    return;
  }


  if (editEventEndDate.value < editEventStartDate.value ||
    (editEventEndDate.value === editEventStartDate.value && editEventEndTime.value < editEventStartTime.value)) {
    Swal.fire({
      icon: 'error',
      title: '結束時間不能早於開始時間！',
      showConfirmButton: true
    });
    return;
  }

  try {
    const response = await axios.put(`http://localhost:8080/api/vendor_admin/calendar/update/${editEventId.value}`, null, {
      params: {
        eventTitle: editEventTitle.value,
        start_time: `${editEventStartDate.value}T${editEventStartTime.value}`,
        end_time: `${editEventEndDate.value}T${editEventEndTime.value}`,
        color: editEventColor.value
      }
    });

    if (response.status === 200) {
      Swal.fire({
        icon: 'success',
        title: '活動更新成功！',
        showConfirmButton: false,
        timer: 1000
      });
      const calendarApi = calendar.value?.getApi();
      const event = calendarApi?.getEventById(editEventId.value);
      if (event) {
        event.setProp("title", editEventTitle.value);
        event.setStart(`${editEventStartDate.value}T${editEventStartTime.value}`);
        event.setEnd(`${editEventEndDate.value}T${editEventEndTime.value}`);
        event.setProp("backgroundColor", editEventColor.value);
      }

      showEditEventModal.value = false;
      clearEditEventForm();
    }
  } catch (error) {
    console.error("更新活動失敗", error);
    Swal.fire({
      icon: 'error',
      title: '更新活動失敗',
      text: '請稍後再試。',
      showConfirmButton: true
    });
  }
};

const deleteEvent = async () => {
  if (!editEventId.value) return;
  try {
    await axios.delete(`http://localhost:8080/api/vendor_admin/calendar/delete/${editEventId.value}`);
    const calendarApi = calendar.value?.getApi();
    const event = calendarApi?.getEventById(editEventId.value);
    if (event) {
      event.remove();
    }
    clearEditEventForm();
    showEditEventModal.value = false;
    Swal.fire({
      icon: 'success',
      title: '活動已刪除',
      showConfirmButton: true
    });
  } catch (error) {
    console.error("刪除活動失敗", error);
    Swal.fire({
      icon: 'error',
      title: '刪除活動失敗',
      showConfirmButton: true
    });
  }
};

const closeEditEventModal = () => {
  clearEditEventForm();
  showEditEventModal.value = false;
};

const closeAddEventModal = () => {
  clearEventForm();
  showEventModal.value = false;
};

const clearEventForm = () => {
  eventTitle.value = "";
  eventStartDate.value = "";
  eventStartTime.value = "";
  eventEndDate.value = "";
  eventEndTime.value = "";
  eventColor.value = "#ffffff";
};

const clearEditEventForm = () => {
  editEventTitle.value = "";
  editEventStartDate.value = "";
  editEventStartTime.value = "";
  editEventEndDate.value = "";
  editEventEndTime.value = "";
  editEventColor.value = "#ffffff";
  editEventId.value = null;
};

onMounted(async () => {
  // fetchEvents()
  const events = await loadEvents();
  calendarOptions.value.events = events;
});
</script>


<style scoped>
#event-modal {
  position: fixed;
  /* 固定位置 */
  top: 10%;
  /* 距離畫面上方 10% */
  left: 50%;
  transform: translate(-50%, 0);
  /* 讓模態框水平居中 */
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  width: 400px;
  z-index: 1000;
  text-align: center;
  /* 讓內容置中 */
}

/* 遮罩層，當顯示 Modal 時，背景變暗 */
#modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  /* 半透明黑色背景 */
  z-index: 999;
}

/* 讓按鈕好看一點 */
button {
  margin: 5px;
  padding: 8px 16px;
  border: none;
  cursor: pointer;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.fc-event {
  font-size: 14px;
  padding: 2px;
  border-radius: 4px;
}

.calendar {
  width: 80%;
  /* 設置行事曆的寬度 */
  margin: 0 auto;
  /* 使用自動邊距來水平居中 */
  height: 100%;
}

.container {
  display: flex;
  flex-direction: column;
  padding: 20px;
  align-items: center;
  /* 垂直居中 */
}

.content-body {
  display: flex;
  justify-content: center;
  /* 水平居中整個內容 */
}

.disabled-day {
  background-color: #f0f0f0 !important;
  color: #aaa !important;
  pointer-events: none;
  /* 禁止點擊 */
}
</style>
