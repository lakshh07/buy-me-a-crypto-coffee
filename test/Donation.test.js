const { assert } = require("chai");

const Donation = artifacts.require("Donation");

function toWei(n) {
  return web3.utils.toWei(n, "ether");
}

contract("Donation", ([contributer, creator]) => {
  let donation;

  beforeEach(async () => {
    donation = await Donation.new();
  });
  it("should deploys successfully", async () => {
    const address = await donation.address;
    assert.notEqual(address, 0x0);
    assert.notEqual(address, "");
    assert.notEqual(address, null);
    assert.notEqual(address, undefined);
  });
  it("Should swap and send correctly", async () => {
    const amount = toWei("0.2");

    assert.notEqual(contributer, creator, "Creater must not be contributer");
    // swaps
    const result = await donation.donate(creator, {
      from: contributer,
      value: amount,
    });
    const swapEvent = result.logs[0].args;
    const user = await donation.creators(swapEvent.creator);

    assert.equal(
      user.balance.toString(),
      swapEvent.amount.toString(),
      "Creator balance is correct"
    );
    assert.equal(user.supporter.toString(), "1", "supporter is correct");
  });
});
