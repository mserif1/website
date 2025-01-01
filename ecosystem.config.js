module.exports = {
  apps: [
    {
      name: 'next-app',
      script: 'npm',
      args: 'start',
      env: {
        PORT: 3000,
        NODE_ENV: 'production'
      }
    },
    {
      name: 'socket-server',
      script: 'server.js',
      env: {
        PORT: 3001,
        NODE_ENV: 'production'
      }
    }
  ]
}; 