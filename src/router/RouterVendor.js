import VendorIndex from '@/views/vendor/VendorIndex.vue'
import VendorDetail from '@/views/vendor/VendorDetail.vue'
import ActivityIndex from '@/views/activity/ActivityIndex.vue'
import ActivityDetail from '@/views/activity/ActivityDetail.vue'
import VendorSearch from '@/views/vendor/VendorSearch.vue'
import ActivitySearch from '@/views/activity/ActivitySearch.vue'
import Vendor from '@/views/vendor/Vendor.vue'

export default [
  {
    path: '/vendor',
    name: 'Vendor',
    component: Vendor,
    meta: {
      title: '店家首頁 - PetTopia'
  }
  },
  {
    path: '/vendor/index',
    name: 'VendorIndex',
    component: VendorIndex,
    meta: {
      title: '店家列表 - PetTopia'
  }
  },

  {
    path: '/vendor/detail/:vendorId',
    name: 'VendorDetail',
    component: VendorDetail,
    props: (route) => ({ vendorId: Number(route.params.vendorId) }), // 確保vendorId為數字
    meta: {
      title: '店家詳情 - PetTopia'
  }
  },

  {
    path: '/vendor/search',
    name: 'VendorSearch',
    component: VendorSearch,
  },

  {
    path: '/activity/index',
    name: 'ActivityIndex',
    component: ActivityIndex,
    meta: {
      title: '活動列表 - PetTopia'
  }
  },

  {
    path: '/activity/detail/:activityId',
    name: 'ActivityDetail',
    component: ActivityDetail,
    props: (route) => ({ activityId: Number(route.params.activityId) }), // 確保activityId為數字
    meta: {
      title: '活動詳情 - PetTopia'
  }
  },

  {
    path: '/activity/search',
    name: 'ActivitySearch',
    component: ActivitySearch,
  },
]
