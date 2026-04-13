module.exports = {
  apps: [
    {
      name: 'dev-portal',
      script: 'node_modules/.bin/next',
      args: 'start',
      cwd: '/var/www/ui-apps/dev-portal',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
}
