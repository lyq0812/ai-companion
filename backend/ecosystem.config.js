module.exports = {
  apps: [{
    name: 'ai-companion-backend',
    script: './src/app.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 8080
    },
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    max_memory_restart: '1G',
    restart_delay: 3000,
    max_restarts: 10,
    min_uptime: '10s',
    // 自动重启
    autorestart: true,
    // 不重启的退出码
    stop_exit_codes: [0],
    // 监控文件变化
    watch: false,
    // 忽略的文件
    ignore_watch: ['node_modules', 'logs', 'uploads'],
    // 优雅关闭
    kill_timeout: 5000,
    listen_timeout: 10000
  }]
};
