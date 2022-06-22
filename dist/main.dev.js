"use strict";

var _ethers52EsmMin = require("https://cdn.ethers.io/lib/ethers-5.2.esm.min.js");

// const { ethers } = require("ethers");
var appId = "5ATdkOvzAI57Q2ecQ6fmiuxqHOBa8LMU2uLelNCp";
var serverUrl = "https://9lyxfyqintjx.usemoralis.com:2053/server";
Moralis.initialize(appId);
Moralis.start({
  serverUrl: serverUrl,
  appId: appId
}); // var web3 = new Web3(web3.currentProvider);
// console.log(web3);

var user;
$(document).ready(function () {
  $("#search").click(getData);
  $("#mutual").click(getMutualHoldings);
  $("#deep").click(getDeepData);
  $("#deploy").click(deploy);
});

var login = function login() {
  return regeneratorRuntime.async(function login$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(Moralis.Web3.authenticate());

        case 2:
          user = _context.sent;

        case 3:
        case "end":
          return _context.stop();
      }
    }
  });
};

var getTxData = function getTxData(txs) {
  var i, params, r;
  return regeneratorRuntime.async(function getTxData$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          i = 0;

        case 1:
          if (!(i < txs.length)) {
            _context2.next = 10;
            break;
          }

          params = {
            hash: txs[i]
          };
          _context2.next = 5;
          return regeneratorRuntime.awrap(Moralis.Cloud.run('get_tx_data', params));

        case 5:
          r = _context2.sent;
          console.log(r);

        case 7:
          i++;
          _context2.next = 1;
          break;

        case 10:
        case "end":
          return _context2.stop();
      }
    }
  });
};

var getCachedData = function getCachedData(addr, addr2) {
  var address, dataQ, data, address2, dataQ2, data2;
  return regeneratorRuntime.async(function getCachedData$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          address = addr;
          dataQ = new Moralis.Query('Blockchain_Cache');
          dataQ.equalTo('address', address);
          dataQ.descending('createdAt');
          _context3.next = 6;
          return regeneratorRuntime.awrap(dataQ.find());

        case 6:
          data = _context3.sent;

          if (!(data.length === 0)) {
            _context3.next = 9;
            break;
          }

          return _context3.abrupt("return");

        case 9:
          console.log(data[0].attributes);
          document.getElementById('name').innerHTML = data[0].attributes.data.name + " (" + data[0].attributes.data.symbol + ")";
          document.getElementById('supply').innerHTML = "Supply: " + data[0].attributes.data.supply;
          document.getElementById('lowestPrice').innerHTML = "Floor Price: " + data[0].attributes.data.floor_price;
          document.getElementById('totalLiquidity').innerHTML = "Holders: " + data[0].attributes.data.holder_wallets.length;
          document.getElementById('secondary').innerHTML = "Secondary Trades: " + data[0].attributes.data.secondary_trades;

          if (!(addr2 == undefined)) {
            _context3.next = 17;
            break;
          }

          return _context3.abrupt("return");

        case 17:
          address2 = addr2;
          dataQ2 = new Moralis.Query('Blockchain_Cache');
          dataQ2.equalTo('contract_address', address2);
          dataQ2.descending('createdAt');
          _context3.next = 23;
          return regeneratorRuntime.awrap(dataQ2.find());

        case 23:
          data2 = _context3.sent;
          document.getElementById('name2').innerHTML = "<br/>" + data2[0].attributes.data.name + " (" + data2[0].attributes.data.symbol + ")";
          document.getElementById('supply2').innerHTML = "Supply: " + data2[0].attributes.data.supply;
          document.getElementById('lowestPrice2').innerHTML = "Floor Price: " + data2[0].attributes.data.floor_price;
          document.getElementById('secondary2').innerHTML = "Secondary Trades: " + data2[0].attributes.data.secondary_trades;
          getMutualHoldings(address, address2);

        case 29:
        case "end":
          return _context3.stop();
      }
    }
  });
};

var getData = function getData(addr) {
  var address, params, r;
  return regeneratorRuntime.async(function getData$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          if (addr !== undefined) {
            address = addr;
          } // else {


          address = document.getElementById('address').value.toLowerCase(); //const address2 = document.getElementById('address2').value.toLowerCase();
          // }

          document.getElementById('name').innerHTML = "Working . . ."; //getCachedData(address, address2);

          getCachedData(address);
          params = {
            address: address
          };
          _context4.next = 7;
          return regeneratorRuntime.awrap(Moralis.Cloud.run('getCollectionData', params));

        case 7:
          r = _context4.sent;
          getContractTransfers(address); // params = {address: address2};
          // r = await Moralis.Cloud.run('getCollectionData', params);

          return _context4.abrupt("return", 'gd done');

        case 10:
        case "end":
          return _context4.stop();
      }
    }
  });
};

