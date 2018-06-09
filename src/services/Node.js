const Blockchain = require('./Blockchain');

class Node {

  constructor(blockchain,identifier){
    this.identifier = identifier;
    this.blockchain = blockchain;
  }
  new_transaction(transaction){
    let block = this.blockchain.new_transaction(transaction);
    let response = {
      "message": "transaction added",
      'block_index': block
    }
    return response;
  }

  mine(){
    console.log('---------mining-------')

    let next_block = this.blockchain.next_block;

    if(next_block != null){
      console.log('mining block',next_block);
      let last_block = this.blockchain.last_block;

      let nonce = this.blockchain.proof_of_work({last_block,next_block});

      this.blockchain.append_block_to_chain(next_block);
      this.blockchain._next_block=null;
      let response = {
          'message': "New Block Forged",
          'index': next_block['index'],
          'transactions': next_block['transactions'],
          'nonce': nonce,
          'previous_hash': next_block['previous_hash'],
          hash:next_block.hash
      }
      return response;
    }else{
      throw new Error('no_block_to_be_mined');
    }
/*

    // We run the proof of work algorithm to get the next proof...
    let last_block = this.blockchain.last_block
    let proof = this.blockchain.proof_of_work(last_block,next_block);

    // Forge the new Block by adding it to the chain
    let previous_hash = Blockchain.hash(last_block)
    let block = this.blockchain.new_block({proof, previous_hash})

    // We must receive a reward for finding the proof.
    // The sender is "0" to signify that this node has mined a new coin.
    this.blockchain.new_transaction({
        sender:"0",
        recipient:this.identifier,
        amount:1
      }
    )

    let response = {
        'message': "New Block Forged",
        'index': block['index'],
        'transactions': block['transactions'],
        'proof': proof,
        'previous_hash': block['previous_hash'],
    }
    return response;
    */
  }

}

module.exports = Node;
