module.exports = {
    apps: [{
      name: 'basslines',
      script: 'dotnet /appl/basslines/BassLines.Api.dll',
      args: '',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {

      },
      env_production: {

      },
      env_staging: {
        name: 'basslines',
        script: 'dotnet /appl/dev.basslines.co/BassLines.Api.dll',
        args: '',
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
      },
    }],
  };
  