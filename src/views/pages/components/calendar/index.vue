<template>
  <div class="calendar-container">
    <div class="calendar-container_Hhh">
      {{formatYM}}
    </div>
    <div>
      <div class="calendar-weekBox">
        <span class="calendar-weekItem" v-for="item in weeks" :key="item">{{item}}</span>
      </div>
      <div>
        <div class="calendar-dayBox">
          <div
            class="calendar-dayItem blurDay"
            v-for="item in getBefore"
            :key="'be' + item">
            <span>{{formatDate(item, 'DD')}}</span>
          </div>
          <div
            class="calendar-dayItem"
            @click.stop="handleSelectDate(item)"
            :class="{active: selectedDay.includes(formatDate(item))}"
            v-for="item in getDays"
            :key="'ac' + item">
            <span>{{formatDate(item, 'DD')}}</span></div>
          <div
            class="calendar-dayItem blurDay"
            v-for="item in getAfter"
            :key="'af' + item">
            <span>{{formatDate(item, 'DD')}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'Calender',
  props: {
    ym: {
      type: String,
      default: null
    },
    defaultSelect: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      weeks: ['一', '二', '三', '四', '五', '六', '日'],
      mouths: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
      days: 0,
      selectedDay: []
    }
  },
  computed: {
    formatYM() {
      if (!this.ym) return
      const y = this.ym.split('-')[0]
      const m = this.ym.split('-')[1]
      return `${this.mouths[m - 1]} ${y}`
    },
    formatDate() {
      return (date, type = 'YYYY-MM-DD') => {
        if (date) return moment(date).format(type)
      }
    },
    getDays() {
      if (this.ym) {
        const y = this.ym.split('-')[0]
        const m = this.ym.split('-')[1]

        const days = new Date(y, m, 0).getDate()

        const arr = []

        for (let i = 0; i < days; i++) {
          arr.push(moment(`${this.ym}-${i + 1}`).format('YYYY-MM-DD'))
        }

        return arr
      } else {
        return ''
      }
    },
    getBefore() {
      const date = `${this.ym}-1`
      let n = 0
      const arr = []

      const w = new Date(date).getDay()
      if (w === 0) {
        n = 7
      } else {
        n = w
      }

      for (let i = 0; i < n - 1; i++) {
        arr.push(moment(date).subtract(i + 1, 'day').format('YYYY-MM-DD'))
      }

      return arr.reverse()
    },
    getAfter() {
      const date = moment(this.ym).endOf('month').format('YYYY-MM-DD')

      let n = 0
      if (new Date(date).getDay() === 0) return
      n = 7 - new Date(date).getDay()
      const arr = []

      for (let i = 0; i < n; i++) {
        arr.push(moment(date).add(i + 1, 'day').format('YYYY-MM-DD'))
      }

      return arr
    }
  },
  watch: {
    defaultSelect: {
      handler(n) {
        this.selectedDay = []
        n.forEach(item => {
          if (this.getDays.includes(item)) this.selectedDay.push(item)
        })
        // this.selectedDay = [...n]
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    handleSelectDate(date) {
      if (this.selectedDay.includes(date)) {
        this.$emit('selectDate', {
          status: 0,
          date
        })
        this.selectedDay.splice(this.selectedDay.findIndex((v) => v === date), 1)
      } else {
        this.$emit('selectDate', {
          status: 1,
          date
        })
        this.selectedDay.push(date)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .calendar-container{
    .calendar-container_Hhh{
      display: flex;
      justify-content: center;
      font-size: 16px;
      color: #000000;
      height: 42px;
      line-height: 42px;
    }
    .calendar-weekBox{
      display: flex;
      align-items: center;
      .calendar-weekItem{
        flex: 1;
        font-size: 14px;
        text-align: center;
        color: #b8bfc6;
        cursor: pointer;
      }
    }
    .calendar-dayBox{
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      min-height: 200px;
      .calendar-dayItem{
        display: flex;
        flex: 0 0 14.2857142857%;
        align-items: center;
        justify-content: center;
        flex: 0 0 calc(100% / 7);
        height: 32px;
        border: 0;
        font-size: 14px;
        background: none;
        color: #7c86a2;
        cursor: pointer;
        span{
          display: flex;
          align-items: center;
          justify-content: center;
          height: 32px;
          // border-radius: 50%;
          // padding: 4px 10px;
          transition: background-color 200ms ease;
        }
        &.blurDay{
          color: #e1e4e7;
        }
        &:hover{
          background-color: #efefef;
          span{
            // background-color: #efefef;
          }
        }
        &.active{
          background-color: #409EFF;
          span{
            // background-color: #409EFF;
            color: #ffffff
          }
        }
      }
    }
  }
</style>
