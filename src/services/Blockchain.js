
const _ = require('lodash');
const crypto = require('crypto');
const axios = require ('axios');
const Promise = require ('bluebird');
const {URL} = require('url');
class Blockchain {
  constructor(){
      this.current_transactions = [];
      this.chain = [];
      this.nodes = [];
      this.new_block({previous_hash:'1', proof:100})
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

  static valid_chain(chain){
    /*
    Determine if a given blockchain is valid
    :param chain: A blockchain
    :return: True if valid, False if not
    */

    let last_block = chain[0]
    let current_index = 1; //no check on genesis block.

    while (current_index < chain.length){
      let block = chain[current_index]
    //  console.log(last_block);
    //  console.log(block);
    //  console.log('-----------');
    /*  print('{last_block}')
      print(f'{block}')
      print("\n-----------\n")*/
      // Check that the hash of the block is correct
      let last_block_hash = Blockchain.hash(last_block)
      if(block.previous_hash != last_block_hash){
        return false;
      }
      /*if(block.hash != Blockchain.hash(block)){
        return false;
      }*/

      // Check that the Proof of Work is correct
      if (!Blockchain.valid_proof({last_proof:last_block.proof,proof: block.proof, last_hash:last_block_hash})){
        return false
      }
      last_block = block
      current_index += 1
    }
    return true
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

  new_block({proof, previous_hash}){
    /*
    Create a new Block in the Blockchain
    :param proof: The proof given by the Proof of Work algorithm
    :param previous_hash: Hash of previous Block
    :return: New Block
    */

    let block = {
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
  }

  new_transaction({sender, recipient, amount}){
    /*
    Creates a new transaction to go into the next mined Block
    :param sender: Address of the Sender
    :param recipient: Address of the Recipient
    :param amount: Amount
    :return: The index of the Block that will hold this transaction
    */
    this.current_transactions.push({
        'sender': sender,
        'recipient': recipient,
        'amount': amount,
    });

    return this.last_block['index'] + 1
  }

  proof_of_work( last_block){
    /*
    Simple Proof of Work Algorithm:
     - Find a number p' such that hash(pp') contains leading 4 zeroes
     - Where p is the previous proof, and p' is the new proof

    :param last_block: <dict> last Block
    :return: <int>
    */

    let last_proof = last_block.proof
    let last_hash = Blockchain.hash(last_block)

    let proof = 0
    while (!Blockchain.valid_proof({last_proof, proof, last_hash})){
        proof += 1
    }
    return proof
  }

  static valid_proof({last_proof, proof, last_hash}){
    /*
    Validates the Proof
    :param last_proof: <int> Previous Proof
    :param proof: <int> Current Proof
    :param last_hash: <str> The hash of the Previous Block
    :reurn: <bool> True if correct, False if not.
    */

  //  guess = f'{last_proof}{proof}{last_hash}'.encode()

    let guess = `${last_proof}${proof}${last_hash}`;
  //  console.log(guess);
    let guess_hash = crypto.createHash('sha256')
                       .update(guess)
                       .digest('hex');
    return guess_hash.substr(guess_hash.length - 4)== "0000";
  }

  static hash(block){
    /*
    Creates a SHA-256 hash of a Block
    :param block: Block
    */

    // We must make sure that the Dictionary is Ordered, or we'll have inconsistent hashes

    let block_string = JSON.stringify(_(_.omit(block,'hash')).toPairs().sortBy(0).fromPairs().value());
    console.log('block_string', block_string);
    //return hashlib.sha256(block_string).hexdigest()
    return crypto.createHash('sha256')
                       .update(block_string)
                       .digest('hex');
  }
}

module.exports = Blockchain;
