// const { ethers } = require("ethers");

import { Signer } from "https://cdn.ethers.io/lib/ethers-5.2.esm.min.js";
import { ethers } from "https://cdn.ethers.io/lib/ethers-5.2.esm.min.js";

const appId = `5ATdkOvzAI57Q2ecQ6fmiuxqHOBa8LMU2uLelNCp`;
const serverUrl = `https://9lyxfyqintjx.usemoralis.com:2053/server`;

Moralis.initialize(appId);
Moralis.start({ serverUrl, appId });

// var web3 = new Web3(web3.currentProvider);
// console.log(web3);
var user;

$(document).ready(function () {
    $("#search").click(getData);
    $("#mutual").click(getMutualHoldings);
    $("#deep").click(getDeepData);
    $("#deploy").click(deploy);
    $("#execute").click(execute);

});

 async function execute () {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contract = new ethers.Contract('0x366e3b64ef9060eb4b2b0908d7cd165c26312a23', FreeMint , signer );
    const func = document.getElementById('function').value;
    if(func == 'flipAL') {
        contract.flipALState();
    }
    if(func == 'flipSale') {
        contract.flipSaleState();
    }
}

const login = async function () {
    user = await Moralis.Web3.authenticate();
}

const getTxData = async function (txs) {
    for(let i = 0; i < txs.length; i++) {
        let params = {hash: txs[i]};
        let r = await Moralis.Cloud.run('get_tx_data', params);
        console.log(r);
    }
}

const getCachedData = async function (addr, addr2) {
    const address = addr;
    const dataQ = new Moralis.Query('Blockchain_Cache');
    dataQ.equalTo('address', address);
    dataQ.descending('createdAt');
    const data = await dataQ.find();
    if(data.length === 0) {
        return;
    }

    console.log(data[0].attributes);
    document.getElementById('name').innerHTML = data[0].attributes.data.name + " (" + data[0].attributes.data.symbol + ")";
    document.getElementById('supply').innerHTML = "Supply: " + data[0].attributes.data.supply;
    document.getElementById('lowestPrice').innerHTML = "Floor Price: " + data[0].attributes.data.floor_price;
    document.getElementById('totalLiquidity').innerHTML = "Holders: " + data[0].attributes.data.holder_wallets.length;
    document.getElementById('secondary').innerHTML = "Secondary Trades: " + data[0].attributes.data.secondary_trades;


    if(addr2 == undefined){ return; }

    const address2 = addr2;
    const dataQ2 = new Moralis.Query('Blockchain_Cache');
    dataQ2.equalTo('contract_address', address2);
    dataQ2.descending('createdAt');
    const data2 = await dataQ2.find();
    

    document.getElementById('name2').innerHTML = "<br/>" + data2[0].attributes.data.name + " (" + data2[0].attributes.data.symbol + ")";
    document.getElementById('supply2').innerHTML = "Supply: " + data2[0].attributes.data.supply;
    document.getElementById('lowestPrice2').innerHTML = "Floor Price: " + data2[0].attributes.data.floor_price;
    document.getElementById('secondary2').innerHTML = "Secondary Trades: " + data2[0].attributes.data.secondary_trades;

    getMutualHoldings(address, address2);

}


const getData = async function (addr) {
    let address;
    if(addr !== undefined) {
        address = addr;
    } // else {
        address = document.getElementById('address').value.toLowerCase();
        //const address2 = document.getElementById('address2').value.toLowerCase();
   // }


   document.getElementById('name').innerHTML = "Working . . .";

   //getCachedData(address, address2);

   getCachedData(address);
   let params = {address: address};
   let r = await Moralis.Cloud.run('getCollectionData', params);

   getContractTransfers(address);
    // params = {address: address2};
    // r = await Moralis.Cloud.run('getCollectionData', params);

    return 'gd done';
}


const dig = async function (address) {
    const addr = address.toLowerCase();

    const options = {
        chain: "eth",
        address: addr,
      };
      const NFTs = await Moralis.Web3API.account.getNFTs(options);

    let obj = {
        OtherHoldings: NFTs
    }

    return obj;

}

