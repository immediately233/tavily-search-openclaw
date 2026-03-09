const axios = require('axios');
const fs = require('fs');
const path = require('path');

// 加载配置
const configPath = path.join(__dirname, 'config.json');
let config;
try {
  config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
} catch (error) {
  console.error('读取配置文件失败:', error.message);
  console.error('请确保 config.json 文件存在且格式正确');
  process.exit(1);
}

// 检查API密钥
if (!config.api || !config.api.apiKey || config.api.apiKey === 'YOUR_TAVILY_API_KEY_HERE') {
  console.error('请先配置Tavily API密钥');
  console.error('1. 访问 https://tavily.com/ 注册账号');
  console.error('2. 获取API密钥');
  console.error('3. 编辑 config.json 文件，填入你的API密钥');
  process.exit(1);
}

// Tavily搜索客户端
class TavilySearch {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = config.api.baseUrl || 'https://api.tavily.com';
    this.version = config.api.version || 'v1';
    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: config.timeout || 10000,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        'User-Agent': 'OpenClaw-TavilySearch/1.0'
      }
    });
  }

  // 执行搜索
  async search(query, options = {}) {
    try {
      const params = {
        query: query,
        search_depth: options.depth || config.defaults.searchDepth || 'basic',
        max_results: options.maxResults || config.defaults.maxResults || 5,
        include_answer: options.includeAnswer !== undefined ? options.includeAnswer : config.defaults.includeAnswer,
        include_raw_content: options.includeRawContent !== undefined ? options.includeRawContent : config.defaults.includeRawContent
      };

      console.log(`正在搜索: "${query}" (深度: ${params.search_depth})`);

      const response = await this.client.post(`/${this.version}/search`, params);
      
      if (response.status !== 200) {
        throw new Error(`API返回错误: ${response.status}`);
      }

      return this.formatResults(response.data, query);
    } catch (error) {
      console.error('搜索失败:', error.message);
      
      // 如果API不可用，返回示例数据（用于测试）
      if (error.code === 'ENOTFOUND' || error.response?.status === 404) {
        console.warn('API端点可能不正确，返回示例数据');
        return this.getSampleResults(query);
      }
      
      // 处理API错误响应
      if (error.response && error.response.data) {
        console.error('API错误详情:', JSON.stringify(error.response.data, null, 2));
      }
      
      throw error;
    }
  }

  // 格式化搜索结果
  formatResults(data, query) {
    return {
      query: query,
      answer: data.answer || null,
      results: data.results || [],
      responseTime: data.response_time || null,
      images: data.images || [],
      rawData: data, // 保留原始数据
      timestamp: new Date().toISOString()
    };
  }

  // 生成示例搜索结果（用于测试）
  getSampleResults(query) {
    return {
      query: query,
      answer: `这是关于"${query}"的示例回答。请配置正确的Tavily API密钥以获取真实搜索结果。`,
      results: [
        {
          title: `示例结果1: ${query} 的相关信息`,
          url: 'https://example.com/result1',
          content: `这是关于${query}的第一个示例结果内容...`,
          score: 0.95
        },
        {
          title: `示例结果2: ${query} 的深入分析`,
          url: 'https://example.com/result2',
          content: `这是关于${query}的第二个示例结果内容，提供更多细节...`,
          score: 0.87
        }
      ],
      responseTime: 0.5,
      images: [],
      rawData: { note: '这是示例数据，请配置正确的Tavily API密钥' },
      timestamp: new Date().toISOString()
    };
  }

  // 打印搜索结果
  printResults(searchResults) {
    console.log('='.repeat(60));
    console.log(`搜索查询: ${searchResults.query}`);
    console.log(`搜索时间: ${new Date(searchResults.timestamp).toLocaleString('zh-CN')}`);
    
    if (searchResults.responseTime) {
      console.log(`响应时间: ${searchResults.responseTime}秒`);
    }
    
    console.log('-'.repeat(40));
    
    // 显示AI生成的答案（如果有）
    if (searchResults.answer) {
      console.log('AI生成答案:');
      console.log(searchResults.answer);
      console.log('-'.repeat(40));
    }
    
    // 显示搜索结果
    console.log(`搜索结果 (${searchResults.results.length}个):`);
    searchResults.results.forEach((result, index) => {
      console.log(`\n${index + 1}. ${result.title}`);
      console.log(`   链接: ${result.url}`);
      console.log(`   相关性: ${(result.score * 100).toFixed(1)}%`);
      console.log(`   摘要: ${result.content.substring(0, 150)}...`);
    });
    
    // 显示图片（如果有）
    if (searchResults.images && searchResults.images.length > 0) {
      console.log('-'.repeat(40));
      console.log(`相关图片: ${searchResults.images.length}张`);
      searchResults.images.slice(0, 3).forEach((image, index) => {
        console.log(`   ${index + 1}. ${image}`);
      });
    }
    
    if (searchResults.rawData.note) {
      console.log('\n提示:', searchResults.rawData.note);
    }
    
    console.log('='.repeat(60));
  }
}

// 命令行参数解析
function parseArgs() {
  const args = process.argv.slice(2);
  const params = {
    query: '',
    depth: config.defaults.searchDepth || 'basic',
    maxResults: config.defaults.maxResults || 5,
    includeAnswer: config.defaults.includeAnswer !== false
  };
  
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--query' && args[i + 1]) {
      params.query = args[++i];
    } else if (args[i] === '--depth' && args[i + 1]) {
      params.depth = args[++i];
    } else if (args[i] === '--max-results' && args[i + 1]) {
      params.maxResults = parseInt(args[++i]);
    } else if (args[i] === '--include-answer' && args[i + 1]) {
      params.includeAnswer = args[++i].toLowerCase() === 'true';
    } else if (args[i] === '--help' || args[i] === '-h') {
      console.log('Tavily搜索技能使用方法:');
      console.log('  node index.js --query "搜索关键词"');
      console.log('  node index.js --query "复杂问题" --depth deep');
      console.log('  node index.js --query "主题" --max-results 5 --include-answer true');
      console.log('\n参数说明:');
      console.log('  --query          搜索查询字符串');
      console.log('  --depth          搜索深度 (basic/deep)');
      console.log('  --max-results    返回结果数量 (1-10)');
      console.log('  --include-answer 是否包含AI生成的答案 (true/false)');
      console.log('  --help, -h       显示帮助信息');
      process.exit(0);
    }
  }
  
  if (!params.query) {
    console.error('错误: 必须提供搜索查询参数');
    console.error('使用方法: node index.js --query "搜索关键词"');
    console.error('使用 --help 查看完整帮助');
    process.exit(1);
  }
  
  return params;
}

// 主函数
async function main() {
  const params = parseArgs();
  
  const searchClient = new TavilySearch(config.api.apiKey);
  
  try {
    const searchResults = await searchClient.search(params.query, {
      depth: params.depth,
      maxResults: params.maxResults,
      includeAnswer: params.includeAnswer
    });
    
    searchClient.printResults(searchResults);
  } catch (error) {
    console.error('搜索执行失败:', error.message);
    process.exit(1);
  }
}

// 命令行执行
if (require.main === module) {
  main().catch(error => {
    console.error('程序执行出错:', error);
    process.exit(1);
  });
}

// 导出模块
module.exports = { TavilySearch };