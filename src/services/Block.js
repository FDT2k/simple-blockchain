const {hash_block} = require('./Blockchain_utils');
const _ = require('lodash');
class Block{
  constructor({index,transactions,nonce,previous_hash}){
    this.block = {
        'index': index,
        'timestamp': new Date().getTime(),
        'transactions': transactions,
        'nonce': nonce,
        'previous_hash': previous_hash
    }
  }

  stringify(){
    return JSON.stringify(_(_.omit(this.block,'hash')).toPairs().sortBy(0).fromPairs().value());
  }
  set nonce(proof){
    this.block.nonce = proof;
  }
  get index(){
    return this.block.index;
  }
  get timestamp(){
    return this.block.timestamp;
  }
  get nonce(){
    return this.block.nonce;
  }
  get previous_hash(){
    return this.block.previous_hash;
  }
  get hash (){
    this.block.hash = hash_block(this);
    return this.block.hash;
  }
  get json(){
    return this.block;
  }


}

module.exports = Block;
