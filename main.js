const appId = `5ATdkOvzAI57Q2ecQ6fmiuxqHOBa8LMU2uLelNCp`;
const serverUrl = `https://9lyxfyqintjx.usemoralis.com:2053/server`;

Moralis.initialize(appId);
Moralis.start({ serverUrl, appId });

//var web3 = new Web3(web3.currentProvider);
var user;


$(document).ready(function () {
    $("#search").click(getData);
    $("#mutual").click(getMutualHoldings);

});

login = async function () {
    await Moralis.Web3.authenticate();
}

getCachedData = async function (addr) {
    const address = addr;
    const dataQ = new Moralis.Query('Blockchain_Cache');
    dataQ.equalTo('contract_address', address);
    dataQ.descending('createdAt');
    const data = await dataQ.find();

    document.getElementById('name').innerHTML = data[0].attributes.summary.Name + " (" + data[0].attributes.summary.Symbol + ")";
    document.getElementById('lowestPrice').innerHTML = "Floor Price: " + data[0].attributes.summary.FloorPrice;
    document.getElementById('totalLiquidity').innerHTML = "Holders: " + data[0].attributes.summary.Holders;
}


getData = async function () {
   const address = document.getElementById('address').value.toLowerCase();
   getCachedData(address);
   let params = {address: address};
   let r = await Moralis.Cloud.run('getCollectionData', params);

   getCachedData(address);

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
    
    console.log(`mutual holders`, mutualHolders);
    document.getElementById('mutualLen').innerHTML = "Mutual Holders: " + mutualHolders.length;
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