---
name: tavily-search
description: 使用Tavily AI搜索API进行智能搜索。专为AI助手优化，提供结构化、准确的信息检索。
metadata:
  {
    "openclaw":
      {
        "requires": { "node": true },
        "install":
          [
            {
              "id": "node",
              "kind": "node",
              "package": "axios",
              "label": "安装axios依赖"
            }
          ]
      }
  }
---

# Tavily搜索技能

使用Tavily AI搜索API进行智能信息检索。专为AI助手和自动化工具设计，提供结构化的搜索结果。

## 功能
- 智能搜索查询，理解复杂意图
- 结构化结果输出，易于AI处理
- 多源信息聚合（新闻、百科、社交媒体等）
- 事实核查和准确性验证
- 支持深度搜索和实时信息

## 配置
在使用前，需要配置Tavily API密钥：

1. 注册Tavily账号（https://tavily.com/）
2. 获取API密钥（免费额度可用）
3. 编辑 `config.json` 文件，填入你的API密钥

## 使用方法

### 命令行使用
```bash
# 基本搜索
node index.js --query "搜索关键词"

# 深度搜索
node index.js --query "复杂问题" --depth deep

# 指定结果数量
node index.js --query "主题" --max-results 5
```

### 参数说明
- `--query`：搜索查询字符串
- `--depth`：搜索深度（basic/deep）
- `--max-results`：返回结果数量（1-10）
- `--include-answer`：是否包含AI生成的答案

## 返回示例
```
搜索查询：超时空辉夜姬 八千代

结果摘要：
八千代可能是《超时空辉夜姬》中的时间守护者角色，拥有永恒生命...

搜索结果（3个）：
1. 【角色分析】八千代的人设特点...
2. 【情节解析】八千代在剧情中的关键作用...
3. 【作品背景】《超时空辉夜姬》的创作背景...

AI生成的答案：
八千代是...（基于多源信息的整合回答）
```

## 依赖
- axios：用于HTTP请求

## 注意事项
- 需要有效的Tavily API密钥
- API调用有频率限制（免费版有限制）
- 建议对重要查询使用深度搜索（depth: deep）
- 结果已结构化，适合AI进一步处理