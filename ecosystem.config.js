module.exports = {
    apps: [{
      name: 'basslines',
      script: 'dotnet /appl/basslines/BassLines.Api.dll',
      args: '',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      append_env_to_name: true,
      env: {
      },
      env_production: {
        NODE_ENV: 'production'
      },
      env_staging: {
        NODE_ENV: 'staging'
      },
    }],
  };
  