const getMutualHoldings = async function (contract_address, contract_address_2) {
    let addr1, addr2;
    if(contract_address == null || contract_address_2 == null) {
        addr1 = document.getElementById('address').value.toLowerCase();
        addr2 = document.getElementById('address2').value.toLowerCase();
    } else {
        addr1 = contract_address;
        addr2 = contract_address_2;
    }

    const dataQ = new Moralis.Query('Blockchain_Cache');
    dataQ.equalTo('contract_address', addr1);
    dataQ.descending('createdAt');
    dataQ.limit(1);
    const data = await dataQ.find();

    const dataQ2 = new Moralis.Query('Blockchain_Cache');
    dataQ2.equalTo('contract_address', addr2);
    dataQ2.descending('createdAt');
    dataQ2.limit(1);
    const data2 = await dataQ2.find();

    if(data.length == 0 || data2.length == 0) {
        return 'no data on this contract';
    }

    let mutualHolders = [];
    for(let i = 0; i < data[0].attributes.data.length; i++) {
        if(!mutualHolders.includes(data[0].attributes.data[i].owner)) {
            for(let j = 0; j < data2[0].attributes.data.length; j++) {
                if(data[0].attributes.data[i].owner == data2[0].attributes.data[j].owner) {
                    mutualHolders.push(data[0].attributes.data[i].owner);
                    break;
                }
            }
        }
    }
    
    document.getElementById('mutualLen').innerHTML = "<br/>" + "Mutual Holders " + "(" + data[0].attributes.data.Symbol + ") " + "<>" + " (" + data2[0].attributes.data.Symbol + ") :" + mutualHolders.length;
    return mutualHolders;
}

const getMintRevenue = async function (addr) {
    const address = addr.toLowerCase();
    const options = {
        address: address,
        chain: "eth",
      };
      const nftTransfers = await Moralis.Web3API.token.getContractNFTTransfers(
        options
      );
}

const getOtherHoldings = async function (addr) {
    const address = addr.toLowerCase();
    const dataQ = new Moralis.Query('Blockchain_Cache');
    dataQ.equalTo('address', address);
    dataQ.descending('createdAt');
    dataQ.limit(1);
    const data = await dataQ.find();
    if(data.length === 0) {
        return 'contract not found';
    }
    let holderData = data[0].attributes.data.holder_wallets;
    let holders = [];
    for(let i = 0; i < holderData.length; i++) {
        if(!holders.includes(holderData[i].owner)) {
            holders.push(holderData[i]);
        }
    }

    let otherHoldings = [];
    console.log(holders.length);
    for(let i = 0; i < holders.length; i++) {
        const options = {
            chain: "eth",
            address: holders[i],
        };

        const NFTs = await Moralis.Web3API.account.getNFTs(options);
        otherHoldings.push({
            address: holders[i],
            OtherHoldings: NFTs.result
        });
    }

    data[0].set('otherHoldings', otherHoldings);
    data[0].save();

    console.log(true);
    return 'goh done';
}

const getDeepData = async function (address) {
    let addr;
    // if(address != undefined) {
    //     addr = address.toLowerCase();
    // } else {
        addr = document.getElementById('address').value;
    // }
    let r = await getData(addr);
    console.log(r);
    let r2 = await getOtherHoldings(addr);
    console.log(r2);
    let r3 = await getCachedData(addr);
    //console.log(r3);
}

const getWalletData = async function (address) {
    const params = {address: address};
    const result = await Moralis.Cloud.run('get_wallet_data', params);
    console.log('wallet data',result);
}

