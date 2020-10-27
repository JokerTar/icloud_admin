<template>
  <div class="components-container">
    <div>
      <tinymce v-model="content" :height="300" />
    </div>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'

export default {
  name: 'TinymceDemo',
  components: { Tinymce },
  props: {
    data: {
      type: String
    }
  },
  data() {
    return {
      content: ''
    }
  },
  watch: {
    data(n) {
      this.content = n
    },
    content(n) {
      this.$emit('handleChange', n)
    }
  }
}
</script>

<style scoped>
.editor-content{
  margin-top: 20px;
}
.components-container{
  margin:  0;
}
.mce-branding{
  display: none !important;
}
</style>

