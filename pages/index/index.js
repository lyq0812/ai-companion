Page({
  data: {
    webViewUrl: 'https://lyq0812.github.io/ai-companion/'
  },
  
  onLoad: function() {
    console.log('页面加载');
  },
  
  onMessage: function(e) {
    console.log('收到web-view消息:', e.detail);
  },
  
  onError: function(e) {
    console.error('web-view加载错误:', e.detail);
    // 可以在这里添加错误处理逻辑
  }
});