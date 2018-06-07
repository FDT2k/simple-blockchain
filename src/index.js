
console.log('db connected');
  const middlewares = [
    (req, res, next)=> {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
      next();
    },
    scopePerRequest(container),
  ];

  const routes = [
    loadControllers('routes/*.js', { cwd: __dirname })
  ];

  server.start(config.serverSettings,mediator,middlewares,routes);

process.on('uncaughtException', (err) => {
  console.error('Unhandled Exception', err)
})

process.on('uncaughtRejection', (err, promise) => {
  console.error('Unhandled Rejection', err)
})
