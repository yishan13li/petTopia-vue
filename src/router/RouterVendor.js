import VendorIndex from "@/views/vendor/VendorIndex.vue";
import VendorDetail from "@/views/vendor/VendorDetail.vue";
import ActivityIndex from "@/views/activity/ActivityIndex.vue";
import ActivityDetail from "@/views/activity/ActivityDetail.vue";
import VendorSearch from "@/views/vendor/VendorSearch.vue";

export default [
  {
    path: "/vendor",
    name: "VendorIndex",
    component: VendorIndex,
  },

  {
    path: "/vendor/detail/:vendorId",
    name: "VendorDetail",
    component: VendorDetail,
    props: (route) => ({ vendorId: Number(route.params.vendorId) }), // 確保vendorId為數字
  },

  {
    path: "/vendor/search",
    name: "VendorSearch",
    component: VendorSearch,
  },

  {
    path: "/activity",
    name: "ActivityIndex",
    component: ActivityIndex,
  },

  {
    path: "/activity/detail/:activityId",
    name: "ActivityDetail",
    component: ActivityDetail,
    props: (route) => ({ activityId: Number(route.params.activityId) }), // 確保activityId為數字
  },
];
