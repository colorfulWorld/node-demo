<template>
  <ProLayout>
    <router-view></router-view>
  </ProLayout>
</template>

<script>
import ProLayout from "@/components/ProLayout";
export default {
  name: "BasicLayout",
  components: {
    ProLayout,
  },
};
</script>
