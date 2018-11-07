const assert = require('assert')
const {execSync} = require('child_process')
const TronWeb = require('../../tronwrap/tron-web/dist/TronWeb.node.js')
const dev = require('./fixtures/metacoin/tronbox').networks.development

const tronWeb = new TronWeb(
  dev.fullNode,
  dev.solidityNode,
  dev.eventServer,
  dev.privateKey
)

describe("TronBox", async function() {

  it("should verify that Tron Quickstart is running", async function () {

    const connected = await tronWeb.isConnected()
    assert.equal(typeof connected, 'object', 'Tron Quickstart is not running')
  })

  describe("Compile", async function () {


    this.timeout(10000)

    it("should compile MetaCoin.sol", async function () {

      const result = execSync('(cd test/fixtures/metacoin && rm -rf build && ../../../../truffle-core/cli.js compile)').toString()

      assert.notEqual(result.indexOf('Writing artifacts to ./build/contracts'), -1);
    })

  })

  describe("Migrate", async function () {

    this.timeout(10000)

    it("should migrate MetaCoin.sol", async function () {

      const result = execSync('(cd test/fixtures/metacoin && rm -rf build && ../../../../truffle-core/cli.js migrate --reset)').toString()

      assert.notEqual(result.indexOf('Saving successful migration to network'), -1);

      let metacoinAddress = result.match(/.+MetaCoin:\n[^b]+base58\) (.{34})\n.*/);
      assert.equal(tronWeb.isAddress(metacoinAddress[1]), true)
    })

  })

  describe("Test", async function () {

    this.timeout(20000)

    it("should test MetaCoin.sol without throwing errors", async function () {

      execSync('(cd test/fixtures/metacoin && rm -rf build && ../../../../truffle-core/cli.js test)')

    })

  })

});