var dig = function dig(address) {
  var addr, options, NFTs, obj;
  return regeneratorRuntime.async(function dig$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          addr = address.toLowerCase();
          options = {
            chain: "eth",
            address: addr
          };
          _context5.next = 4;
          return regeneratorRuntime.awrap(Moralis.Web3API.account.getNFTs(options));

        case 4:
          NFTs = _context5.sent;
          obj = {
            OtherHoldings: NFTs
          };
          return _context5.abrupt("return", obj);

        case 7:
        case "end":
          return _context5.stop();
      }
    }
  });
};

var getMutualHoldings = function getMutualHoldings(contract_address, contract_address_2) {
  var addr1, addr2, dataQ, data, dataQ2, data2, mutualHolders, i, j;
  return regeneratorRuntime.async(function getMutualHoldings$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          if (contract_address == null || contract_address_2 == null) {
            addr1 = document.getElementById('address').value.toLowerCase();
            addr2 = document.getElementById('address2').value.toLowerCase();
          } else {
            addr1 = contract_address;
            addr2 = contract_address_2;
          }

          dataQ = new Moralis.Query('Blockchain_Cache');
          dataQ.equalTo('contract_address', addr1);
          dataQ.descending('createdAt');
          dataQ.limit(1);
          _context6.next = 7;
          return regeneratorRuntime.awrap(dataQ.find());

        case 7:
          data = _context6.sent;
          dataQ2 = new Moralis.Query('Blockchain_Cache');
          dataQ2.equalTo('contract_address', addr2);
          dataQ2.descending('createdAt');
          dataQ2.limit(1);
          _context6.next = 14;
          return regeneratorRuntime.awrap(dataQ2.find());

        case 14:
          data2 = _context6.sent;

          if (!(data.length == 0 || data2.length == 0)) {
            _context6.next = 17;
            break;
          }

          return _context6.abrupt("return", 'no data on this contract');

        case 17:
          mutualHolders = [];
          i = 0;

        case 19:
          if (!(i < data[0].attributes.data.length)) {
            _context6.next = 32;
            break;
          }

          if (mutualHolders.includes(data[0].attributes.data[i].owner)) {
            _context6.next = 29;
            break;
          }

          j = 0;

        case 22:
          if (!(j < data2[0].attributes.data.length)) {
            _context6.next = 29;
            break;
          }

          if (!(data[0].attributes.data[i].owner == data2[0].attributes.data[j].owner)) {
            _context6.next = 26;
            break;
          }

          mutualHolders.push(data[0].attributes.data[i].owner);
          return _context6.abrupt("break", 29);

        case 26:
          j++;
          _context6.next = 22;
          break;

        case 29:
          i++;
          _context6.next = 19;
          break;

        case 32:
          document.getElementById('mutualLen').innerHTML = "<br/>" + "Mutual Holders " + "(" + data[0].attributes.data.Symbol + ") " + "<>" + " (" + data2[0].attributes.data.Symbol + ") :" + mutualHolders.length;
          return _context6.abrupt("return", mutualHolders);

        case 34:
        case "end":
          return _context6.stop();
      }
    }
  });
};

var getMintRevenue = function getMintRevenue(addr) {
  var address, options, nftTransfers;
  return regeneratorRuntime.async(function getMintRevenue$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          address = addr.toLowerCase();
          options = {
            address: address,
            chain: "eth"
          };
          _context7.next = 4;
          return regeneratorRuntime.awrap(Moralis.Web3API.token.getContractNFTTransfers(options));

        case 4:
          nftTransfers = _context7.sent;

        case 5:
        case "end":
          return _context7.stop();
      }
    }
  });
};

var getOtherHoldings = function getOtherHoldings(addr) {
  var address, dataQ, data, holderData, holders, i, otherHoldings, _i, options, NFTs;

  return regeneratorRuntime.async(function getOtherHoldings$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          address = addr.toLowerCase();
          dataQ = new Moralis.Query('Blockchain_Cache');
          dataQ.equalTo('contract_address', address);
          dataQ.descending('createdAt');
          dataQ.limit(1);
          _context8.next = 7;
          return regeneratorRuntime.awrap(dataQ.find());

        case 7:
          data = _context8.sent;

          if (!(data.length == 0)) {
            _context8.next = 10;
            break;
          }

          return _context8.abrupt("return", 'contract not found');

        case 10:
          holderData = data[0].attributes.data;
          holders = [];

          for (i = 0; i < holderData.length; i++) {
            if (!holders.includes(holderData[i].owner)) {
              holders.push(holderData[i].owner);
            }
          }

          otherHoldings = [];
          _i = 0;

        case 15:
          if (!(_i < holders.length)) {
            _context8.next = 24;
            break;
          }

          options = {
            chain: "eth",
            address: holders[_i]
          };
          _context8.next = 19;
          return regeneratorRuntime.awrap(Moralis.Web3API.account.getNFTs(options));

        case 19:
          NFTs = _context8.sent;
          otherHoldings.push({
            address: holders[_i],
            OtherHoldings: NFTs.result
          });

        case 21:
          _i++;
          _context8.next = 15;
          break;

        case 24:
          data[0].set('otherHoldings', otherHoldings);
          data[0].save();
          console.log(true);
          return _context8.abrupt("return", 'goh done');

        case 28:
        case "end":
          return _context8.stop();
      }
    }
  });
};

