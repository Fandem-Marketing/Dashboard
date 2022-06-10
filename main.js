
const appId = `5ATdkOvzAI57Q2ecQ6fmiuxqHOBa8LMU2uLelNCp`;
const serverUrl = `https://9lyxfyqintjx.usemoralis.com:2053/server`;

Moralis.initialize(appId);
Moralis.start({ serverUrl, appId });

//var web3 = new Web3(web3.currentProvider);
var user;


$(document).ready(function () {
    $("#search").click(getData);
    $("#mutual").click(getMutualHoldings);
    $("#deep").click(getDeepData);
});

login = async function () {
    await Moralis.Web3.authenticate();
}

getTxData = async function (txs) {
    for(let i = 0; i < txs.length; i++) {
        let params = {hash: txs[i]};
        let r = await Moralis.Cloud.run('get_tx_data', params);
        console.log(r);
    }
}

getCachedData = async function (addr, addr2) {
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


getData = async function (addr) {
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

    // params = {address: address2};
    // r = await Moralis.Cloud.run('getCollectionData', params);

    return 'gd done';
}


dig = async function (address) {
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

getMutualHoldings = async function (contract_address, contract_address_2) {
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

getMintRevenue = async function (addr) {
    const address = addr.toLowerCase();
    const options = {
        address: address,
        chain: "eth",
      };
      const nftTransfers = await Moralis.Web3API.token.getContractNFTTransfers(
        options
      );
}

getOtherHoldings = async function (addr) {
    const address = addr.toLowerCase();
    const dataQ = new Moralis.Query('Blockchain_Cache');
    dataQ.equalTo('contract_address', address);
    dataQ.descending('createdAt');
    dataQ.limit(1);
    const data = await dataQ.find();
    if(data.length == 0) {
        return 'contract not found';
    }
    let holderData = data[0].attributes.data;
    let holders = [];
    for(let i = 0; i < holderData.length; i++) {
        if(!holders.includes(holderData[i].owner)) {
            holders.push(holderData[i].owner);
        }
    }

    let otherHoldings = [];
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

getDeepData = async function (address) {
    let addr;
    // if(address != undefined) {
    //     addr = address.toLowerCase();
    // } else {
        addr = document.getElementById('address').value.toLowerCase();
    // }
    let r = await getData(addr);
    console.log(r);
    let r2 = await getOtherHoldings(addr);
    console.log(r2);
    let r3 = await getCachedData(addr);
    //console.log(r3);
}

getWalletData = async function (address) {
    const params = {address: address};
    const result = await Moralis.Cloud.run('get_wallet_data', params);
    console.log('wallet data',result);
}

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


