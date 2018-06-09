const {EventEmitter} = require('events');
const mediator = new EventEmitter();
const server = require('express-server-factory');

const { asClass,asValue,asFunction, createContainer } = require('awilix')
const { loadControllers, scopePerRequest,_registerController } =require('awilix-express')


const Node = require('./services/Node');
const Blockchain = require('./services/Blockchain');

let node = new Node(new Blockchain(),'hello');

const container = createContainer().register(
  {
    Node: asValue(node)
  }
);

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

server.start({},mediator,middlewares,routes);

process.on('uncaughtException', (err) => {
  console.error('Unhandled Exception', err)
})

process.on('uncaughtRejection', (err, promise) => {
  console.error('Unhandled Rejection', err)
})
