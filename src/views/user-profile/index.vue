<template>
  <div class="user-profile">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      title="个人信息"
      left-arrow
      @click-left="$router.back()"
    />
    <!-- /导航栏 -->

    <!-- 个人信息 -->
    <van-cell title="头像">
      <van-image class="avatar" fit="cover" round :src="user.photo" />
    </van-cell>
    <van-cell
      title="昵称"
      :value="user.name"
      is-link
      @click="isUserNameShow = true"
    />
    <van-cell title="性别" :value="user.gender === 0 ? '男' : '女'" is-link />
    <van-cell title="生日" :value="user.birthday" is-link />
    <!-- /个人信息 -->

    <!-- 编辑昵称 -->
    <van-popup v-model="isUserNameShow" style="height: 100%" position="bottom">
      <update-name
        v-if="isUserNameShow"
        v-model="user.name"
        @close="isUserNameShow = false"
      />
    </van-popup>
    <!-- /编辑昵称 -->
  </div>
</template>

<script>
import { getUserProfile } from '@/api/user.js'
import UpdateName from './components/update-name.vue'

export default {
  name: 'UserProfile',
  components: {
    UpdateName
  },
  props: {},
  data() {
    return {
      user: {}, // 个人信息
      isUserNameShow: false
    }
  },
  created() {
    this.loadUserProfile()
  },
  methods: {
    async loadUserProfile() {
      try {
        const { data } = await getUserProfile()
        this.user = data.data
      } catch (err) {
        this.$toast('数据获取失败')
      }
    }
  }
}
</script>

<style scoped lang="less">
.user-profile {
  .avatar {
    width: 60px;
    height: 60px;
  }

  .van-popup {
    background-color: #f5f7f9;
  }
}
</style>
