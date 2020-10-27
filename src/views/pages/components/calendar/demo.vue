<template>
  <div>
    <div>
      <el-form label-width="100px" label-position="'left'">
        <el-row>
          <el-col :span="8">
            <el-form-item label="日历年份">
              <el-select v-model="form.year" clearable placeholder="请选择" style="width: 100%;">
                <el-option
                  v-for="item in getYears"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="周休日">
              <el-checkbox-group
                v-model="form.weeks"
                @change="getSelectDate">
                <el-checkbox v-for="item in weeks" :label="item.value" name="type" :key="item.value">{{item.label}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="月休日">
              <el-checkbox-group
                v-model="form.days"
                @change="getSelectDate">
                <el-checkbox v-for="item in 31" :label="item" name="type" :key="item">{{item}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <el-row :gutter="20">
      <el-col :span="8" v-for="item in 12" :key="item" style="margin-bottom: 20px;">
        <el-card shadow="never">
          <calendar :ref="'calendar' + item" :key="'calendar' + item" :ym="formatSelect(item)" :defaultSelect="defaultSelect" />
        </el-card>
      </el-col>
    </el-row>

    <div>
      <el-button @click="getResult">result</el-button>
      <el-button @click="handleSave">保存</el-button>

      <div>
        {{result}}
      </div>
    </div>
  </div>
</template>

<script>
import Calendar from '@/views/pages/components/calendar'
import moment from 'moment'
import Model from '@/api/ec/param'

export default {
  name: 'Work',
  components: { Calendar },
  data() {
    return {
      form: {
        days: [],
        weeks: [],
        year: moment().format('YYYY')
      },
      minYear: 2001,
      maxYear: 2040,
      selectYear: '',
      defaultSelect: [],
      weeks: [
        { value: '0', label: '周一' },
        { value: '1', label: '周二' },
        { value: '2', label: '周三' },
        { value: '3', label: '周四' },
        { value: '4', label: '周五' },
        { value: '5', label: '周六' },
        { value: '6', label: '周日' }
      ],
      result: []
    }
  },
  created() {
    this.fetchView()
  },
  computed: {
    getYears() {
      if (!this.minYear || !this.maxYear) return []
      const arr = []
      for (let i = this.minYear; i <= this.maxYear; i++) {
        arr.push({
          value: i,
          label: i
        })
      }
      return arr
    },
    formatSelect() {
      return (v) => {
        if (!this.form.year || !v) return ''
        return `${this.form.year}-${v}`
      }
    }
  },
  methods: {
    fetchView() {
      const { year } = this.form
      if (!year) return

      const param = {
        year
      }
      Model.holidayDetail('2020').then(res => {
        console.log(res)
      })
        .catch(e => {
          // .
        })
    },
    handleSave() {
      this.getResult()

      const { year, weeks = [], days = [] } = this.form
      const param = {
        holidayYear: year,
        weekList: weeks.map(item => {
          return {
            holidayYear: year,
            code: item,
            isSelected: true
          }
        }),
        monthDateList: days.map(item => {
          return {
            holidayYear: year,
            code: item,
            isSelected: true
          }
        }),
        detailList: this.result.map(item => {
          return {
            holidayYear: year,
            holidayDate: item
          }
        })
      }

      Model.holidayAdd(param).then(res => {
        this.fetchView()
      })
    },
    getResult() {
      const result = []
      for (let i = 1; i <= 12; i++) {
        result.push(...this.$refs['calendar' + i][0].selectedDay)
      }

      this.result = [...new Set(result)]
    },
    getSelectDate() {
      if (!this.form.year) return

      // 获取每年第一个周一
      const arr = [1, 2, 3, 4, 5, 6, 7]
      let begin = ''

      arr.forEach(item => {
        if (new Date(`${this.form.year}-1-${item}`).getDay() === 1) {
          begin = `${this.form.year}-1-${item}`
        }
      })

      const end = `${this.form.year}-12-31`

      let selectWeeks = []
      const selectDays = []

      // 获取周
      this.form.weeks.forEach(item => {
        selectWeeks = [...selectWeeks, ...this.getWeekAll(begin, end, item)]
      })

      // 获取月
      for (let i = 1; i <= 12; i++) {
        this.form.days.forEach(item => {
          selectDays.push(moment(`${this.form.year}-${i}-${item}`).format('YYYY-MM-DD'))
        })
      }

      this.defaultSelect = [...selectWeeks, ...selectDays]
    },
    // 按周查询
    getWeekAll(begin, end, n) {
      const dateAllArr = []
      const ab = begin.split('-')
      const ae = end.split('-')
      const db = new Date()
      db.setUTCFullYear(ab[0], ab[1] - 1, ab[2])
      const de = new Date()
      de.setUTCFullYear(ae[0], ae[1] - 1, ae[2])
      const unixDb = db.getTime() + n * 24 * 60 * 60 * 1000
      const unixDe = de.getTime() + n * 24 * 60 * 60 * 1000
      for (let k = unixDb; k <= unixDe;) {
        dateAllArr.push(moment(new Date(parseInt(k))).format('YYYY-MM-DD'))
        k = k + 7 * 24 * 60 * 60 * 1000
      }
      return dateAllArr
    }
  }
}
</script>

<style scoped>

</style>
