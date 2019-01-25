const {expectEvent, assertThrow} = require('./helpers.js');
const VeracityRegister = artifacts.require("VeracityRegister.sol");

contract('VeracityRegister', async ([account]) => {
  let veracity;

  let r = () => web3.utils.randomHex(32);

  beforeEach(async () => {
    veracity = await VeracityRegister.new();
  });

  it("successfully deploys", () => {
    assert.ok(veracity);
  });

  it("creates random passport", async () => {
    await veracity.create(0, r(), r(), r(), r(), r(), r());
  });

  it("creates specific", async () => {
    let d = "0x96cb27ddd56980bde81b05b540b45a24f7d29f2be7415011caf533e156fc975f";
    await veracity.create(0, d, d, d, d, d, d);
  });

  describe("passport", async () => {
    let id = 0;
    let d = web3.utils.sha3("test");

    beforeEach(async () => {
      await veracity.create(id, d, d, d, d, d, d);
    });

    it("hashes", async () => {
      let pass = await veracity.passport(id);
      let hash = web3.utils.soliditySha3(id, d, d, d, d, d, d);
      assert.equal(pass, hash);
    });

    it("updates", async () => {
      let update = web3.utils.sha3("test2");
      let receipt = await veracity.update(id, d, update, d, d, d, d);
      expectEvent.inLogs(receipt.logs, "FingerprintsChanged", {
        id: 0,
        from: "0x9c22ff5f21f0b81b113e63f7db6da94fedef11b2119b4088b89664fb9a3cb658",
        to: "0x4da432f1ecd4c0ac028ebde3a3f78510a21d54087b161590a63080d33b702b8d"
      });
    });

    it("details", async () => {
      assert.ok(await veracity.details(id));
    });

    it("update all", async () => {
      await veracity.update(id, r(), r(), r(), r(), r(), r());
    });

    it("something has to be updated", async () => {
      await assertThrow(veracity.update(id, d, d, d, d, d, d));
    });
  });
});
