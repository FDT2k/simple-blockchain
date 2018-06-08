const crypto = require('crypto');

const validate_proof =({previous_block,next_block})=>{
  /*
  Validates the Proof
  :param last_proof: <int> Previous Proof
  :param proof: <int> Current Proof
  :param last_hash: <str> The hash of the Previous Block
  :param next_hash <str> The hash of the current Block
  :reurn: <bool> True if correct, False if not.
  */

//  guess = f'{last_proof}{proof}{last_hash}'.encode()

  let guess = `${previous_block.nonce}${next_block.nonce}${previous_block.hash}${next_block.hash}`;
//  console.log(guess);
  let guess_hash = crypto.createHash('sha256')
                     .update(guess)
                     .digest('hex');
  return guess_hash.substr(guess_hash.length - 4)== "0000";
}

const hash_block = (block)=>{
  /*
  Creates a SHA-256 hash of a Block
  :param block: Block
  */

  // We must make sure that the Dictionary is Ordered, or we'll have inconsistent hashes

  let block_string = block.stringify();
//  console.log('block_string', block_string);
  //return hashlib.sha256(block_string).hexdigest()
  return crypto.createHash('sha256')
                     .update(block_string)
                     .digest('hex');
}

const valid_chain=(chain)=>{
    /*
    Determine if a given blockchain is valid
    :param chain: A blockchain
    :return: True if valid, False if not
    */

    let previous_block = chain[0]
    let current_index = 1; //no check on genesis block.

    while (current_index < chain.length){
      let next_block = chain[current_index]

      // Check that the hash of the block is correct
      let previous_block_hash = previous_block.hash;
      if(next_block.previous_hash != previous_block_hash){
        return false;
      }
      /*if(block.hash != Blockchain.hash(block)){
        return false;
      }*/

      // Check that the Proof of Work is correct
      if (!validate_proof({previous_block,next_block})){
        return false
      }
      previous_block = next_block
      current_index += 1
    }
    return true
  }

module.exports = Object.assign({},{validate_proof,valid_chain,hash_block});
