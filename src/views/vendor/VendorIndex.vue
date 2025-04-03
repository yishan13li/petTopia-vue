<template>
  <!-- Google Maps -->
  <div class="container" style="width: 30%">
    <div class="input-group mb-3">
      <span class="input-group-text" id="inputGroup-sizing-default">關鍵字</span>
      <input
        type="text"
        class="form-control"
        aria-label="Sizing example input"
        aria-describedby="inputGroup-sizing-default"
        v-model="keyword"
        @blur="findCoordinateByKeyword()"
      />
    </div>

    <div class="input-group mb-3">
      <label class="input-group-text" for="categoryList">類　別</label>
      <select
        class="form-select"
        id="categoryList"
        v-model="selectedCategoryId"
        @change="findCoordinateByCategory()"
      >
        <option v-for="(category, index) in filters" :key="index" :value="category.id">
          {{ category.name }}
        </option>
      </select>
    </div>
  </div>

  <div id="map" style="height: 700px; width: 70%; margin: 20px auto; display: block"></div>
  <!-- Google Maps -->

  <!-- 店家列表開始 -->
  <section class="my-5">
    <div class="container my-5 py-5">
      <div class="section-header d-md-flex justify-content-between align-items-center">
        <h2 class="display-3 fw-normal">店家列表</h2>
      </div>
      <div class="mb-4 mb-md-0">
        <p class="m-0">
          <!-- 篩選按鈕開始 -->
          <span style="margin-right: 10px">類別：</span>
          <button
            v-for="filter in filters"
            :key="filter.id"
            class="filter-button me-4"
            :class="{ active: activeFilter === filter.id }"
            @click="setFilter(filter.id)"
          >
            <!-- activeFilter === filter.id 為用來判斷active為true或false -->

            {{ filter.name }}
          </button>
          <!-- 篩選按鈕結束 -->
        </p>
      </div>

      <div class="row">
        <div
          v-for="vendor in filteredVendors"
          :key="vendor.id"
          :class="['item', vendor.id, 'col-md-4', 'col-lg-3', 'my-4']"
        >
          <div class="card position-relative">
            <a :href="`/vendor/detail/${vendor.id}`">
              <span v-if="vendor.logoImgBase64">
                <img :src="vendor.logoImgBase64" class="img-fluid rounded-4" alt="店家圖片" />
              </span>
              <span v-else>
                <img
                  src="/user_static/images/tool/no-photo.png"
                  class="img-fluid rounded-4"
                  alt="店家圖片"
                />
              </span>
            </a>
            <div class="card-body p-0">
              <a :href="`/vendor/detail/${vendor.id}`" v-if="vendor.name">
                <h2 class="card-title pt-4 m-0">{{ vendor.name }}</h2>
              </a>
              <a :href="`/vendor/detail/${vendor.id}`" v-else>
                <h2 class="card-title pt-4 m-0" style="color: #d3d3d3">無店家名稱</h2>
              </a>
              <div class="card-text">
                <span class="rating secondary-font">{{ vendor.description }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <!-- 店家列表結束 -->
</template>

<script setup>
import 'swiper/css'
import 'swiper/css/pagination'
import { ref, computed, onMounted } from 'vue'

/* 0. 隨機排列 */
const shuffleList = (array) => {
  return array.sort(() => Math.random() - 0.5)
}

/* 1. 店家列表 */
const vendorList = ref([])
const fetchVendorList = async () => {
  try {
    const response = await fetch(`http://localhost:8080/api/vendor/all`)
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)

    const data = await response.json()
    vendorList.value = data
  } catch (error) {
    console.error('獲取店家清單失敗:', error)
  }
}
onMounted(fetchVendorList)

/* 2. 店家篩選 */
const activeFilter = ref(0)
const filters = ref([])

const fetchVendorCategory = async () => {
  try {
    const response = await fetch(`http://localhost:8080/api/vendor/category/show`)

    const data = await response.json()
    filters.value = filters.value = [
      { id: 0, name: '全部' },
      ...data,
      { id: 999, name: '沒有分類' },
    ]
  } catch (error) {
    console.error('獲取店家類別失敗:', error)
  }
}
onMounted(fetchVendorCategory)

const setFilter = (filter) => {
  activeFilter.value = filter
}

const filteredVendors = computed(() => {
  if (activeFilter.value === 0) {
    return vendorList.value
  } else if (activeFilter.value === null) {
    const filteredVendorList = vendorList.value.filter((vendor) => !vendor.vendorCategory)
    return filteredVendorList
  } else {
    const filteredVendorList = vendorList.value.filter(
      (vendor) => vendor.vendorCategory && vendor.vendorCategory.id === activeFilter.value // 第一個條件為要有分類，第二個條件為篩選
    )
    return filteredVendorList
  }
})

/* 3. 取得所有店家座標 */
const coordinate = ref([
  {
    id: '',
    name: '',
    vendorCategory: {
      id: '',
      name: '',
    },
    address: '',
    longitude: '',
    latitude: '',
  },
])

