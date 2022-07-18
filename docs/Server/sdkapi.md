---
title: 狸猫IM通讯端API
order: 40000
toc: menu
group:
  title: 我是服务端开发者
---

## 基础API

### 连接地址获取

获取客户端连接狸猫IM的地址

GET /route?uid=xxxx // uid为用户的唯一ID


返回数据：

http status 200

```json
{
  "tcp_addr": "xx.xx.xx.xxx:xx", // tcp连接地址
  "ws_addr": "xx.xx.xx.xxx:xx" // websocket连接地址
}

```

### 批量获取连接地址

获取一批用户的连接地址

POST /route/batch

请求参数:

```json

[uid123,uid32323,....] // 用户uid集合

```

返回数据：

http status 200

```json

[
    {
        "tcp_addr": "IP:PORT", // tcp连接地址
        "ws_addr": "IP:PORT", // websocket连接地址
        "uids":[], // 用户id集合
       
    },
    {
        "tcp_addr": "IP:PORT", // tcp连接地址
        "ws_addr": "IP:PORT", // websocket连接地址
        "uids":[], // 用户id集合
       
    },
    ...
]


```


## 用户相关API

### 注册或更新用户

将用户信息注册到狸猫IM通讯端，如果存在则更新

POST /user/token

请求参数:

```json
{
  "uid": "xxxx",         // 已有服务端的用户唯一uid
  "token": "xxxxx",      // 已有服务端的用户的token
  "device_flag": 0,      // 设备标识  0.app 1.web （相同用户相同设备标记的主设备登录会互相踢，从设备将共存）
  "device_level": 1      // 设备等级 0.为从设备 1.为主设备
}

```

返回数据：

http status 200

```json
{
  "status": 200 // 200为成功，其他为错误
}

```


### 用户在线状态

将用户信息注册到狸猫IM通讯端，如果存在则更新

POST /user/onlinestatus

请求参数:

```json
 [uid123,uid345,uid456...] // 需要查询在线状态的用户uid列表

```

返回数据：

http status 200

```json
[uid123,uid456...] // 返回在线的用户uid集合
```


### 添加系统账号
系统账号将有发送消息的全部权限，不受黑名单限制，无需在订阅列表里，比如“系统通知”，“客服”等这种类似账号可以设置系统账号

POST /systemuids_add

请求参数:

```json
{
    "uids": [uid123,uid345,uid456...] // 需要加入系统账号的用户uid集合列表
} 

```

返回数据：

http status 200

```json
{
  "status": 200 // 200为成功，其他为错误
}

```



### 移除系统账号

将系统账号移除

POST /systemuids_remove

请求参数:

```json
{
    "uids": [uid123,uid345,uid456...] // 系统账号的用户uid集合列表
}
```

返回数据：

http status 200

```json
{
  "status": 200 // 200为成功，其他为错误
}

```

## 频道相关API

