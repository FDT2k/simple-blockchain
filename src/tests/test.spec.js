const should = require('should')

const Blockchain = require('../services/Blockchain')
const Node = require ('../services/Node');
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
      let _block = cc.new_transaction({sender:'dkdkd',recipient:'blabla',amount:0});
      should(cc.current_transactions.length).be.exactly(1);
      should(_block).be.exactly(1);
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
  //  console.log(b.chain);
    cc.mine();
  //  console.log(b.chain);
  })
/*
  it('should have a valid chain', () => {
    let b = new Blockchain();
    let cc = new Node(b,'hello');
    cc.should.be.an.Object();
    let _block = b.new_transaction({sender:'dkdkd',recipient:'blabla',amount:0});
    cc.mine();
    cc.mine();
    let res = Blockchain.valid_chain(b.chain);
    should(res).be.exactly(true);
  })
  */
  /*
  it('should not have a valid chain', () => {
    let b = new Blockchain();
    let cc = new Node(b,'hello');
    cc.should.be.an.Object();
    let _block = b.new_transaction({sender:'dkdkd',recipient:'blabla',amount:0});
    cc.mine();
    cc.mine();
    // inject fake transaction in block
    b.chain[1].transactions.push({message:'faked'});
    let res = Blockchain.valid_chain(b.chain);
    should(res).be.exactly(false);
  })

  it('should not have a valid chain', () => {
    let b = new Blockchain();
    let cc = new Node(b,'hello');
    cc.should.be.an.Object();
    let _block = b.new_transaction({sender:'dkdkd',recipient:'blabla',amount:0});
    cc.mine();
    cc.mine();
    // inject fake transaction in last block
  //  console.log(b.chain.length-1);
  //  console.log(b.chain);
    b.chain[b.chain.length-1].transactions.push({message:'faked'});
    let res = Blockchain.valid_chain(b.chain);
    should(res).be.exactly(false);
  })*/

});