const getContractTransfers = async function (address) {
    const add = address.toLowerCase();

    const options = {
        address: add,
        chain: "eth",
    };

    let cursor = null;
    let transfers = [];
    do {
        const nftTransfers = await Moralis.Web3API.token.getContractNFTTransfers({
            address: add,
            chain: "eth",
            limit: 100,
            cursor: cursor
        });

        cursor = nftTransfers.cursor;

        for(let i = 0; i < nftTransfers.result.length; i++) {
            transfers.push(nftTransfers.result[i]);
        }

    } while(cursor != "" && cursor != null);
    
    let mints = [];
    let uniqueTx = [];
    let initialMinters = [];
    let totalMintRevenue = 0;
    for(let i = 0; i < transfers.length; i++) {
        if(transfers[i].from_address == '0x0000000000000000000000000000000000000000') {
            mints.push(transfers[i]);
        }
        if(!uniqueTx.includes(transfers[i].transaction_hash) && transfers[i].from_address == '0x0000000000000000000000000000000000000000') {
            uniqueTx.push(transfers[i]);
            totalMintRevenue += parseFloat(transfers[i].value);
            initialMinters.push(transfers[i].to_address);
        }
    }
    const avgMintPrice = totalMintRevenue / transfers.length;

    // let mints = [];
    // for(let i = 0; i < uniqueTx.length; i++) {
    //     let params = {
    //         hash: uniqueTx[i]
    //     };

    //     let tx = await Moralis.Cloud.run('get_tx_data', params);

    //     console.log(tx);
    // }

    console.log('avg mint price',(avgMintPrice / 10**18).toFixed(2));
    console.log('total mint revenue',(totalMintRevenue / 10**18).toFixed(2));

    const q = new Moralis.Query('Blockchain_Cache');
    q.equalTo('address', add);
    q.descending('createdAt');
    q.limit(1);
    const r = await q.find();

    if(r.length > 0) {
        r[0].set('avgMintPrice',(avgMintPrice / 10**18).toFixed(2));
        r[0].set('totalMintRev', (totalMintRevenue / 10**18).toFixed(2));
        r[0].set('mints', mints);
        r[0].set('initialMinters', initialMinters);
        r[0].save();
    }

    return transfers;
}

const getSecondaryTxs = async function (address) {
    let cursor = null;
    let trades = [];
    let uniqueTrades = [];
    let totalVolume = 0;
    const test_hash = '0xe6009874145ed93e66bb2ba67e41e3ae737849a6ee7fa8d85ac779c8db27b581';
    do {
        const NFTTrades = await Moralis.Web3API.token.getNFTTrades( {
            address: address.toLowerCase(),
            limit: 100,
            chain: "eth",
            from_block: "0",
            cursor: cursor
        } );
        console.log(NFTTrades);


        cursor = NFTTrades.cursor;

        for(let i = 0; i < NFTTrades.result.length; i++) {
            if(NFTTrades.result[i].transaction_hash == test_hash){
                console.log('here!', NFTTrades.result[i]);
            }
            trades.push(NFTTrades.result[i]);
            totalVolume += parseFloat(NFTTrades.result[i].price);
            if(!uniqueTrades.includes(NFTTrades.result[i].transaction_hash)){
                uniqueTrades.push(NFTTrades.result[i].transaction_hash);
            }
        }

    } while(cursor != "" && cursor != null);

    const avgPrice = totalVolume / trades.length;
    
    console.log('total trades', trades.length);
    console.log('unique trades', uniqueTrades.length);
    console.log('avg price', (avgPrice / 10**18).toFixed(2));
    console.log('total volume', (totalVolume / 10**18).toFixed(2));
    console.log(trades);
    return trades;
}


async function deploy() {
    let contract = document.getElementById('ct').value;
    let name = document.getElementById('n').value;
    // console.log(name);
    let symbol = document.getElementById('s').value;
    let supply = document.getElementById('max').value;
    let uri = document.getElementById('uri').value;
    // console.log(contract);
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    console.log(signer);


    let abi, bc, factory, deployment;
    if(contract == 'fm') {
        abi = FreeMint;
        bc = FreeByteCode;
        factory = new ethers.ContractFactory(FreeMint, FreeByteCode, signer);
        deployment = await factory.deploy(name, symbol, supply, uri);
        //console.log(deployment);
    } else if (contract == 'pm') {
        let price = document.getElementById('price').value;
        let alprice = document.getElementById('alprice').value;

        if(parseFloat(price) < parseFloat(alprice)) {
            alert('Allow list price is higher than public price. This is not recommended.');
        }
        price = parseFloat(price) * 10**18;
        alprice = parseFloat(alprice) * 10**18;

        price = price.toString();
        alprice = alprice.toString();
        console.log('price', price);
        console.log('alprice', alprice);

        abi = PaidABI;
        bc = PaidByteCode;
        factory = new ethers.ContractFactory(abi, bc, signer);
        deployment = await factory.deploy(name, symbol, price, alprice, supply, uri);
    }

    const Project = Moralis.Object.extend('DeployedContracts');
    const proj = new Project();
    proj.set('owner', deployment.deployTransaction.from.toLowerCase());
    proj.set('address', deployment.address.toLowerCase());
    proj.save();
}


// deploy();
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


