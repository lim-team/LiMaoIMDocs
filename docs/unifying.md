---
title: 统一概念
order: 1900
toc: menu
---

## 什么是频道(channel)

发送消息 个人->个人，个人->群->成员，个人->客服->系统分配  我们统一抽象为个人->频道->订阅者这种模式，频道有ID和类型 类型决定了频道的投递消息的规则

频道是狸猫IM里比较重要的一个概念设计。我们将个人给个人发消息， 个人给群发消息。都统一为个人给频道(channel)发消息,有点像订阅发布者的机制

一个频道下允许有多个订阅者(subscriber) 

群就是典型的订阅/发布的模式

```
群频道

                    | ------> subscriberA

A ---> [channel] -->| ------> subscriberB

                    | ------> subscriberC
```

个人与个人发消息如何抽象成订阅/发布的模式？其实很简单 就是频道ID以A+B的用户唯一ID命名这样A发送消息给B 还是B发送消息给A 都是同一个频道ID，这个特殊的频道下面订阅者就是A和B两个用户

```
个人频道


A ---> [channel(A-B)] ------> subscriberB

B ---> [channel(A-B)] ------> subscriberA

```

这样最终发送消息流程就是  消息->频道->订阅者，频道就是中间介质，这样的好处就是业务不会分叉，比如群有拉黑功能，个人也有拉黑功能，如果没有统一频道的概念，那么拉黑功能需要针对个人拉黑，针对群拉黑做两套判断。现在只需要对频道做个黑名单功能就行了，不能发消息的订阅者直接加入到频道黑名单列表里。


## 什么是最近会话

## 什么是消息

## 什么是消息正文

## 什么是CMD消息

## 什么是系统消息

## 什么是消息提醒项

## 什么是消息回应

## 什么是已读未读回执