<template>
  <transition
    name="sideDialog-fade"
    @after-enter="afterEnter"
    @after-leave="afterLeave">
    <div v-show="visible" class="el-dialog__wrapper" @click.self="handleWrapperClick">
      <div
        ref="dialog"
        :aria-label="title || 'dialog'"
        :class="[{ 'is-fullscreen': fullscreen, 'el-dialog--center': center }, customClass]"
        :style="style"
        role="dialog"
        aria-modal="true"
        class="el-dialog side-dialog">
        <div class="el-dialog__header">
          <slot name="title">
            <span class="el-dialog__title">{{ title }}</span>
          </slot>
          <button
            v-if="showClose"
            type="button"
            class="el-dialog__headerbtn"
            aria-label="Close"
            @click="handleClose">
            <i class="el-dialog__close el-icon el-icon-close"/>
          </button>
        </div>
        <div v-if="rendered" class="el-dialog__body"><slot/></div>
        <div v-if="$slots.footer" class="el-dialog__footer">
          <slot name="footer"/>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import Popup from 'element-ui/src/utils/popup'
import Migrating from 'element-ui/src/mixins/migrating'
import emitter from 'element-ui/src/mixins/emitter'

export default {
  name: 'SideDialog',
  mixins: [Popup, emitter, Migrating],
  props: {
    title: {
      type: String,
      default: ''
    },
    modal: {
      type: Boolean,
      default: true
    },
    modalAppendToBody: {
      type: Boolean,
      default: true
    },
    appendToBody: {
      type: Boolean,
      default: false
    },
    lockScroll: {
      type: Boolean,
      default: true
    },
    closeOnClickModal: {
      type: Boolean,
      default: true
    },
    closeOnPressEscape: {
      type: Boolean,
      default: true
    },
    showClose: {
      type: Boolean,
      default: true
    },

    width: {
      type: String,
      default: ''
    },
    fullscreen: {
      type: Boolean,
      default: false
    },
    customClass: {
      type: String,
      default: ''
    },
    top: {
      type: String,
      default: '15vh'
    },
    // eslint-disable-next-line
    beforeClose: Function,
    center: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      closed: false
    }
  },
  computed: {
    style() {
      const style = {}
      if (!this.fullscreen) {
        style.marginTop = this.top
        if (this.width) {
          style.width = this.width
        }
      }
      return style
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.closed = false
        this.$emit('open')
        this.$el.addEventListener('scroll', this.updatePopper)
        this.$nextTick(() => {
          this.$refs.dialog.scrollTop = 0
        })
        if (this.appendToBody) {
          document.body.appendChild(this.$el)
        }
      } else {
        this.$el.removeEventListener('scroll', this.updatePopper)
        if (!this.closed) this.$emit('close')
      }
    }
  },
  mounted() {
    if (this.visible) {
      this.rendered = true
      this.open()
      if (this.appendToBody) {
        document.body.appendChild(this.$el)
      }
    }
  },
  destroyed() {
    // if appendToBody is true, remove DOM node after destroy
    if (this.appendToBody && this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el)
    }
  },
  methods: {
    getMigratingConfig() {
      return {
        props: {
          'size': 'size is removed.'
        }
      }
    },
    handleWrapperClick() {
      if (!this.closeOnClickModal) return
      this.handleClose()
    },
    handleClose() {
      if (typeof this.beforeClose === 'function') {
        this.beforeClose(this.hide)
      } else {
        this.hide()
      }
    },
    hide(cancel) {
      if (cancel !== false) {
        this.$emit('update:visible', false)
        this.$emit('close')
        this.closed = true
      }
    },
    updatePopper() {
      this.broadcast('ElSelectDropdown', 'updatePopper')
      this.broadcast('ElDropdownMenu', 'updatePopper')
    },
    afterEnter() {
      this.$emit('opened')
    },
    afterLeave() {
      this.$emit('closed')
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  .side-dialog{
    margin-top: 0 !important;
    margin-right: 0;
    height: 100%;
    .el-dialog__header{
      padding: 18px 20px 12px;
      border-bottom: 1px solid #ebebf0;
      .el-dialog__title{
        border-left: 5px solid #2299dd;
        padding-left: 8px;
      }
    }
    .el-dialog__body{
      padding: 0;
      overflow: auto;
      height: calc(100vh - 112px);
      .el-row{
        .el-col{
          padding: 10px 20px;
          .el-form-item{
            margin-bottom: 5px;
            .el-card__body{
              padding: 5px 0px;
              .el-col{ padding: 10px; border: 0}
            }
          }
        }
      }
      .el-form-item__label{ line-height: 24px !important;padding-bottom: 5px}
    }
    .el-dialog__footer{
      width: 100%;
      padding: 10px 20px;
      border-top: 1px solid #ebebf0;
      //box-shadow: 0 -1px 12px 0 rgba(0,0,0,.1);
    }
  }
  .sideDialog-fade-enter-active, .sideDialog-fade-leave-active {
    transition: all 0.3s linear;
    transform: translate3d(0, 0, 0);
  }
  .sideDialog-fade-enter, .sideDialog-fade-leave-to{
    transform: translate3d(100%, 0, 0);
  }
</style>
