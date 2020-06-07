<template>
  <div>
    <div class="md-modal modal-msg md-modal-transition " v-bind:class="{'md-show':mdShow}">
      <div class="md-modal-inner">
        <div class="md-top">
          <button class="md-close" @click="close()">Close</button>
        </div>
        <div class="md-content">
          <div class="confirm-tips">
            <slot name="message"></slot>
          </div>
          <div class="btn-wrap">
            <slot name="btnGroup"></slot>
          </div>
        </div>
      </div>
    </div>
    <!----------------------------    遮罩层      ------------------>
    <div class="md-overlay" v-if="mdShow"></div>
  </div>
</template>

<script>
    export default {
      props:["mdShow"],//接受父组件传递的值
      methods:{
        close(){
          this.$emit("close")
        }
      }
    }
</script>

<style scoped>

</style>
