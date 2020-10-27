<template>
  <div :class="className" :style="{height:height,width:width}"></div>
</template>

<script>
import echarts from 'echarts'
import resize from '@/components/Charts/mixins/resize'
require('echarts/theme/macarons') // echarts theme
// import { debounce } from '@/utils'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '360px'
    },
    chartData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    title: {
      type: String
    }
  },
  data() {
    return {
      chart: null,
      currentIndex: -1,
      seriesIndex: 0,
      dataIndex: 0
    }
  },
  mounted() {
    this.initChart()
    // this.__resizeHanlder = debounce(() => {
    //   if (this.chart) {
    //     this.chart.resize()
    //   }
    // }, 100)
    // window.addEventListener('resize', this.__resizeHanlder)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    // window.removeEventListener('resize', this.__resizeHanlder)
    this.chart.dispose()
    this.chart = null
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        if (this.chart) {
          this.chart.dispose()
          this.chart = null
        }

        this.setOptions()
      }
    }
  },
  methods: {
    initChart() {
      this.setOptions()
    },
    setOptions() {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        color: ['#63b2ee', '#f89588', '#7cd6cf', '#9192ab', '#7898e1', '#efa666', '#eddd86', '#9987ce', '#63b2ee', '#76da91'],
        title: {
          text: this.title
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: this.chartData.dict
        },
        grid: {
          top: '20%',
          left: '0',
          right: '0',
          containLabel: true
        },
        toolbox: {
          show: true,
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            data: this.chartData.xAxisData
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '单位（元）'
          }
        ],
        series: [
          {
            name: this.chartData.dict[0],
            type: 'bar',
            data: this.chartData[this.chartData.legendData[0]],
            markPoint: {
              data: [
                { type: 'max', name: '最大值' }
              ]
            }
          },
          {
            name: this.chartData.dict[1],
            type: 'bar',
            data: this.chartData[this.chartData.legendData[1]],
            markPoint: {
              data: [
                { type: 'max', name: '最大值' }
              ]
            }
          }
        ]
      })

      this.chart.resize()
    }
  }
}
</script>
