<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <component :is="ImageUpload" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ImageUpload from "@/components/ImageUpload";

export default {
  data() {
    return {
      ImageUpload,
    };
  },
  name: "Dashboard",
  computed: {
    ...mapGetters(["name"]),
  },
};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
