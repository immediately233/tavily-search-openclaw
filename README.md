# Tavily搜索技能

这是一个用于OpenClaw的Tavily AI搜索API技能，提供智能、结构化的信息检索功能。

## 什么是Tavily？

Tavily是一个专为AI助手和自动化工具设计的搜索API，提供：
- **智能查询理解**：理解复杂问题和真实意图
- **结构化结果**：适合AI处理的JSON格式输出
- **多源聚合**：整合新闻、百科、社交媒体等来源
- **事实核查**：内置准确性验证机制
- **AI生成答案**：基于搜索结果生成整合回答

## 安装

1. 确保已安装Node.js（版本14或更高）
2. 进入技能目录：
   ```bash
   cd ~/.openclaw/skills/tavily-search
   ```
3. 安装依赖：
   ```bash
   npm install
   ```

## 配置API密钥

### 1. 获取Tavily API密钥
1. 访问 [https://tavily.com/](https://tavily.com/)
2. 注册账号（免费版可用）
3. 在Dashboard中获取API密钥

### 2. 配置技能
编辑 `config.json` 文件：
```json
{
  "api": {
    "baseUrl": "https://api.tavily.com",
    "apiKey": "你的实际Tavily API密钥",  // ← 替换这里
    "version": "v1"
  },
  "defaults": {
    "searchDepth": "basic",
    "maxResults": 5,
    "includeAnswer": true,
    "includeRawContent": false
  }
}
```

## 使用方法

### 命令行测试
```bash
# 基本搜索
node index.js --query "内容"

# 深度搜索
node index.js --query "内容" --depth deep

# 指定结果数量
node index.js --query "内容" --max-results 3

# 不包含AI答案
node index.js --query "内容" --include-answer false
```

### 在OpenClaw中使用
这个技能可以作为OpenClaw的一个工具被调用。在OpenClaw的上下文中，可以通过技能系统来调用智能搜索功能。

## API说明

### 参数选项
- `--query`：搜索查询字符串（必需）
- `--depth`：搜索深度 (`basic`/`deep`)
  - `basic`：快速搜索，适合一般查询
  - `deep`：深度搜索，更全面但较慢
- `--max-results`：返回结果数量（1-10）
- `--include-answer`：是否包含AI生成的答案（true/false）

### 返回信息
- **AI生成答案**：基于多源信息的整合回答
- **搜索结果**：结构化结果列表，包含标题、URL、内容摘要、相关性分数
- **响应时间**：API处理时间
- **相关图片**：查询相关的图片链接

## 搜索深度说明

### Basic搜索（默认）
- 快速响应（通常<2秒）
- 综合多个来源
- 适合一般信息查询
- 包含AI生成答案

### Deep搜索
- 更全面的搜索
- 包含更多来源和深入分析
- 响应时间较长（可能5-10秒）
- 适合复杂问题、研究或需要高准确性的查询

## 错误处理

1. **API密钥未配置**
   - 症状：提示"请先配置Tavily API密钥"
   - 解决方法：按照上述步骤配置API密钥

2. **网络连接问题**
   - 症状：搜索失败，网络错误
   - 解决方法：检查网络连接，确保能访问Tavily API

3. **API限制**
   - Tavily免费版有调用限制
   - 请遵守API使用条款

## 开发说明

### 文件结构
```
tavily-search/
├── SKILL.md          # 技能元数据
├── README.md         # 使用说明
├── index.js          # 主程序
├── config.json       # 配置文件
└── package.json      # 依赖配置
```

### 扩展功能
如果需要更多功能，可以修改`index.js`文件：

1. **自定义结果格式**
   ```javascript
   // 在formatResults方法中添加自定义字段
   ```

2. **缓存机制**
   ```javascript
   // 利用config.json中的cacheDuration设置
   // 缓存搜索结果减少API调用
   ```

3. **批量搜索**
   ```javascript
   // 添加支持多个查询的批量搜索功能
   ```

4. **特定领域搜索**
   ```javascript
   // 添加领域过滤参数（如只搜索学术文章、新闻等）
   ```

### Tavily API端点
- 搜索端点：`POST https://api.tavily.com/v1/search`
- 需要Bearer Token认证
- 请求体为JSON格式

## 示例用例

### 1. 学术研究
```bash
node index.js --query "深度学习在医学影像中的应用" --depth deep --max-results 10
```

### 2. 新闻时事
```bash
node index.js --query "最新科技新闻" --depth basic
```

### 3. 产品调研
```bash
node index.js --query "AI编程助手比较分析" --depth deep --include-answer true
```

### 4. 文化娱乐
```bash
node index.js --query "超时空辉夜姬 八千代 角色分析" --depth basic
```

## 性能建议

1. **合理使用深度搜索**：深度搜索消耗更多API额度，仅在必要时使用
2. **结果数量控制**：根据需求调整max-results，避免不必要的数据传输
3. **缓存策略**：对于不常变的信息，可以考虑本地缓存
4. **错误重试**：对于重要查询，可以添加重试机制

## 与OpenClaw内置搜索的比较

| 特性 | Tavily搜索 | OpenClaw内置搜索 |
|------|------------|------------------|
| **输出格式** | 结构化JSON | 原始HTML/片段 |
| **意图理解** | 专为AI优化 | 通用搜索 |
| **答案生成** | 内置AI生成答案 | 无 |
| **事实核查** | 有 | 无 |
| **配置复杂度** | 中等 | 简单 |
| **成本** | 免费版有限额 | 可能免费 |

## 注意事项

1. **API密钥安全**：不要将API密钥提交到公开仓库
2. **使用限制**：免费版API有调用频率限制
3. **数据隐私**：Tavily会处理搜索查询，注意隐私敏感信息
4. **结果准确性**：AI生成答案可能不完全准确，建议交叉验证

## 技术支持
- Tavily官方文档：https://docs.tavily.com/
- 如有问题，请参考官方文档或联系开发者
- OpenClaw社区：https://discord.com/invite/clawd