
const _ = require('lodash');
const crypto = require('crypto');
const axios = require ('axios');
const Promise = require ('bluebird');
const Block = require ('./Block');

const {validate_proof,valid_chain,hash_block} = require('../services/Blockchain_utils')

const {URL} = require('url');
class Blockchain {
  constructor(){
      this.current_transactions = [];
      this.chain = [];
      this.nodes = [];
      this._next_block= null;
    //  this.new_block({previous_hash:'1', proof:100})
      this.create_genesis_block();
  }

  create_genesis_block(){
    let block = new Block({index:1,transactions:[],nonce:100,previous_hash:1});
    this.append_block_to_chain(block);
  }

  append_block_to_chain(block){
    this.chain.push(block);
  //  this._next_block=null;
  }

  get last_block(){
    return this.chain[this.chain.length-1];
  }

  // REVIEW
  register_node(address){
       /*
       Add a new node to the list of nodes
       :param address: Address of node. Eg. 'http://192.168.0.5:5000'
       */

       let parsed_url = new URL(address)
       if (parsed_url.host && _.indexOf(this.nodes,parsed_url.host) == -1){
         this.nodes.push(parsed_url.host);
         return true;
       }
    return false;
  }

  get next_block(){
    /*return the next block while not mined*/
    if(this.current_transactions.length>0 && this._next_block == null){
      this._next_block = new Block({
              'index': this.chain.length + 1,
              'timestamp': new Date().getTime(),
              'transactions': this.current_transactions,
              'nonce':0,
              'previous_hash':  this.last_block.hash
          });
      this.current_transactions = [];

    }
    return this._next_block;
  }


   resolve_conflicts(){
     /*
     This is our consensus algorithm, it resolves conflicts
     by replacing our chain with the longest one in the network.
     :return: True if our chain was replaced, False if not
     */

     let neighbours = this.nodes
     let new_chain = null;

     //We're only looking for chains longer than ours
     let max_length = self.chain.length;

     let promises = [] ;
     //Grab and verify the chains from all the nodes in our network
     for (node in neighbours){
       promises.push(axios.get(`http://${node}/chain`));
     }

     return Promise.all(promises)
      .then(responses=>{
        for(response of responses){
          response = response.payload.data;
          let length = response.length;
          let chain = response.chain;
          if(length > max_length && Blockchain.valid_chain(chain)){
            max_length = length;
            new_chain = chain;
          }
        }

        // Replace our chain if we discovered a new, valid chain longer than ours

        if (new_chain!= null){
          this.chain = new_chain
          return true;
        }
         return false;
      });
   }

//  new_block({proof, previous_hash}){
    /*
    Create a new Block in the Blockchain
    :param proof: The proof given by the Proof of Work algorithm
    :param previous_hash: Hash of previous Block
    :return: New Block
    */

/*    let block = {
        'index': this.chain.length + 1,
        'timestamp': new Date().getTime(),
        'transactions': this.current_transactions,
        'proof': proof,
        'previous_hash': previous_hash || Blockchain.hash(this.chain[this.chain.length-1]),
    }
    block.hash = Blockchain.hash(block);
    // Reset the current list of transactions
    this.current_transactions = []

    this.chain.push(block)
    return block
  }*/


  new_transaction(transaction){
    /*
    Creates a new transaction to go into the next mined Block
    :param sender: Address of the Sender
    :param recipient: Address of the Recipient
    :param amount: Amount
    :return: The index of the Block that will hold this transaction
    */
    this.current_transactions.push(transaction);

    return this.last_block['index'] + 1 // this is wrong since we handle next_block differently
  }

  proof_of_work( {last_block,next_block}){
    /*
    Simple Proof of Work Algorithm:
     - Find a number p' such that hash(pp') contains leading 4 zeroes
     - Where p is the previous proof, and p' is the new proof

    :param last_block: <dict> last Block
    :return: <int>
    */
/*
    let last_proof = last_block.proof
    let last_hash = Blockchain.hash(last_block)
    let next_hash = Blockchain.hash(next_block)
*/
    while (!validate_proof({previous_block:last_block,next_block})){
        next_block.nonce += 1
    }
    return next_block.nonce;
  }




}

module.exports = Blockchain;
