<template>
  <div class="timeline">
    <p class="text">起始时间</p>
    <el-slider v-model="timeRange" class="custom-slider" range :min="min" :max="max" :marks="marks" :show-tooltip="false" @change="change" />
    <p class="text" style="margin-right: 0">结束时间</p>
  </div>
</template>

<script>
export default {
  name: 'Timeline',
  props: {
    years: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      timeRange: [],
      min: 0,
      max: 0,
      marks: {}
    }
  },
  watch: {
    years: {
      handler() {
        this.timeRange = [this.years[0], this.years[this.years.length - 1]]
        this.min = this.timeRange[0]
        this.max = this.timeRange[1]
      },
      deep: true
    }
  },
  created() {
    const year = new Date().getFullYear()
    if (this.years.length > 0) {
      this.timeRange = [this.years[0], this.years[this.years.length - 1]]
      this.min = this.timeRange[0]
      this.max = this.timeRange[1]
    }
    for (let i = year - 20; i <= year; i++) {
      this.marks[i] = i.toString()
    }
  },
  methods: {
    change() {
      this.$emit('select', this.timeRange)
    }
  }
}
</script>

<style scoped lang="scss">
  .timeline{
    white-space: nowrap;
    display: flex;
    font-size: 10px;
    width: 100%;
    align-items: center;
    .text{
      margin-right: 20px;
    }
    .el-slider{
      flex: 1;
      margin-right: 20px;
    }
  }
</style>
