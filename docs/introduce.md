---
title: 介绍
order: 1100
toc: menu
---

## 什么是狸猫IM

狸猫IM是一款**轻量级**，**高性能**，**重安全**专注于**私有化部署**的即时通讯系统。

## 为什么选择狸猫

**价格**

市场上的即时通讯(腾讯云，网易云信，融云等等)大部分按量，按月付费价格计算复杂，跟爱奇艺的vip，svip，付费点播一样的套路防不胜防。

狸猫IM专注于私有化部署，价格美丽，一次性付费永久使用。

**性能**

狸猫IM做了一系例的性能压力测试工具来保证性能优异，对消息可靠性，消息有序性，消息吞吐量，消息延迟性，同时用户在线量全方位模拟压测。

详情查看 [压力测试](/introduce.html#压力测试)

**安全性**

狸猫IM是国内唯一采用[端对端加密](/unifying.html#什么是端对端加密)提供私有化部署的厂商，采用国际通用的端对端加密算法signal（telegram，WhatsApp,Facebook等国外知名聊天软件都是采用的此加密技术）目前还无人能破解此算法

**专业性**

狸猫IM由一群在即时通讯领域工作十多年的伙伴精心打造，结合了国内国外各个即时通讯的优点和一些自有的想法打磨而成，自研消息数据库解决了消息存储性能瓶颈，国内首创消息无限制存储，无限制群成员数量的即时通讯系统。

## 特性与优势

#### 特性

1. 群人数无限制，业务场景更广阔
2. 支持端对端加密，聊天内容只有你和她/他知道
3. 支持消息编辑，消息点赞聊天更丰富
4. 自研消息数据库，轻轻松松支持消息永久存储
5. 自研物联网级别的二进制通讯协议，更省电和流量
6. 专注私有化部署，企业自己的数据自己完全拥有
7. 全平台支持，iOS，Android，Windows，MAC，Web


#### 优势

厂商 | 私有化部署 | 群人数 | 存储 | 端对端加密
---|--- |--- |--- |--- 
<label style="color:red">狸猫IM</label> | <label style="color:red">专注私有化部署</label> | <label style="color:red">无限制</label>  | <label style="color:red">永久</label>(自研消息数据库加持) | <label style="color:red">支持 </label>
网易云信 | 支持（需联系商务） | 小于5000 | 30天/免费版 1年/专业版 | 不支持 
融云 |  支持（需联系商务） | 3000 | 7天 | 不支持 
环信 | 支持（需联系商务） | 3000 | 7天（需联系商务） | 不支持
腾讯云IM | 支持（需联系商务） | 付费后最多扩展到6000人 | 30天/旗舰版 | 不支持


## 压力测试

主要测试指标：同时用户在线量,消息可靠性，消息有序性，大量离线消息收取，

**同时用户在线量**

测试一百万用户同时在线, 20台压测机，一台im服务器，每台压测机器模拟5万用户在线

im服务器配置： 	12 vCPU 24 GiB 

压测机： 8 vCPU 16 GiB

<img src="/images/aliyun.png"/>

20台机器模拟客户端在线，一台机器模拟5万

<video width="960"  controls>
  <source src="/video/stress.mp4" type="video/mp4">
    您的浏览器不支持Video标签。
</video>

100万连接后，im服务器 内存，cpu使用情况如下

<img src="/images/stress_result.png"/>

阿里云的监控图如下：

<img src="/images/aliyun_monitor.png"/>

结论： 100万同时在线持续两个小时，内存使用不超过7G，cpu在 25%以下


**消息可靠性**

 100个用户每个用户发送100个消息，重复许多次消息不丢。

<video width="320"  controls>
  <source src="/video/reliability.mp4" type="video/mp4">
    您的浏览器不支持Video标签。
</video>


**消息有序性**

2个用户每个用户快速发送1万条消息，观察序号是否有序，如果程序这么快的速度都没有乱序，真实发消息场景下就更加不可能乱序

<video width="320"  controls>
  <source src="/video/orderliness.mp4" type="video/mp4">
    您的浏览器不支持Video标签。
</video>


**大量离线消息收取**

100个用户 每个用户发送1000条消息。测试离线收取速度，结果：秒级收取速度

<video width="320"  controls>
  <source src="/video/offline.mp4" type="video/mp4">
    您的浏览器不支持Video标签。
</video>





## 狸猫IM的组成

狸猫IM由 客户端，服务端，运营端，运维端组成

客户端：主要是用户端使用 包括：iOS，Android，Web，PC（Electron）

服务端：给客户端调用的后端系统 包括：通讯端，业务端

运营端：给运营人员使用的后台管理系统，可查看注册人数，人活，周活，月活等等数据

运维端：给运维人员使用，可对各个系统进行全方位的监控。


## Demo体验

### iOS下载

![iOS下载](./images/iphone_download_qr.png)

### Android下载

![Android下载](./images/android_download_qr.png)


### Web

https://im.limaoim.cn

## 联系方式

下载注册我们的Demo 然后联系客服