const fetchCoordinate = async () => {
  try {
    const response = await fetch(`http://localhost:8080/api/vendor/all/coordinate`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
    let result = await response.json()
    coordinate.value = result
  } catch (error) {
    console.error('讀取座標失敗:', error)
  }
}
onMounted(fetchCoordinate)

/* 4. Google Maps */

// 存放所有Marker
const mapMarkers = ref([])

// 建立Marker內容的方法
const createMarkerContent = (store) => {
  const content = document.createElement('div')
  content.style.display = 'flex'
  content.style.alignItems = 'center'
  content.style.flexDirection = 'column'

  const img = document.createElement('img')
  img.src = store.vendor?.logoImgBase64 || '/user_static/images/tool/no-photo.png'
  img.style.width = '50px'
  img.style.height = '50px'
  img.style.borderRadius = '50%'
  img.style.boxShadow = '0px 0px 5px rgba(0, 0, 0, 0.5)'

  const label = document.createElement('div')
  label.innerText = store.name
  label.style.color = 'black'
  label.style.fontSize = '14px'
  label.style.fontWeight = 'bold'
  label.style.background = 'white'
  label.style.padding = '2px 5px'
  label.style.borderRadius = '4px'
  label.style.marginTop = '5px'
  label.style.boxShadow = '0px 0px 5px rgba(0, 0, 0, 0.3)'

  content.appendChild(img)
  content.appendChild(label)

  return content
}

// 設定全域使用的Map
// const mapForGlobalUse = ref()

// 初始化Map
const loadGoogleMaps = () => {
  if (window.google && window.google.maps) {
    console.log('Google Maps API 已經載入')
    return
  }

  const script = document.createElement('script')
  script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAdtvNzj4RCUhcxxFuXDpvjXCglqPja6cI&libraries=marker&callback=initMap&loading=async`
  script.async = true
  script.defer = true
  document.head.appendChild(script)
}

const initMap = () => {
  const map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 23.97565, lng: 120.9738819 },
    zoom: 8,
    mapId: 'ed245ec414e0b167 ',
  })

  // 設定全域使用的Map
  // mapForGlobalUse.value = map

  // 清除舊的Marker，避免重載地圖時標記重複疊加
  mapMarkers.value.forEach((marker) => marker.setMap(null))
  mapMarkers.value = []

  // 使用迴圈建立多個Marker
  coordinate.value.forEach((store) => {
    const marker = new google.maps.marker.AdvancedMarkerElement({
      position: { lat: store.latitude, lng: store.longitude },
      map: map,
      title: store.name,
      content: createMarkerContent(store),
    })

    const infoWindow = new google.maps.InfoWindow({
      content: `<h3>${store.name}</h3><p>${store.address}</p>`,
    })

    marker.addListener('gmp-click', () => {
      infoWindow.open(map, marker)
    })

    mapMarkers.value.push(marker) // 把Marker存到陣列中
  })
}

onMounted(async () => {
  window.initMap = initMap // 將initMap註冊到全域對象，讓Google Maps API可以調用
  await fetchCoordinate() // 確保先取得座標
  loadGoogleMaps()
})

/* 5. Google Maps 模糊搜尋 */
const keyword = ref()
const findCoordinateByKeyword = async () => {
  selectedCategoryId.value = 0

  if (keyword.value.trim() === '') {
    keyword.value = ''
  }
  const data = {
    keyword: keyword.value,
  }

  try {
    const response = await fetch(`http://localhost:8080/api/vendor/coordinate/find`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    let result = await response.json()
    coordinate.value = result

    const map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: 23.97565, lng: 120.9738819 },
      zoom: 8,
      mapId: 'ed245ec414e0b167 ',
    })

    // 清除舊的標記，避免重載地圖時標記重複疊加
    mapMarkers.value.forEach((marker) => marker.setMap(null))
    mapMarkers.value = []

    // 迴圈建立多個 Marker
    coordinate.value.forEach((store) => {
      const marker = new google.maps.marker.AdvancedMarkerElement({
        position: { lat: store.latitude, lng: store.longitude },
        map: map,
        title: store.name,
        content: createMarkerContent(store),
      })

      const infoWindow = new google.maps.InfoWindow({
        content: `<h3>${store.name}</h3><p>${store.address}</p>`,
      })

      marker.addListener('gmp-click', () => {
        infoWindow.open(map, marker)
      })

      mapMarkers.value.push(marker) // 把標記存到陣列中
    })
  } catch (error) {
    console.error('讀取座標失敗:', error)
  }
}

/* 6. Google Maps 下拉式篩選 */
const selectedCategoryId = ref(0)

const findCoordinateByCategory = async () => {
  keyword.value = ''

  if (selectedCategoryId.value == 0) {
    keyword.value = ''
    findCoordinateByKeyword()
    return
  }

  try {
    const response = await fetch(
      `http://localhost:8080/api/vendor/coordinate/find/category/${selectedCategoryId.value}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    )
    let result = await response.json()
    coordinate.value = result

    const map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: 23.97565, lng: 120.9738819 },
      zoom: 8,
      mapId: 'ed245ec414e0b167 ',
    })

    // 清除舊的標記，避免重載地圖時標記重複疊加
    mapMarkers.value.forEach((marker) => marker.setMap(null))
    mapMarkers.value = []

    // 迴圈建立多個 Marker
    coordinate.value.forEach((store) => {
      const marker = new google.maps.marker.AdvancedMarkerElement({
        position: { lat: store.latitude, lng: store.longitude },
        map: map,
        title: store.name,
        content: createMarkerContent(store),
      })

      const infoWindow = new google.maps.InfoWindow({
        content: `<h3>${store.name}</h3><p>${store.address}</p>`,
      })

      marker.addListener('gmp-click', () => {
        infoWindow.open(map, marker)
      })

      mapMarkers.value.push(marker) // 把標記存到陣列中
    })
  } catch (error) {
    console.error('讀取座標失敗:', error)
  }
}
</script>

<style>
.filter-button.active {
  font-weight: bold;
  border-bottom: 2px solid black;
}
</style>
