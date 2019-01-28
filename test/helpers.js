const CryptoJS = require('crypto-js');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

var exports = module.exports = {};


let bn = exports.bn = (number) => new web3.utils.BN(number);
exports.wei = (number, unit) => web3.utils.toWei(bn(number), unit);
exports.ether = (number) => web3.utils.fromWei(bn(number), "ether");

exports.assertThrow = async (promise) => {
    try {
        await promise;
    } catch (error) {
        const revert = error.message.search('revert') >= 1;
        const invalidOpcode = error.message.search('invalid opcode') >= 1;

        assert(revert || invalidOpcode, `Expected throw, got \'${error}\' instead.`);
        return;
    }

    assert.fail('Expected throw not received');
};

exports.assertTypeError = async (promise) => {
    try {
        await promise;
    } catch (error) {
        const typeError = error.message.search('TypeError') >= -1;

        assert(typeError, `Expected TypeError, got \'${error}\' instead.`);
        return;
    }

    assert.fail('Expected TypeError not received');
};

function inLogs(logs, eventName, eventArgs = {}) {
    const event = logs.find(function (e) {
        if (e.event === eventName) {
            for (const [k, v] of Object.entries(eventArgs)) {
                assert.equal(e.args[k], v)
            }
            return true;
        }
    });
    assert.ok(event);
    return event;
}

exports.expectEvent = {inLogs: inLogs};

const jsonrpc = '2.0';
const id = 0;
const send = (method, params = []) => web3.currentProvider.send({id, jsonrpc, method, params});

exports.timeTravel = async function (seconds) {
    await send('evm_increaseTime', [seconds]);
    await send('evm_mine');
};

exports.mine = async function (blocks) {
    for (let i = 0; i < blocks; i++) await send('evm_mine');
};

exports.randomString = function () {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

exports.randomIntFromInterval = function (min, max) // min and max included
{
    return Math.floor(Math.random() * (max - min + 1) + min);
};

exports.randomAddress = function (privKey = exports.randomString()) {
    // Create the key pair container
    // `ec` is the secp256k1 utils
    let keyPair = ec.genKeyPair();

    // Set the privKey
    keyPair._importPrivate(privKey, 'hex');

    // Derive the pubKey
    let compact = false;
    let pubKey = keyPair.getPublic(compact, 'hex').slice(2);

    // pubKey -> address
    let pubKeyWordArray = CryptoJS.enc.Hex.parse(pubKey);
    let hash = CryptoJS.SHA3(pubKeyWordArray, {outputLength: 256});
    let address = hash.toString(CryptoJS.enc.Hex).slice(24);

    return "0x" + address;
};
