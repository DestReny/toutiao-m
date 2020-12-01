<template>
  <van-icon
    :name="value === 1 ? 'good-job' : 'good-job-o'"
    :class="{ collected: value === 1 }"
    :loading="loading"
    @click="onCollect"
  />
</template>

<script>
import { addLike, deleteLike } from '@/api/article.js'

export default {
  name: 'LikeArticle',
  props: {
    value: {
      type: Number,
      required: true
    },
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  data() {
    return {
      loading: false
    }
  },
  methods: {
    async onCollect() {
      this.loading = true
      try {
        let status = -1
        if (this.value === 1) {
          // 以点赞，取消点赞
          await deleteLike(this.articleId)
        } else {
          // 未点赞，点赞
          await addLike(this.articleId)
          status = 1
        }

        // 更新视图
        this.$emit('input', status)

        this.$toast.success(status === 1 ? '点赞成功' : '取消点赞')
      } catch (err) {
        this.$toast.fail('操作失败，请重试!')
      }
      this.loading = false
    }
  }
}
</script>

<style scoped lang="less">
.collected {
  color: #e5645f;
}
</style>
