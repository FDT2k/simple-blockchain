const _ = require('lodash');
const bodyParser =require( 'body-parser');
const {aliasTo,asValue,asFunction} = require('awilix');
const {inject, createController} =require( 'awilix-express');



var useragent = require('express-useragent');


const API = ({Node}) => {
	//
	return {

		//retrieve token from session id
		chain: (req,res)=>{
      console.log()
      res.send(_.map(Node.blockchain.chain,(block)=>{
        return block.block;
      }));
		},
    mine: (req,res)=>{
      res.send(Node.mine());
    },
    add_tr: (req,res)=>{
      res.send(Node.new_transaction(req.body));
    },
    register: (req,res)=>{

    }

	};
};

module.exports = createController(API)
//	.prefix('/') // Prefix all endpoints with
	.get('/mine','mine')
	.post('/transactions/new','add_tr')
  .get('/chain','chain')
  .post('/nodes/register','register')
  .post('/nodes/resolve')
