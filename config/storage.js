// Boze存储配置
const STORAGE_CONFIG = {
  owner: 'c313460963',  // 替换为你的GitHub用户名
  repo: 'boze-storage',          // 仓库名，保持不变
  token: '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',    // 替换为你保存的令牌
  branch: 'main'                 // 分支名，保持不变
};

// 简单存储类
class SimpleStorage {
  constructor(config) {
    this.config = config;
  }

  // 保存数据到GitHub
  async saveData(filename, data) {
    const content = btoa(JSON.stringify(data, null, 2));
    const url = `https://api.github.com/repos/${this.config.owner}/${this.config.repo}/contents/data/${filename}`;
    
    let sha = null;
    try {
      const checkResponse = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${this.config.token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      const checkData = await checkResponse.json();
      if (checkData.sha) sha = checkData.sha;
    } catch (e) {
      // 文件不存在，将创建新文件
    }
    
    const payload = {
      message: `Update ${filename}`,
      content: content
    };
    if (sha) payload.sha = sha;

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this.config.token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    return await response.json();
  }

  // 从GitHub读取数据
  async readData(filename) {
    const url = `https://raw.githubusercontent.com/${this.config.owner}/${this.config.repo}/${this.config.branch}/data/${filename}`;
    
    try {
      const response = await fetch(url);
      if (response.ok) {
        return await response.json();
      }
      return {};
    } catch (error) {
      return {};
    }
  }
}

// 创建存储实例
const storage = new SimpleStorage(STORAGE_CONFIG);
