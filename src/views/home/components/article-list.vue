<template>
  <div class="article-list">
    <van-pull-refresh
      :success-text="isreFreshSuccessText"
      :success-duration="1500"
      v-model="isreFreshLoading"
      @refresh="onRefresh"
    >
      <van-list
        ref="listRef"
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        @load="onLoad"
      >
        <article-item
          v-for="(article, index) in list"
          :key="index"
          :article="article"
        />
        <!-- <van-cell
          v-for="(article, index) in list"
          :key="index"
          :title="article.title"
        /> -->
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api/article.js'
import ArticleItem from '@/components/article-item/index.vue'

export default {
  name: 'ArticleList',
  components: {
    // 组件的引用
    ArticleItem
  },
  props: {
    // 父辈向子辈传参
    channel: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      list: [], // 存储列表数据的数组
      loading: false, // 控制加载中 loading 状态
      finished: false, // 控制数据加载结束的状态
      timestamp: null, // 请求获取下一页数据的时间戳
      error: false, // 控制列表加载失败的提示状态
      isreFreshLoading: false, // 控制下拉刷新的 loading 状态
      isreFreshSuccessText: '' // 下拉刷新成功提示文本
    }
  },
  computed: {
    // 计算属性
  },
  watch: {
    // 监测变化
  },
  created() {
    // 实例被创建之后执行代码
  },
  mounted() {
    // 页面进入时加载内容
  },
  methods: {
    // 方法
    // 初始化或滚动到底部的时候会触发调用 onLoad
    async onLoad() {
      try {
        // 1. 请求获取数据
        const { data } = await getArticles({
          channel_id: this.channel.id, // 频道ID
          // timestamp 简单理解就是请求数据的页码
          // 请求第1页数据：当前最新时间戳
          // 用于请求之后数据的时间戳会在当前请求结果中返回给你
          timestamp: this.timestamp || Date.now(),
          // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
          with_top: 1
        })

        // 通过生成随机数，模拟随机失败的情况
        // if (Math.random() > 0.5) {
        //   JSON.parse('sdhuaidw')
        // }

        // 2. 把请求结果数据放到 list 数组中
        const { results } = data.data
        // 数组的展开操作符，它会把数组元素一个个拿出来
        this.list.push(...results)

        // 3. 本次数据加载结束之后要把加载状态设置为结束
        this.loading = false

        // 4. 判断数据是否全部加载完成
        if (results.length) {
          // 更新获取下一页数据的时间戳
          this.timestamp = data.data.pre_timestamp
        } else {
          // 没有数据了，将 finished 设置为 true，不再 load 加载更多了
          this.finished = true
        }
      } catch (err) {
        // 展示错误提示状态
        this.error = true
        this.loading = false
      }
    },
    // 当下拉刷新的时候会触发调用该函数
    async onRefresh() {
      try {
        // 1. 请求获取数据
        const { data } = await getArticles({
          channel_id: this.channel.id, // 频道ID
          timestamp: Date.now(), // 下拉刷新，每次请求获取最新数据，所以传递当前最新时间戳
          // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
          with_top: 1
        })

        // 通过生成随机数，模拟随机失败的情况
        // if (Math.random() > 0.2) {
        //   JSON.parse('sdhuaidw')
        // }

        // 2. 将数据追加到列表的顶部
        const { results } = data.data
        // this.list.unshift(...results)
        // 直接赋值
        this.list = results
        this.$refs.listRef.check()

        // 3. 关闭下拉刷新的 loading 状态
        this.isreFreshLoading = false

        // 更新下拉刷新成功提示的文本
        this.isreFreshSuccessText = `刷新成功，更新了${results.length}条数据`
      } catch (err) {
        this.isreFreshLoading = false
        this.isreFreshSuccessText = '刷新失败'
      }
    }
  }
}
</script>

<style scoped lang="less">
/deep/ .article-list {
  // 百分比单位是相对于父元素的
  // height: 100%;
  // 1vw = 视图窗口宽度的百分之一
  // 1vh = 视图窗口高度的百分之一
  // height: 79vh;  在iphone 6/7/8中没有问题，但是在iphone X中有问题
  height: calc(100vh - 174px);
  overflow-y: auto;
}
</style>
