---
title: 压力测试
order: 50000
toc: menu
group:
  title: 我是服务端开发者
---

狸猫IM提供模拟压力测试服务，全方位模拟用户注册，上下线，模拟接收或发送消息, 只需要部署limaoserver的时候开启 Test=true配置


## 部署压测端


## api

基地址: http://xxxxx:1316/v1

#### 模拟用户注册

模拟注册指定的用户数量

GET /bench/user/create

请求参数:

```json
?count=100 // 注册用户数量

```

返回数据：

http status 200