[什么是频道？](/unifying.html#什么是频道channel)

### 创建或更新频道

创建一个频道，如果系统中存在则更新

POST /channel

请求参数:

```json
{
   "channel_id": "xxxx", // 频道的唯一ID
   "channel_type": 2, // 频道的类型 1.个人频道 2.群聊频道
   "subscribers": [uid1,uid2,...], // 订阅者集合
}
```

返回数据：

http status 200

```json
{
  "status": 200 // 200为成功，其他为错误
}

```

### 添加订阅者

向一个已存在的频道内添加订阅者


POST /channel/subscriber_add

请求参数:

```json
{
   "channel_id": "xxxx", // 频道的唯一ID
   "channel_type": 2, // 频道的类型 1.个人频道 2.群聊频道
   "reset": 0,        // // 是否重置订阅者 （0.不重置 1.重置），选择重置，将删除原来的所有成员或者将追加订阅者
   "subscribers": [uid1,uid2,...], // 订阅者集合
}
```

返回数据：

http status 200

```json
{
  "status": 200 // 200为成功，其他为错误
}

```


### 移除订阅者

向一个已存在的频道内移除订阅者


POST /channel/subscriber_remove

请求参数:

```json
{
   "channel_id": "xxxx", // 频道的唯一ID
   "channel_type": 2, // 频道的类型 1.个人频道 2.群聊频道
   "subscribers": [uid1,uid2,...], // 订阅者集合
}
```

返回数据：

http status 200

```json
{
  "status": 200 // 200为成功，其他为错误
}

```


### 添加黑名单

将某个用户添加到频道黑名单内，在频道黑名单内的用户将不能在此频道发送消息，可以通过此接口实现，群拉黑群成员的功能


POST /channel/blacklist_add

请求参数:

```json
{
   "channel_id": "xxxx", // 频道的唯一ID
   "channel_type": 2, // 频道的类型 1.个人频道 2.群聊频道
   "uids": [uid1,uid2,...], // 要拉黑的用户uid集合
}
```

返回数据：

http status 200

```json
{
  "status": 200 // 200为成功，其他为错误
}

```


### 移除黑名单



POST /channel/blacklist_remove

请求参数:

```json
{
   "channel_id": "xxxx", // 频道的唯一ID
   "channel_type": 2, // 频道的类型 1.个人频道 2.群聊频道
   "uids": [uid1,uid2,...], // 用户uid集合
}
```

返回数据：

http status 200

```json
{
  "status": 200 // 200为成功，其他为错误
}

```



### 设置黑名单

设置黑名单（覆盖原来的黑名单数据）


POST /channel/blacklist_set

请求参数:

```json
{
   "channel_id": "xxxx", // 频道的唯一ID
   "channel_type": 2, // 频道的类型 1.个人频道 2.群聊频道
   "uids": [uid1,uid2,...], // 用户uid集合
}
```

返回数据：

http status 200

```json
{
  "status": 200 // 200为成功，其他为错误
}

```

### 添加白名单

如果设置了白名单，则只允许白名单内的订阅者发送消息。可以通过白名单机制实现“群禁言功能”。


POST /channel/whitelist_add

请求参数:

```json
{
   "channel_id": "xxxx", // 频道的唯一ID
   "channel_type": 2, // 频道的类型 1.个人频道 2.群聊频道
   "uids": [uid1,uid2,...], // 用户uid集合
}
```

返回数据：

http status 200

```json
{
  "status": 200 // 200为成功，其他为错误
}

```


### 移除白名单


将用户从频道白名单内移除

POST /channel/whitelist_remove

请求参数:

```json
{
   "channel_id": "xxxx", // 频道的唯一ID
   "channel_type": 2, // 频道的类型 1.个人频道 2.群聊频道
   "uids": [uid1,uid2,...], // 用户uid集合
}
```

返回数据：

http status 200

```json
{
  "status": 200 // 200为成功，其他为错误
}

```


### 设置白名单

设置白名单（覆盖原来的白名单数据）


POST /channel/whitelist_set

请求参数:

```json
{
   "channel_id": "xxxx", // 频道的唯一ID
   "channel_type": 2, // 频道的类型 1.个人频道 2.群聊频道
   "uids": [uid1,uid2,...], // 用户uid集合
}
```

返回数据：

http status 200

```json
{
  "status": 200 // 200为成功，其他为错误
}

```

## 消息相关API

### 发送消息

服务端调用发送消息接口可以主要用来发送系统类的消息，比如群成员进群通知，消息撤回通知等等

POST /message/send

请求参数:

```json
{
  "header": { // 消息头
      "no_persist": 0, // 是否不存储消息 0.存储 1.不存储
      "red_dot": 1, // 是否显示红点计数，0.不显示 1.显示
      "sync_once": 0, // 是否是写扩散，这里一般是0，只有cmd消息才是1 
  },
  "from_uid": "xxxx", // 发送者uid
  "channel_id": "xxxx", // 接收频道ID 如果channel_type=1 channel_id为个人uid 如果channel_type=2 channel_id为群id
  "channel_type": 2, // 接收频道类型  1.个人频道 2.群聊频道
  "payload": "xxxxx", // 消息内容，base64编码
  "subscribers": [uid123,uid234,...] // 订阅者 如果此字段有值，表示消息只发给指定的订阅者,没有值则发给频道内所有订阅者
}
```

返回数据：

http status 200

```json
{
  "status": 200 // 200为成功，其他为错误
}

```


### 批量发送消息

批量发送消息，可以用于后端发送全局通知之类的消息，需要通知到全部用户的消息，可以每次指定一批（通过subscribers指定）接收用户，分批推送。

POST /message/sendbatch

请求参数:

```json
{
  "header": { // 消息头
      "no_persist": 0, // 是否不存储消息 0.存储 1.不存储
      "red_dot": 1, // 是否显示红点计数，0.不显示 1.显示
      "sync_once": 0, // 是否是写扩散，这里一般是0，只有cmd消息才是1 
  },
  "from_uid": "xxxx", // 发送者uid
  "payload": "xxxxx", // 消息内容，base64编码
  "subscribers": [uid123,uid234,...] // 接收者的uid，分批指定，每次建议 1000-10000之间，视系统情况而定
}
```

返回数据：

http status 200

```json
{
  "fail_uids": [uid123,uid234,...], // 返回发送失败的用户列表
  "reason": ["发送失败","不存在用户",...], // 发送失败用户列表对应的失败原因列表，与fail_uids一一对应
}

```

### 同步某频道消息

同步某个频道的消息列表


POST /channel/messagesync

请求参数:

```json
{
  "login_uid": "xxxx", // 当前登录用户uid
  "channel_id": "xxxx", //  频道ID
  "channel_type": 2, // 频道类型
  "min_message_seq": 0, // 最小序列号
  "max_message_seq": 0, // 最大序号
  "limit": 100, // 消息数量限制
  "reverse":   // 是否反转查询 true: 上拉 messageSeq从小到大 false: 下拉 messageSeq从大到小 比如 reverse=true min_message_seq=0,max_message_seq=10,limit=5 则获取到的消息 为 1,2,3,4,5 reverse=false 则获取到的结果为 5,6,7,8,9
}
```

返回数据：

http status 200

```json

{
    "min_message_seq": 0, // 查询的min_message_seq
    "max_message_seq": 0, // 查询的max_message_seq
    "more": 0, // 是否有更多  0.无 1.有
    "messages":[
        {
            "header": { // 消息头
                "no_persist": 0, // 是否不存储消息 0.存储 1.不存储
                "red_dot": 1, // 是否显示红点计数，0.不显示 1.显示
                "sync_once": 0 // 是否是写扩散，这里一般是0，只有cmd消息才是1 
            },
            "setting": 0, // 消息设置 消息设置是一个 uint8的数字类型 为1个字节，完全由第三方自定义 比如定义第8位为已读未读回执标记，开启则为0000 0001 = 1
            "message_id": 122323343445, // 消息全局唯一ID
            "client_msg_no": "xxxxx", // 客户端消息编号，可用此字段去重
            "message_seq": 1, // 消息序列号 （用户唯一，有序递增）
            "from_uid": "xxxx", // 发送者用户id
            "channel_id": "xxxx", // 频道ID
            "channel_type": 2, // 频道类型 1.个人频道 2.群频道
            "timestamp": 1223434512, // 消息10位到秒的时间戳
            "payload": "xxxx", // base64编码的消息内容 
        },
    ]
}



```



### 同步离线消息（写扩散）

 同步离线消息，一般使用来同步cmd消息，如果消息header.sync_once 设置为 1 则离线消息就会走此接口，否则走读扩散模式（<label style="color:red">建议只有CMD消息才走写扩散</label>）

POST /message/sync

请求参数:

```json
{
  "uid": "xxxx", // 当前登录用户uid
  "limit": 100 //  消息数量限制
}
```

返回数据：

http status 200

```json

[
    {
        "header": { // 消息头
            "no_persist": 0, // 是否不存储消息 0.存储 1.不存储
            "red_dot": 1, // 是否显示红点计数，0.不显示 1.显示
            "sync_once": 0 // 是否是写扩散，这里一般是0，只有cmd消息才是1 
        },
        "setting": 0, // 消息设置 消息设置是一个 uint8的数字类型 为1个字节，完全由第三方自定义 比如定义第8位为已读未读回执标记，开启则为0000 0001 = 1
        "message_id": 122323343445, // 消息全局唯一ID
        "client_msg_no": "xxxxx", // 客户端消息编号，可用此字段去重
        "message_seq": 1, // 消息序列号 （用户唯一，有序递增）
        "from_uid": "xxxx", // 发送者用户id
        "channel_id": "xxxx", // 频道ID
        "channel_type": 2, // 频道类型 1.个人频道 2.群频道
        "timestamp": 1223434512, // 消息10位到秒的时间戳
        "payload": "xxxx", // base64编码的消息内容 
    },
]

```

### 回执离线消息（写扩散）

当客户端获取完离线消息后，需要调用此接口做回执，告诉通讯端离线消息已获取完毕

POST /message/syncack


请求参数:

```json
{
  "uid": "xxxx", // 当前登录用户uid
  "last_message_seq": 1234 //  获取离线消息的最大的一个消息序号
}
```

返回数据：

http status 200

```json

{
    "status": 200,
}

```



## 最近会话

### 同步最近会话

客户端离线后每次进来需要同步一次最近会话（包含离线的最新的消息）

POST /conversation/sync


请求参数:

```json
{
  "uid": "xxxx", // 当前登录用户uid
  "version": 1234, //  当前客户端的会话最大版本号(如果本地没有数据则传0)
  "last_msg_seqs": "xxx:2:123|xxx:1:3434", //   客户端所有频道会话的最后一条消息序列号拼接出来的同步串 格式： channelID:channelType:last_msg_seq|channelID:channelType:last_msg_seq
  "msg_count": 20 // 每个会话获取最大的消息数量，一般为app点进去第一屏的数据
}
```

返回数据：

http status 200

```json

[
  {
    "channel_id": "xxxx", // 频道ID
    "channel_type": 2, // 频道类型
    "unread": 1, // 消息未读数量
    "timestamp": 4523485721, // 10位到秒的时间戳
    "last_msg_seq": 0, // 最后一条消息的message_seq
    "last_client_msg_no": "xxxx", // 最后一条消息的客户端编号
    "version": 123, // 数据版本编号
    "recents":[  // 最近N条消息
        {
            "header": { // 消息头
                "no_persist": 0, // 是否不存储消息 0.存储 1.不存储
                "red_dot": 1, // 是否显示红点计数，0.不显示 1.显示
                "sync_once": 0 // 是否是写扩散，这里一般是0，只有cmd消息才是1 
            },
            "setting": 0, // 消息设置 消息设置是一个 uint8的数字类型 为1个字节，完全由第三方自定义 比如定义第8位为已读未读回执标记，开启则为0000 0001 = 1
            "message_id": 122323343445, // 消息全局唯一ID
            "client_msg_no": "xxxxx", // 客户端消息编号，可用此字段去重
            "message_seq": 1, // 消息序列号 （用户唯一，有序递增）
            "from_uid": "xxxx", // 发送者用户id
            "channel_id": "xxxx", // 频道ID
            "channel_type": 2, // 频道类型 1.个人频道 2.群频道
            "timestamp": 1223434512, // 消息10位到秒的时间戳
            "payload": "xxxx", // base64编码的消息内容 
        },
    ]
  }
]

```

### 设置最近会话未读数量

设置某个频道的最近会话未读消息数量
 
POST /conversations/setUnread


请求参数:

```json
{
  "uid": "xxxx", // 当前登录用户uid
  "channel_id": "xxxx", // 频道ID
  "channel_type": 1, // 频道类型
  "unread": 0 // 未读消息数量
}
```

返回数据：

http status 200

```json

{
    "status": 200 // 成功
}

```

### 删除最近会话


删除某个频道的最近会话
 
POST /conversations/delete


请求参数:

```json
{
  "uid": "xxxx", // 当前登录用户uid
  "channel_id": "xxxx", // 频道ID
  "channel_type": 1, // 频道类型
}
```

返回数据：

http status 200

```json

{
    "status": 200 // 成功
}

```