var getDeepData = function getDeepData(address) {
  var addr, r, r2, r3;
  return regeneratorRuntime.async(function getDeepData$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          // if(address != undefined) {
          //     addr = address.toLowerCase();
          // } else {
          addr = document.getElementById('address').value.toLowerCase(); // }

          _context9.next = 3;
          return regeneratorRuntime.awrap(getData(addr));

        case 3:
          r = _context9.sent;
          console.log(r);
          _context9.next = 7;
          return regeneratorRuntime.awrap(getOtherHoldings(addr));

        case 7:
          r2 = _context9.sent;
          console.log(r2);
          _context9.next = 11;
          return regeneratorRuntime.awrap(getCachedData(addr));

        case 11:
          r3 = _context9.sent;

        case 12:
        case "end":
          return _context9.stop();
      }
    }
  });
};

var getWalletData = function getWalletData(address) {
  var params, result;
  return regeneratorRuntime.async(function getWalletData$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          params = {
            address: address
          };
          _context10.next = 3;
          return regeneratorRuntime.awrap(Moralis.Cloud.run('get_wallet_data', params));

        case 3:
          result = _context10.sent;
          console.log('wallet data', result);

        case 5:
        case "end":
          return _context10.stop();
      }
    }
  });
};

var getContractTransfers = function getContractTransfers(address) {
  var add, options, cursor, transfers, nftTransfers, i, mints, uniqueTx, initialMinters, totalMintRevenue, _i2, avgMintPrice, q, r;

  return regeneratorRuntime.async(function getContractTransfers$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          add = address.toLowerCase();
          options = {
            address: add,
            chain: "eth"
          };
          cursor = null;
          transfers = [];

        case 4:
          _context11.next = 6;
          return regeneratorRuntime.awrap(Moralis.Web3API.token.getContractNFTTransfers({
            address: add,
            chain: "eth",
            limit: 100,
            cursor: cursor
          }));

        case 6:
          nftTransfers = _context11.sent;
          cursor = nftTransfers.cursor;

          for (i = 0; i < nftTransfers.result.length; i++) {
            transfers.push(nftTransfers.result[i]);
          }

        case 9:
          if (cursor != "" && cursor != null) {
            _context11.next = 4;
            break;
          }

        case 10:
          mints = [];
          uniqueTx = [];
          initialMinters = [];
          totalMintRevenue = 0;

          for (_i2 = 0; _i2 < transfers.length; _i2++) {
            if (transfers[_i2].from_address == '0x0000000000000000000000000000000000000000') {
              mints.push(transfers[_i2]);
            }

            if (!uniqueTx.includes(transfers[_i2].transaction_hash) && transfers[_i2].from_address == '0x0000000000000000000000000000000000000000') {
              uniqueTx.push(transfers[_i2]);
              totalMintRevenue += parseFloat(transfers[_i2].value);
              initialMinters.push(transfers[_i2].to_address);
            }
          }

          avgMintPrice = totalMintRevenue / transfers.length; // let mints = [];
          // for(let i = 0; i < uniqueTx.length; i++) {
          //     let params = {
          //         hash: uniqueTx[i]
          //     };
          //     let tx = await Moralis.Cloud.run('get_tx_data', params);
          //     console.log(tx);
          // }

          console.log('avg mint price', (avgMintPrice / Math.pow(10, 18)).toFixed(2));
          console.log('total mint revenue', (totalMintRevenue / Math.pow(10, 18)).toFixed(2));
          q = new Moralis.Query('Blockchain_Cache');
          q.equalTo('address', add);
          q.descending('createdAt');
          q.limit(1);
          _context11.next = 24;
          return regeneratorRuntime.awrap(q.find());

        case 24:
          r = _context11.sent;

          if (r.length > 0) {
            r[0].set('avgMintPrice', (avgMintPrice / Math.pow(10, 18)).toFixed(2));
            r[0].set('totalMintRev', (totalMintRevenue / Math.pow(10, 18)).toFixed(2));
            r[0].set('mints', mints);
            r[0].set('initialMinters', initialMinters);
            r[0].save();
          }

          return _context11.abrupt("return", transfers);

        case 27:
        case "end":
          return _context11.stop();
      }
    }
  });
};

