---
title: Demo基础上二次开发
order: 40000
toc: menu
group:
  title: 我是服务端开发者
---

## 部署业务端

### docker部署

```yaml
version: '3.7'
services:
  redis:
    image: redis
    restart: always
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 1s
      timeout: 3s
      retries: 30
    volumes:
      - ./redisdata:/data
  mysql:
    container_name: mysql
    image: mysql
    command: --default-authentication-plugin=mysql_native_password
    healthcheck:
      test: ["CMD", "mysqladmin" ,"ping", "-h", "localhost"]
    environment:
      TZ: Asia/Shanghai
      MYSQL_ROOT_PASSWORD: 1u75MhxKQGhomxlE # mysql的密码
      MYSQL_DATABASE: im
    volumes:
      - ./mysqldata:/var/lib/mysql
  # redis-commander: # redis在线查看器
  #   image: rediscommander/redis-commander:latest
  #   restart: always
  #   environment:
  #     - REDIS_HOSTS=local:redis:6379
  #   ports:
  #     - "8088:8081"    
  # adminer:  # mysql在线查看器
  #   container_name: adminer
  #   image: adminer
  #   ports:
  #     - 8036:8080    
  limaoserver:
      image: limaoim/limaoserver:latest
      restart: always
      command: "api"
      healthcheck:
        test: "wget -q -Y off -O /dev/null http://localhost:8080/v1/ping > /dev/null 2>&1"
        interval: 10s
        timeout: 10s
        start_period: 4s
        retries: 3
      depends_on:
       - redis
       - mysql
      environment:
        - BaseURL=http://xxx:8080  # 部署好的api基地址
        - IMURL=http://proxy:18029 # limao im proxy服务器地址（内网地址）或者 单机版 http://limao1:1516
        - RedisAddr=redis:6379  # redis连接地址
        - MinioAccessKeyID=BKIAI0SFMDN97EXAKPLE # minio的key
        - MinioSecretAccessKey=nJalrXUTnFEMK/K7MDENG/bPlRfiCUEXAMnLEKEY # minio的secret
        - UploadURL=http://xxxxx  # 文件上传地址 如果是使用的minio则为minio的地址 http://xxxx:9000
        - FileDownloadURL=http://xxxxx # 文件下载地址 如果是使用的minio则为minio的地址 http://xxxx:9000
        - MySQLAddr=root:1u75MhxKQGhomxlE@tcp(mysql)/im?charset=utf8mb4&parseTime=true&loc=Local # mysql数据库连接地址
        - APNSDev=false ## iOS APNS推送环境  true为测试环境，false为正式环境
        - APNSPassword=xxxx ## iOS APNS 证书的密码
        - APNSTopic=com.limao.im ## iOS APNS的topic
        - WebLoginURL=https://im.limaoim.cn ## web im的登录地址，app显示用
        - AliyunSMS.SignName=xxx  # 阿里云短信的签名名字
        - AliyunSMS.AccessKeyID=xxx # 阿里云短信的aceessKey
        - AliyunSMS.AccessSecret=xxx # 阿里云短信的acessSecret
        - AliyunSMS.TemplateCode=SMS_xxx # 阿里云短信的模版编号
        - Test=false # true为开启测试模式 如果开启测试模式短信验证码默认为123456，测试模式仅在测试的时候开启，正式环境请确保关闭
        - EndToEndEncryptionOn=false # 是否开启端对端加密 
        - GRPCAddr=0.0.0.0:6979 # grpc监听地址，主要给通讯端的webhook调用
        # - APIAddr=http://xxx:1316/v1  # 当前服务的外网api地址，这个主要给压测端使用
      ports:
        - "8080:8080" # api http 端口
        - "1316:1316" # 压力测速api 端口 Test=true有效
        - "1314:1314" # 与压力客户端tcp通讯用
networks:
  default:
    external:
     name: im_limao # 通过docker network ls可找到 limao为后缀的网络名 本例为 im_limao     
```

### 源码调试

运行依赖测试环境

```
# docker-compose -f ./testenv/docker-compose.yaml up -d
```

运行源码

```

# go run cmd/app/main.go

```

## 发布镜像

```
# make deploy
```


## 项目结构说明

```
├── cmd
├── configs
|  ├── config.toml
├── docs
├── internal
|  ├── api
|  |  ├── api.go
|  |  ├── base
|  |  ├── channel
|  |  ├── common
|  |  ├── conversation
|  |  ├── favorite
|  |  ├── file
|  |  ├── group
|  |  ├── label
|  |  ├── limaopay
|  |  ├── message
|  |  ├── moments
|  |  ├── pay
|  |  ├── qrcode
|  |  ├── redpacket
|  |  ├── report
|  |  ├── robot
|  |  ├── rtc
|  |  ├── source
|  |  ├── statistics
|  |  ├── sticker
|  |  ├── transfer
|  |  ├── user
|  |  └── webhook
|  ├── common
|  ├── config
|  └── worker
├── pkg
└── testenv
   ├── docker-compose.yaml

```

```
cmd：为应用入口文件目录
docs：文档目录
pkg：通用公开方法
testenv： 测试环境部署
internal：内部文件
  api： api模块目录
    user：用户模块
    group：群聊模块
    pay：通用支付模块
    limaopay：狸猫支付模块
    redpacket：红包模块
    transfer：转账模块
    moments：朋友圈模块
    message：消息模块
    sticker：表情商店模块
    file：文件模块
    robot：机器人模块
    webhook：处理通讯端的webhook逻辑
```