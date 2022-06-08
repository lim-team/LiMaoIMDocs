---
title: 已有服务端集成通讯端
order: 20000
toc: menu
group:
  title: 我是服务端开发者
---


## 说明

已有服务端集成通讯端，有些业务场景只需要狸猫IM的通讯能力，不需要聊天软件的一些复杂功能，比如物联网设备通讯，RTC的信令服务器和一些APP的推送服务等
这些服务只需要部署通讯端，服务端通过通讯端的api发送消息 客户端通过狸猫sdk接收消息即可，已有服务端与通讯端和客户端sdk的交互流程如下：

![服务端交互流程](./flow.png)


## 部署通讯端

### 说明

通讯端主要负责消息的投递，频道，频道成员，频道设置的维护。（<label style="color:red">注意：通讯端的api，仅已有服务端局域网调用，请不要开放到外网，api默认端口为：18029</label>）

狸猫IM默认都是集群部署，部署架构图如下：

![狸猫IM部署架构](./limaoim.png)



### Docker部署(推荐)


#### Docker安装


[ubuntu](https://docs.docker.com/engine/install/ubuntu/)

[centos](https://docs.docker.com/engine/install/centos/)

[debian](https://docs.docker.com/engine/install/debian/)

[其他系统](https://docs.docker.com/engine/install/)

#### 安装docker-compose

```

# sudo curl -L "https://github.com/docker/compose/releases/download/1.25.4/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
# sudo chmod +x /usr/local/bin/docker-compose

```

#### 单机部署

新建文件 docker-compose.yaml 复制如下内容

```yaml
version: '3.7'
services:
  limao1:
    image: limaoim/limaoim:latest
    restart: always
    hostname: limaoim
    networks:
      - "limao"
    volumes:
      - ./limaodata:/home/limaodata
    environment:
      appID: limaodemo  # 测试使用，正式的请找官方购买
      appKey: 8sTRZCZgPV2v6QZG # 测试使用，正式的请找官方购买
      dataDir: "/home/limaodata" # 数据目录
      mode: "debug" # 模式 debug 测试 release 正式 bench 压力测试
      externalIP: "" #  外网IP 如果没配置将通过ifconfig.io获取,如果通过ifconfig.io获取注意当前机器是否能访问到ifconfig.io
      # webhook: "http://xxxx/v2/webhook" # webhook 见webhook章节
      # datasource: "http://xxxx/v1/datasource" # 数据源 见数据源章节 （非必需）
    ports:
      - 7677:7677  # tcp连接端口
      - 2122:2122  # websocket连接端口
      - 1516:1516  # 内部api地址
networks:
  limao:

```

#### 分布式部署

1. 新建文件 docker-compose.yaml

2. 复制以下内容到新建的docker-compose.yaml内 （以下yaml仅做为测试，正式环境建议将节点部署在不同物理机上）


```yaml

version: '3.7'
services:
  proxy:
    image: limaoim/limaoim:latest
    restart: always
    command: "proxy"
    hostname: proxy
    networks:
      - "limao"
    ports:
      - 18029:18029 # api端口，局域网开放，慎开放到外网访问
    volumes:
        - ./proxydata:/home/proxydata
    environment:
      replica: 0 # 副本数量
  limao1: # 节点1
    image: limaoim/limaoim:latest
    restart: always
    hostname: limaoim
    volumes:
      - ./limaodata-1:/home/limaodata-1
    environment:
      nodeID: 1   # 节点编号 范围 1-1024
      appID: limaodemo  # 测试使用，正式的请找官方购买
      appKey: 8sTRZCZgPV2v6QZG # 测试使用，正式的请找官方购买
      mode: "debug"  # 模式 debug 测试 release 正式 bench 压力测试
      externalIP: "" #  外网IP 如果没配置将通过ifconfig.io获取,如果通过ifconfig.io获取注意当前机器是否能访问到ifconfig.io
      proxy: "proxy:16666"
      nodeRaftAddr: "limao1:6000"
      nodeRPCAddr: "limao1:6001"
      nodeAPIAddr: "http://limao1:1516"
      addr: "tcp://0.0.0.0:7676"
      wsAddr: "0.0.0.0:2121"
      webhook: "http://xxxx/v2/webhook" # webhook 见webhook章节
      datasource: "http://xxxx/v1/datasource" # 数据源 见数据源章节 （非必需）
      monitorOn: 0
    ports:
      - 7676:7676  # tcp连接端口
      - 2121:2121  # websocket连接端口
  limao2: # 节点2
    image: limaoim/limaoim:latest
    restart: always
    hostname: limaoim
    networks:
      - "limao"
    volumes:
      - ./limaodata-2:/home/limaodata-2
    environment:
      nodeID: 2   # 节点编号 范围 1-1024
      appID: limaodemo  # 测试使用，正式的请找官方购买
      appKey: 8sTRZCZgPV2v6QZG # 测试使用，正式的请找官方购买
      mode: "debug"  # 模式 debug 测试 release 正式 bench 压力测试
      proxy: "proxy:16666"
      nodeRaftAddr: "limao2:6000"
      nodeRPCAddr: "limao2:6001"
      nodeAPIAddr: "http://limao2:1516"
      addr: "tcp://0.0.0.0:7677"
      wsAddr: "0.0.0.0:2122"
      webhook: "http://xxxx/v2/webhook" # webhook 见webhook章节
      datasource: "http://xxxx/v1/datasource" # 数据源 见数据源章节 （非必需）
      monitorOn: 0
    ports:
      - 7677:7677  # tcp连接端口
      - 2122:2122  # websocket连接端口
networks:
  limao:    

```

3. 打开 http://IP:18029/cluster 返回类似如下内容，slot_state和state都为1 则表示集群就绪 

```json

[
    {
        vaild_count: 128,
        vaild_slots: "0-127",
        version: 18,
        slot_count: 256,
        cluster_id: 1,  // 这里状态需要为 1
        state: 1,
        slots: "/////////////z8AAAAAAAAAAAAAAAAAAAAAAAAAAAA=",
        nodes: [
            {
            node_id: 2,
            node_raft_addr: "limao2:6000",
            node_api_addr: "http://limao2:1516",
            node_rpc_addr: "limao2:6001",
            tcp_addr: "xx.xxx.xxx.xx:7677",
            ws_addr: "xx.xxx.xxx.xx:2122"
            }
        ],
        leader_id: 2,
        slot_state: 1  // 这里状态需要为 1
    },
    {
        vaild_count: 128,
        vaild_slots: "128-256",
        version: 17,
        slot_count: 256,
        cluster_id: 2,
        state: 1,  // 这里状态需要为 1
        slots: "AAAAAAAAAAAAAAAAAAAAAP////////////8fAAAAAAA=",
        nodes: [
            {
                node_id: 1,
                node_raft_addr: "limao1:6000",
                node_api_addr: "http://limao1:1516",
                node_rpc_addr: "limao1:6001",
                tcp_addr: "xx.xxx.xxx.xx:7676",
                ws_addr: "xx.xxx.xxx.xx:2121"
            }
        ],
        leader_id: 1,
        slot_state: 1  // 这里状态需要为 1
    },
]

```

### 二进制部署

#### 单机

```
# ./limaoim -e appID=limaodemo -e appKey=xxxx -e mode=debug
```

### 分布式


节点初始化

```
// 开启proxy服务
# ./limaoim proxy -c ./configs/proxy.toml  -e replica=1
```


```
// 初始化的节点启动
# ./limaoim -e proxy=xx.xx.xx.xx:16666 -e nodeID=1001 -e nodeRaftAddr=127.0.0.1:6666
```

```
// 初始化的节点启动
# ./limaoim  -e proxy=xx.xx.xx.xx:16666 -e nodeID=1002 -e nodeRaftAddr=127.0.0.1:6667
```

增加节点

```
# ./limaoim  -e proxy=xx.xx.xx.xx:16666 -e nodeID=1003 -join
```

移除节点

```
# ./limaoim -e nodeID=1003 -remove
```


### 配置说明

参数 | 说明 | 适用
---|--- |---
appID | 应用ID（向官方申请） | 所有
appKey | 应用key（向官方申请） | 所有
addr | tcp监听地址 默认：tcp://0.0.0.0:7677 | 所有
wsAddr | websocket监听地址 默认：0.0.0.0:2122 | 所有
httpAddr | http api的监听地址 默认为 0.0.0.0:1516 | 所有
dataDir | 数据保存目录 | 所有
monitorOn | 监控开关 0.关闭 1.开启 | 所有
datasource | 数据源地址用户对接第三方系统，见数据源章节 | 所有
webhook | webhook 通过此地址通知数据给第三方 格式为 http://xxxxx | 所有
webhook_grpc | webhook的grpc地址 如果此地址有值 则不会再调用webhook配置的地址，将走grpc模式通知第三方,格式为 ip:port | 所有
messageNotifyMaxCount | 每次webhook推送消息数量限制 默认一次请求最多推送100条 | 所有
messageNotifyScanInterval | 消息推送间隔 默认500毫秒发起一次推送 | 所有
maxMessagePerSecond | 服务器每秒最大消息处理数量 默认为100000，限流 | 所有
conversationOfUserMaxCount | 每个用户最大最近会话数量 默认为500 | 所有
wssOn | 是否开启websocket的wss 1.开启 0. 关闭 默认为0 | 所有
wssCertificate | websocket的ssl证书的路径 （开启ssl必须要配置）| 所有
wssCertificateKey | websocket的ssl证书key的路径 （开启ssl必须要配置） | 所有
externalIP | 外网IP 如果没配置将通过ifconfig.io获取，没配置请确定本机能访问到ifconfig.io | 所有
mode | 模式 debug 测试 release 正式 bench 压力测试 | 所有
segmentMaxBytes | 每个消息数据日志段的最大大小 默认为20G | 所有
eventPoolSize |  事件协程池大小,此池主要处理im的一些通知事件 比如webhook，上下线等等 默认为10240| 所有
messagePoolSize | 消息协程池大小，此池的协程主要用来处理消息相关的逻辑 默认大小为 102400 | 所有
deliveryMsgPoolSize | 投递消息协程池大小，此池的协程主要用来将消息投递给在线用户 默认大小为 102400 | 所有
nodeID | 节点的唯一ID（1-1024之间） | 分布式
proxy |proxy服务器通讯地址 格式：ip:port 如果配置了此参数将开启分布式 | 分布式
nodeRaftAddr |分布式集群节点选举通信地址 IP:PORT 比如：127.0.0.1:6000 默认系统自动填充 | 分布式
nodeRaftAddrReal | 节点之间能通信的真实局域网地址 比如：192.168.1.12:6000，在docker环境下nodeRaftAddr获取的地址可能不是真正的局域网地址，可以通过nodeRaftAddrReal指定真正内网通信地址 默认系统自动填充 | 分布式
nodeAPIAddr | 节点间调用的API地址 例如: http://127.0.0.1:1516 默认系统自动填充 | 分布式
nodeRPCAddr | 节点grpc通讯地址，主要用来转发消息 (监听地址) 例如： 127.0.0.1:6001 默认系统自动填充 | 分布式
nodeRPCAddrReal | 真实的rpc通信地址，节点之间能访问到（局域网地址）默认系统自动填充 | 分布式
nodeTCPAddr | 节点的TCP地址 对外公开，提供给APP端长连接通讯  格式： ip:port，默认系统自动填充 | 分布式
nodeWSAddr | 节点的wsAdd地址 对外公开 提供给WEB端长连接通讯 格式： ip:port ，默认系统自动填充| 分布式
slotCount |  slot（数据分区）数量 默认为256 谨慎更改 | 分布式

### webhook

狸猫IM的一些数据将通过webhook的形式回调给第三方应用，比如用户在线状态，需要推送的消息，所有消息等等，所有webhook都是POST请求，事件名通过query参数传入，
比如 第三方的服务器提供的webhook地址为 http://example/webhook 那么在线状态的webhook为

```
http://example/webhook?event=user.onlinestatus

body的数据类似为： [uid1-0-1,uid2-1-0]

```
以下为具体webhook详情

**用户在线状态**

每个用户的上线和下线都会通过此webhook通知给第三方服务器

事件名：user.onlinestatus

事件数据：[用户ID-设备标识-在线状态]  例如 [uid1-1-0,uid2-1-1]

数据说明：  设备标识 0.为app 1.为web端  在线状态 0.离线 1.在线

**离线消息通知**

离线消息通知主要是将需要通过离线推送的消息通知给第三方服务器，第三方服务器收到此webhook后需要将此消息内容调用手机厂商推送接口，将消息推给ToUIDs列表的用户

事件名：msg.offline

事件数据：消息数组

```go

type MessageResp struct {
	Header       MessageHeader `json:"header"`        // 消息头
	Setting      uint8         `json:"setting"`       // 设置
	MessageID    int64         `json:"message_id"`    // 服务端的消息ID(全局唯一)
	MessageIDStr string        `json:"message_idstr"` // 服务端的消息ID(全局唯一)
	ClientMsgNo  string        `json:"client_msg_no"` // 客户端消息唯一编号
	MessageSeq   uint32        `json:"message_seq"`   // 消息序列号 （用户唯一，有序递增）
	FromUID      string        `json:"from_uid"`      // 发送者UID
	ChannelID    string        `json:"channel_id"`    // 频道ID
	ChannelType  uint8         `json:"channel_type"`  // 频道类型
	Timestamp    int32         `json:"timestamp"`     // 服务器消息时间戳(10位，到秒)
	Payload      []byte        `json:"payload"`       // base64消息内容
    ToUIDs       []string      `json:"to_uids"`       // 接收用户列表
}

```

**所有消息**

狸猫IM会将所有消息推送给第三方服务器（为了降低第三方服务器的压力，并不是一条一条推送，做了延迟处理，默认是500毫秒批量推送一次，这个可自己视情况配置），第三方服务器可视情况保存或不保存（有一些业务需要保存，比如将消息存入ElasticSearch，给客户端做搜索使用）不管保不保存，狸猫IM通讯端都会保存用户的消息。

事件名：msg.notify

数据说明：  消息数组

```go

type MessageResp struct {
	Header       MessageHeader `json:"header"`        // 消息头
	Setting      uint8         `json:"setting"`       // 设置
	MessageID    int64         `json:"message_id"`    // 服务端的消息ID(全局唯一)
	MessageIDStr string        `json:"message_idstr"` // 服务端的消息ID(全局唯一)
	ClientMsgNo  string        `json:"client_msg_no"` // 客户端消息唯一编号
	MessageSeq   uint32        `json:"message_seq"`   // 消息序列号 （用户唯一，有序递增）
	FromUID      string        `json:"from_uid"`      // 发送者UID
	ChannelID    string        `json:"channel_id"`    // 频道ID
	ChannelType  uint8         `json:"channel_type"`  // 频道类型
	Timestamp    int32         `json:"timestamp"`     // 服务器消息时间戳(10位，到秒)
	Payload      []byte        `json:"payload"`       // base64消息内容
}

```

### 数据源

数据解决的问题主要是一些现有系统里已有群成员和一些其他数据，需要无缝对接到狸猫IM通讯里，那么就可以通过数据源的形式对接

狸猫IM会调用 datasource配置的api地址，通过POST的方式进行请求

请求数据格式如下：

```json

{
    "cmd":"xxx", // 请求指令
    "data": {} // 请求参数
}

```

详情如下：

**获取订阅者(群成员)**

当狸猫IM通讯端需要获取订阅者列表的时候就会调用此cmd进行获取

请求参数

```json

{
    "cmd":"getSubscribers",
    "data": {
        "channel_id":"xxx", // 频道ID（群ID）
        "channel_type": 2 // 默认为2 2表示群聊
    }
}

```

返回结果

```json
[uid1,uid2,...] // 当前频道的成员用户id列表
```

**获取黑名单**

如果不允许频道成员内某个人收不到消息，可以返回黑名单


请求参数

```json

{
    "cmd":"getBlacklist",
    "data": {
        "channel_id":"xxx", // 频道ID（群ID）
        "channel_type": 1 // 频道类型 1.单聊 2.群聊 
    }
}

```

返回结果

```json
[uid1,uid2,...] // 黑明单成员用户id集合
```


**获取白名单**

如果只允许频道内某些人收到消息，则返回收到消息的成员用户id列表。
比如实现群禁言，那么可以返回群主和管理员的uid，这样其他群成员将无法发送消息，只有群主和管理能发送消息
比如实现只有好友才能发送消息，那么返回用户的好友列表则不是好友将无法发送消息



请求参数

```json

{
    "cmd":"getWhitelist",
    "data": {
        "channel_id":"xxx", // 频道ID（群ID）
        "channel_type": 1 // 频道类型 1.单聊 2.群聊 
    }
}

```

返回结果

```json
[uid1,uid2,...] // 白名单成员用户id集合
```


**获系统账号**

系统账号不受黑名单白名单限制，而且系统账号不在某个频道内也可以发送消息，也就是对发送消息无如何限制


请求参数

```json

{
    "cmd":"getSystemUIDs"
}

```

返回结果

```json
[uid1,uid2,...] // 系统账号用户id集合
```


### 通讯端API文档

[通讯端API](/server/sdkapi.html)