var getSecondaryTxs = function getSecondaryTxs(address) {
  var cursor, trades, uniqueTrades, totalVolume, test_hash, NFTTrades, i, avgPrice;
  return regeneratorRuntime.async(function getSecondaryTxs$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          cursor = null;
          trades = [];
          uniqueTrades = [];
          totalVolume = 0;
          test_hash = '0xe6009874145ed93e66bb2ba67e41e3ae737849a6ee7fa8d85ac779c8db27b581';

        case 5:
          _context12.next = 7;
          return regeneratorRuntime.awrap(Moralis.Web3API.token.getNFTTrades({
            address: address.toLowerCase(),
            limit: 100,
            chain: "eth",
            from_block: "0",
            cursor: cursor
          }));

        case 7:
          NFTTrades = _context12.sent;
          console.log(NFTTrades);
          cursor = NFTTrades.cursor;

          for (i = 0; i < NFTTrades.result.length; i++) {
            if (NFTTrades.result[i].transaction_hash == test_hash) {
              console.log('here!', NFTTrades.result[i]);
            }

            trades.push(NFTTrades.result[i]);
            totalVolume += parseFloat(NFTTrades.result[i].price);

            if (!uniqueTrades.includes(NFTTrades.result[i].transaction_hash)) {
              uniqueTrades.push(NFTTrades.result[i].transaction_hash);
            }
          }

        case 11:
          if (cursor != "" && cursor != null) {
            _context12.next = 5;
            break;
          }

        case 12:
          avgPrice = totalVolume / trades.length;
          console.log('total trades', trades.length);
          console.log('unique trades', uniqueTrades.length);
          console.log('avg price', (avgPrice / Math.pow(10, 18)).toFixed(2));
          console.log('total volume', (totalVolume / Math.pow(10, 18)).toFixed(2));
          console.log(trades);
          return _context12.abrupt("return", trades);

        case 19:
        case "end":
          return _context12.stop();
      }
    }
  });
};

function deploy() {
  var contract, name, symbol, supply, uri, provider, signer, abi, bc, factory, deployment, price, alprice;
  return regeneratorRuntime.async(function deploy$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          contract = document.getElementById('ct').value;
          name = document.getElementById('n').value;
          console.log(name);
          symbol = document.getElementById('s').value;
          supply = document.getElementById('max').value;
          uri = document.getElementById('uri').value;
          console.log(contract);
          provider = new _ethers52EsmMin.ethers.providers.Web3Provider(window.ethereum);
          _context13.next = 10;
          return regeneratorRuntime.awrap(provider.send("eth_requestAccounts", []));

        case 10:
          signer = provider.getSigner();

          if (!(contract == 'fm')) {
            _context13.next = 20;
            break;
          }

          abi = FreeMint;
          bc = FreeByteCode;
          factory = new _ethers52EsmMin.ethers.ContractFactory(FreeMint, FreeByteCode, signer);
          _context13.next = 17;
          return regeneratorRuntime.awrap(factory.deploy(name, symbol, supply, uri));

        case 17:
          deployment = _context13.sent;
          _context13.next = 36;
          break;

        case 20:
          if (!(contract == 'pm')) {
            _context13.next = 36;
            break;
          }

          price = document.getElementById('price').value;
          alprice = document.getElementById('alprice').value;

          if (parseFloat(price) < parseFloat(alprice)) {
            alert('Allow list price is higher than public price. This is not recommended.');
          }

          price = parseFloat(price) * Math.pow(10, 18);
          alprice = parseFloat(alprice) * Math.pow(10, 18);
          price = price.toString();
          alprice = alprice.toString();
          console.log('price', price);
          console.log('alprice', alprice);
          abi = PaidABI;
          bc = PaidByteCode;
          factory = new _ethers52EsmMin.ethers.ContractFactory(abi, bc, signer);
          _context13.next = 35;
          return regeneratorRuntime.awrap(factory.deploy(name, symbol, price, alprice, supply, uri));

        case 35:
          deployment = _context13.sent;

        case 36:
        case "end":
          return _context13.stop();
      }
    }
  });
} // deploy();
// Contract
// {
// address: string;
// 	holder_wallets: string[]; (maps to Wallet)
// name: string;
// symbol: string;
// }
// Wallet
// {
// 	address: string;
// 	projects_owned: string[]; (maps to Contract)
// 	balance: number;
// 	transaction_hashes: string[]; (maps to Transaction)
// }
// Transactions 
// {
// 	hash: string;
// 	to: string;
// 	from: string;
// 	value: number;
// 	timestamp: number;
// 	events?: {
// 		name: string;
// 		token_id: number;
// 	}
// }