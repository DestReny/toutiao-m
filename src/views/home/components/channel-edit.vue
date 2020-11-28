<template>
  <div class="channel-edit">
    <van-cell :border="false">
      <div slot="title" class="title-text">我的频道</div>
      <van-button
        class="edit-btn"
        @click="isEdit = !isEdit"
        size="mini"
        round
        type="danger"
        plain
        >{{ isEdit ? '完成' : '编辑' }}</van-button
      >
    </van-cell>
    <van-grid class="my-grid" :gutter="10">
      <van-grid-item
        class="grid-item"
        v-for="(channel, index) in userChannels"
        :key="channel.id"
        @click="onUserChannelClick(channel, index)"
      >
        <!--
          v-bind:class 语法
          一个对象，对象中的 key 表示要作用的 css 类名
                  对象中的 value 要计算出布尔值
                    true，则作用该类名
                    false，不作用类名
          -->
        <van-icon
          v-show="isEdit && !fiexChannels.includes(channel.id)"
          slot="icon"
          name="clear"
        ></van-icon>
        <span class="text" :class="{ active: index === active }" slot="text">
          {{ channel.name }}
        </span>
      </van-grid-item>
    </van-grid>

    <!-- 频道推荐 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">频道推荐</div>
    </van-cell>
    <van-grid class="recommend-grid" :gutter="10">
      <van-grid-item
        class="grid-item"
        v-for="(channel, index) in recommendChannels"
        :key="index"
        icon="plus"
        :text="channel.name"
        @click="onAddChannel(channel)"
      />
    </van-grid>
  </div>
</template>

<script>
import {
  getAllChannels,
  addUserChannel,
  deleteUserChannel
} from '@/api/channel.js'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage.js'

export default {
  name: 'ChannelEdit',
  props: {
    userChannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      allChannels: [], // 所有频道数据列表
      isEdit: false, // 控制编辑状态的显示
      fiexChannels: [0] // 固定频道，不允许删除
    }
  },
  computed: {
    ...mapState(['user']),
    // 推荐的频道模块
    // 计算属性会观测内部依赖数据的变化而重新求值
    recommendChannels() {
      // 思路：所有频道 - 我的频道 = 剩下的推荐频道
      // filter 方法：过滤数据，根据方法返回的布尔值 true 来收集数据
      // filter 方法查找满足条件的所有元素
      return this.allChannels.filter(channel => {
        // 判断 channel 是否属于用户频道
        // find 方法查找满足条件的单个元素
        return !this.userChannels.find(userChannel => {
          // 找到满足该条件的元素
          return userChannel.id === channel.id
        })
      })

      // const arr = []
      // // 遍历所有频道
      // this.allChannels.forEach(channel => {
      //   let flag = false
      //   for (let i = 0; i < this.userChannels.length; i++) {
      //     if (this.userChannels[i].id === channel.id) {
      //       // 所有频道中的频道项属于用户频道
      //       flag = true
      //       break
      //     }
      //   }
      //   if (!flag) {
      //     arr.push(channel)
      //   }
      // })
      // return arr
    }
  },
  created() {
    this.loadAllChannels()
  },
  methods: {
    async loadAllChannels() {
      try {
        const { data } = await getAllChannels()
        this.allChannels = data.data.channels
      } catch (err) {
        this.$toast('获取所有频道数据失败')
      }
    },
    async onAddChannel(channel) {
      this.userChannels.push(channel)

      // TODO : 数据持久化
      if (this.user) {
        // 登陆了，数据存储到线上
        await addUserChannel([
          {
            id: channel.id,
            seq: this.userChannels.length
          }
        ])
      } else {
        // 没有登录，数据存储到本地
        setItem('user-channels', this.userChannels)
      }
    },
    onUserChannelClick(channel, index) {
      if (this.isEdit) {
        // 编辑状态，执行删除操作
        // 如果是固定频道，则不删除
        if (channel.name === '推荐') {
          return
        }
        // 如果删除的是当前激活频道之前的频道，则更新激活的频道项
        // 参数1：要删除的元素的开始索引（包括）
        // 参数2：删除的个数，如果不指定，则从参数1开始一直删除到最后
        if (index <= this.active) {
          // 让激活频道的索引 -1
          this.$emit('update-active', this.active - 1)
        }
        // 删除频道项
        this.userChannels.splice(index, 1)

        // 处理持久化
        this.deleteChannel(channel)
      } else {
        // 非编辑状态，执行切换操作
        this.$emit('update-active', index)
        this.$emit('close')
      }
    },
    async deleteChannel(channel) {
      // TODO : 数据持久化
      if (this.user) {
        // 登陆了，持久化到线上
        await deleteUserChannel(channel.id)
      } else {
        // 没有登录，持久化到本地
        setItem('user-channels', this.userChannels)
      }
    }
  }
}
</script>

<style scoped lang="less">
.channel-edit {
  padding: 85px 0;

  .title-text {
    font-size: 32px;
    color: #333333;
  }

  .edit-btn {
    width: 104px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
    border: 1px solid #f85959;
  }

  /deep/ .grid-item {
    width: 160px;
    height: 86px;
    .van-grid-item__content {
      white-space: nowrap;
      background-color: #f5f5f6;
      .van-grid-item__text,
      .text {
        color: #222222;
        font-size: 28px;
        margin-top: 0;
      }
      .active {
        color: red;
      }
      .van-grid-item__icon-wrapper {
        position: unset;
      }
    }
  }

  /deep/ .my-grid {
    .grid-item {
      .van-icon-clear {
        position: absolute;
        right: -10px;
        top: -10px;
        font-size: 30px;
        color: #cacaca;
        z-index: 2;
      }
    }
  }

  /deep/ .recommend-grid {
    .grid-item {
      .van-grid-item__content {
        flex-direction: row;
        .van-icon-plus {
          font-size: 28px;
          margin-right: 6px;
        }
      }
    }
  }
}
</style>
