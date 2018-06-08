const should = require('should')

const Blockchain = require('../services/Blockchain')
const Node = require ('../services/Node');

const {validate_proof,valid_chain,hash_block} = require('../services/Blockchain_utils')

describe('Blockchain',  () => {

    it('should instanciate', () => {

      let cc = new Blockchain()
      cc.should.be.an.Object();
    })

    it('should have one block', () => {

      let cc = new Blockchain()
      cc.should.be.an.Object();
      should(cc.chain.length).be.exactly(1);

    })

    it('should add transaction', () => {

      let cc = new Blockchain()
      cc.should.be.an.Object();
      should(cc.current_transactions.length).be.exactly(0);
      let _index = cc.new_transaction({sender:'dkdkd',recipient:'blabla',amount:0});
      should(cc.current_transactions.length).be.exactly(1);
      should(_index).be.exactly(2);
    })

    it('should register node', () => {
      let cc = new Blockchain()
      cc.should.be.an.Object();
      let res = cc.register_node('http://18.9.2.1');
      should (res).be.exactly(true);
      should(cc.nodes.length).be.exactly(1);
      res = cc.register_node('http://18.9.2.1');
      should (res).be.exactly(false);
      should(cc.nodes.length).be.exactly(1);
    })
});

describe('Node',  () => {
  it('should instanciate', () => {

    let cc = new Node()
    cc.should.be.an.Object();
  })

  it('should mine', () => {
    let b = new Blockchain();
    let cc = new Node(b,'hello_node');
    cc.should.be.an.Object();
    let _block = b.new_transaction({sender:'dkdkd',recipient:'blabla',amount:0});
    cc.mine();
    should(b.chain.length).be.exactly(2);
    should(()=>{cc.mine();}).throw('no_block_to_be_mined');
  } ).timeout(50000);



  it('should have a valid chain', () => {
    let b = new Blockchain();
    let cc = new Node(b,'hello');
    cc.should.be.an.Object();
    let _block = b.new_transaction({sender:'dkdkd',recipient:'blabla',amount:0});
    cc.mine();
  //  cc.mine();
    let res = valid_chain(b.chain);
    should(res).be.exactly(true);
  }).timeout(50000);


  it('should not have a valid chain', () => {
    let b = new Blockchain();
    let cc = new Node(b,'hello');
    cc.should.be.an.Object();
    let _block = b.new_transaction({sender:'dkdkd',recipient:'blabla',amount:0});
    cc.mine();
  //  cc.mine();
    // inject fake transaction in block
    b.chain[1].block.transactions.push({message:'faked'});
    let res = valid_chain(b.chain);
    should(res).be.exactly(false);
  }).timeout(50000);

  it('should not have a valid chain', () => {
    let b = new Blockchain();
    let cc = new Node(b,'hello');
    cc.should.be.an.Object();
    let _block = b.new_transaction({sender:'dkdkd',recipient:'blabla',amount:0});
    cc.mine();
      //_block = b.new_transaction({sender:'dkdkd',recipient:'blabla',amount:0});
  //  cc.mine();
    // inject fake transaction in last block
  //  console.log(b.chain.length-1);
  //  console.log(b.chain);
    b.chain[b.chain.length-1].block.transactions.push({message:'faked'});
    let res = valid_chain(b.chain);
    should(res).be.exactly(false);
  }).timeout(50000);

});
