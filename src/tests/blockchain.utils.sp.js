const should = require('should')

const {validate_proof,valid_chain,hash_block} = require('../services/Blockchain_utils')

const Block = require ('../services/Block');

describe('Block',  () => {

    it('should instanciate', () => {
      let block = new Block({index:0,transactions:[],nonce:100,previous_hash:1});
    //  console.log(block);

    //  hash_block(block);
      should(block).be.an.Object();
    })

    it('should compute hash', () => {
      let block = new Block({index:0,transactions:[],nonce:100,previous_hash:1});


      let hash = hash_block(block);

      let hash2 = hash_block(block);


      should(hash).be.exactly(hash2);
      //hash should change if we alter nonce;
      block.nonce = 2;
      let hash3 = hash_block(block);

      should(hash3).not.be.exactly(hash);
    })

    it('should stringify hash', () => {
      let block = new Block({index:0,transactions:[],nonce:100,previous_hash:1});

      let string = block.stringify();
      console.log(string);
      console.log(block.hash);
      block.nonce+=1;
      console.log(block.stringify());
      console.log(block.hash);
    //  should(hash3).not.be.exactly(hash);
    })



    it('should find a proof', ()=>{
      let genesis = new Block({index:0,transactions:[],nonce:100,previous_hash:1});

      let next_block = new Block ({
        index:1,
        transactions:[{message:'blabla'}],
        nonce:0,
        previous_hash: genesis.hash
      });

      next_block.nonce+=1;

      while( ! validate_proof({previous_block:genesis,next_block}) ){
        next_block.nonce+=1;
      //  console.log(next_block.hash);
      }

      let valid = valid_chain([genesis,next_block]);
      should(valid).be.exactly(true);
    }).timeout(10000);

    it('should not validate a proof', ()=>{
      let genesis = new Block({index:0,transactions:[],nonce:100,previous_hash:1});

      let next_block = new Block ({
        index:1,
        transactions:[{message:'blabla'}],
        nonce:0,
        previous_hash: genesis.hash
      });

      next_block.nonce+=1;

      while( ! validate_proof({previous_block:genesis,next_block}) ){
        next_block.nonce+=1;
      //  console.log(next_block.hash);
      }
      console.log(next_block.json);
      next_block.block.timestamp = new Date().getTime();

      let valid = valid_chain([genesis,next_block]);
      should(valid).be.exactly(false);
    }).timeout(10000);

    it('should find a proof (3blocks)', ()=>{
      let block_0 = new Block({index:0,transactions:[],nonce:100,previous_hash:1});

      let block_1 = new Block ({
        index:1,
        transactions:[{message:'blabla'}],
        nonce:0,
        previous_hash: block_0.hash
      });

      while( ! validate_proof({previous_block:block_0,next_block:block_1}) ){
        block_1.nonce+=1;
      //  console.log(next_block.hash);
      }

      let valid = valid_chain([block_0,block_1]);
      should(valid).be.exactly(true);

      let block_2  = new Block ({
        index:2,
        transactions:[{message:'bloubla'}],
        nonce:0,
        previous_hash: block_1.hash
      });
      while( ! validate_proof({previous_block:block_1,next_block:block_2}) ){
        block_2.nonce+=1;
      //  console.log(next_block.hash);
      }

      valid = valid_chain([block_0,block_1,block_2]);
      should(valid).be.exactly(true);

    }).timeout(10000);


});
