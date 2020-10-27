<template>
  <div :class="{'thousand-wrap':isNeedRule}" style="display: flex;width: 100%;position: relative;">
    <input
      type="text"
      :disabled="disabled"
      :placeholder="placeholder"
      :value="currentValue"
      @blur="inputMoney"
      @focus="handleFocus"
      @input="handleInput"
      @change="handleChange"
      :class="{'is-disabled': disabled}"
      class="el-input__inner">
    <div class="hidden-input" style="position: absolute;left: 999999999px;">
      <slot name="after"></slot>
    </div>
  </div>
</template>

<script>
import { getInputValue, moneyTest, comdify, delcommafy } from '@/utils/toThousand'

export default {
  name: 'ThousandInput',
  props: {
    isNeedRule: {
      type: Boolean,
      default: false
    },
    data: {
      type: [String, Number]
    },
    placeholder: {
      type: String
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      value: '',
      setVal: false,
      isErr: false,
      currentValue: ''
    }
  },
  watch: {
    data: {
      handler(n) {
        if (n && !this.setVal) {
          this.currentValue = comdify(delcommafy(this.data))
          this.setVal = true
        } else {
          this.currentValue = this.data
        }
      },
      immediate: true
    }
  },
  created() {
    this.setVal = false
  },
  methods: {
    handleChange(event) {
      const value = event.target.value
      this.$emit('handleChange', value)
    },
    handleFocus(event) {
      const value = event.target.value

      if (moneyTest(value)) {
        this.currentValue = Number(delcommafy(value))
      } else {
        this.currentValue = value
      }

      this.$emit('handleFocus', value)
    },
    handleInput(event) {
      const value = event.target.value
      this.setVal = true

      if (moneyTest(value)) {
        this.currentValue = Number(delcommafy(value))
      } else {
        this.currentValue = value
      }
      // this.currentValue = value
      this.$emit('input', this.currentValue)
      this.$emit('change', this.currentValue)
    },
    inputMoney(el, name) {
      const val = el.target.value.replace(/^0+/, '') || ''

      if (moneyTest(val)) {
        this.isErr = false
        this.currentValue = getInputValue(el)
      } else {
        this.currentValue = getInputValue(el)
        this.isErr = true
      }

      this.$emit('handleBlur', val)
    }
  }
}
</script>

<style lang="scss" scoped>
.thousand-wrap{
  position: relative;
  margin-bottom: 22px;
  .err{
    display: none;
    color: #F56C6C;
    font-size: 12px;
    line-height: 1;
    padding-top: 4px;
    position: absolute;
    top: 100%;
    left: 0;
  }
  .is-err{
    display: inline;
  }
}

input{
  height: 36px;
  line-height: 36px;
  border: 1px solid #ccc;
  &:hover{
    border-color: #C0C4CC;
  }
  &.is-disabled{
    background-color: #F5F7FA;
    border-color: #E4E7ED;
    color: #C0C4CC;
    cursor: not-allowed;
  }
}
</style>
