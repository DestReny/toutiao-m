/*
  频道相关请求模块
*/

import request from '@/utils/request.js'

/*
  获取所有频道列表
*/
export const getAllChannels = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/channels'
  })
}

/*
  批量修改用户频道列表（部分覆盖）
*/
export const addUserChannel = channels => {
  return request({
    method: 'PATCH',
    url: '/app/v1_0/user/channels',
    data: {
      channels
    }
  })
}

/*
  删除指定的频道
*/
export const deleteUserChannel = channelId => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/user/channels/${channelId}`
  })
}
