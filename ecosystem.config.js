module.exports = {
  apps: [{
    name: 'food-truck-marketplace',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/food-truck-marketplace',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/pm2/food-truck-marketplace-error.log',
    out_file: '/var/log/pm2/food-truck-marketplace-out.log',
    log_file: '/var/log/pm2/food-truck-marketplace.log',
    time: true,
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024'
  }]
};
