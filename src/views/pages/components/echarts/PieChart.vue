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
        color: ['#63b2ee', '#76da91', '#f8cb7f', '#f89588', '#7cd6cf', '#9192ab', '#7898e1', '#efa666', '#eddd86', '#9987ce', '#63b2ee', '#76da91'],
        title: {
          text: this.title,
          // textStyle: {
          //   color: '#333333',
          //   fontSize: 16
          // },
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b} {c} ({d}%)'
        },
        legend: {
          selectedMode: false, // 取消图例上的点击事件
          // type: 'scroll',
          // orient: 'vertical',
          // right: 45,
          top: 30,
          // bottom: 0,
          // data: ['相机', '屏幕'],
          data: this.chartData.legendData
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: '55%',
            center: ['50%', '65%'],
            // selectedOffset: 0, // 选中扇区的偏移距离
            // avoidLabelOverlap: false, // 是否启用防止标签重叠策略，默认开启, 如果不需要开启该策略, 所有标签放在中心位置
            data: this.chartData.seriesData
          }
        ]
      })

      this.chart.resize()

      // this.seriesIndex = 0
      // this.dataIndex = 0
      // // 设置默认选中高亮部分
      // this.chart.dispatchAction({
      //   type: 'highlight',
      //   seriesIndex: this.seriesIndex,
      //   dataIndex: this.dataIndex
      // })
      // this.chart.on('mouseover', function(e) {
      //   // 当检测到鼠标悬停事件，取消默认选中高亮
      //   this.chart.dispatchAction({
      //     type: 'downplay',
      //     seriesIndex: this.seriesIndex,
      //     dataIndex: this.dataIndex
      //   })
      //   // 高亮显示悬停的那块
      //   this.chart.dispatchAction({
      //     type: 'highlight',
      //     seriesIndex: e.seriesIndex,
      //     dataIndex: e.dataIndex
      //   })
      //   this.seriesIndex = e.seriesIndex
      //   this.dataIndex = e.dataIndex
      // }.bind(this))
      // // 测鼠标移出后显示之前默认高亮的那块
      // this.chart.on('mouseout', function(e) {
      //   this.chart.dispatchAction({
      //     type: 'highlight',
      //     seriesIndex: e.seriesIndex,
      //     dataIndex: e.dataIndex
      //   })
      // }.bind(this))
    }
  }
}
</script>
