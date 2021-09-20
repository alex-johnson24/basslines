module.exports = {
    apps: [{
      name: 'chaggarcharts',
      script: 'dotnet /appl/chaggarcharts/ChaggarCharts.Api.dll',
      args: '',
      instances: 2,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {

      },
      env_production: {

      },
      env_staging: {

      },
    }],
  };
  