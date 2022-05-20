
const appId = `5ATdkOvzAI57Q2ecQ6fmiuxqHOBa8LMU2uLelNCp`;
const serverUrl = `https://9lyxfyqintjx.usemoralis.com:2053/server`;

Moralis.initialize(appId);
Moralis.start({ serverUrl, appId });

var web3 = new Web3(web3.currentProvider);
var user;


$(document).ready(function () {
    window.ethereum.enable().then(function(accounts) {
      
        $("#search").click(getData);
    });
});

getCachedData = async function () {
     // get eth price     
     const options = {
        address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        chain: "eth",
        exchange: "uniswap-v3",
    };
    let price = await Moralis.Web3API.token.getTokenPrice(options);
    price = price.usdPrice;

    const address = document.getElementById('address').value;
    document.getElementById('totalLiquidity').innerHTML = "Working . . .";

    const dataQ = new Moralis.Query('Blockchain_Cache');
    dataQ.equalTo('contract_address', address);
    dataQ.descending('createdAt');
    const data = await dataQ.find();
    if(data.length > 0) {
        console.log(data);
        document.getElementById('totalLiquidity').innerHTML = "Holders: " + data[0].attributes.summary.Holders + " | Total Holder Liquidity: " + data[0].attributes.summary.HolderLiquidity + " ETH | " + "$" + data[0].attributes.summary.HolderLiquidityUSD;
        document.getElementById('highestLiquidity').innerHTML = "Highest Holder Liquidity: " + data[0].attributes.summary.HighestHolderLiquidity.Address + " " + data[0].attributes.summary.HighestHolderLiquidity.Liquidity + " ETH";
    
        let cursor = null;
        let owners = [];
        let addresses = [];
        do {
        const response = await Moralis.Web3API.token.getNFTOwners({
            address: address,
            chain: "eth",
            limit: 500,
            cursor: cursor,
        });
        console.log(
            `Got page ${response.page} of ${Math.ceil(
            response.total / response.page_size
            )}, ${response.total} total`
        );
        for (const owner of response.result) {
            if(!addresses.includes(owner.owner_of)){
                addresses.push(owner.owner_of);
                owners.push({
                amount: owner.amount,
                owner: owner.owner_of,
                tokenId: owner.token_id,
                tokenAddress: owner.token_address,
                });
            }
        }
        cursor = response.cursor;
        } while (cursor != "" && cursor != null);
        console.log(cursor);
        let ol = [];

        console.log(owners.length);
        let totalLiquidity = 0;
        for(let i = 0; i < owners.length; i++){
            const options = {
            chain: "eth",
            address: owners[i].owner
            };
            const balance = await Moralis.Web3API.account.getNativeBalance(options);
            totalLiquidity += parseFloat(balance.balance);
            let totalLiq = (totalLiquidity / 10**18).toFixed(2);
            //document.getElementById('totalLiquidity').innerHTML = "Total Holder Liquidity: " + totalLiq + " ETH | " + "$" + (price * totalLiq).toFixed(2);
            ol.push({address: owners[i], ethBalance: (parseFloat(balance.balance) / 10**18).toFixed(2)});
        }
    }
}
getData = async function () {

    // get eth price     
     const options = {
        address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        chain: "eth",
        exchange: "uniswap-v3",
    };
    let price = await Moralis.Web3API.token.getTokenPrice(options);
    price = price.usdPrice;

    const address = document.getElementById('address').value;
    const opt = {
        address: address,
    };

    const op = {
        address: address,
        chain: "eth",
      };
    const metaData = await Moralis.Web3API.token.getNFTMetadata(op);
    console.log(metaData);
    document.getElementById('name').innerHTML = "Name: " + metaData.name;

    const NFTLowestPrice = await Moralis.Web3API.token.getNFTLowestPrice(opt);
    let lowestPrice = (parseFloat(NFTLowestPrice.price) / 10**18).toFixed(2);
    document.getElementById('lowestPrice').innerHTML = "Lowest Price: " + lowestPrice + " ETH";

    document.getElementById('totalLiquidity').innerHTML = "Working . . .";

    const dataQ = new Moralis.Query('Blockchain_Cache');
    dataQ.equalTo('contract_address', address);
    dataQ.descending('createdAt');
    const data = await dataQ.find();
    if(data.length > 0) {
        console.log(data);
        document.getElementById('totalLiquidity').innerHTML = "Holders: " + data[0].attributes.summary.Holders + " | Total Holder Liquidity: " + data[0].attributes.summary.HolderLiquidity + " ETH | " + "$" + data[0].attributes.summary.HolderLiquidityUSD;
        document.getElementById('highestLiquidity').innerHTML = "Highest Holder Liquidity: " + data[0].attributes.summary.HighestHolderLiquidity.Address + " " + data[0].attributes.summary.HighestHolderLiquidity.Liquidity + " ETH";
    
        let cursor = null;
        let owners = [];
        let addresses = [];
        do {
        const response = await Moralis.Web3API.token.getNFTOwners({
            address: address,
            chain: "eth",
            limit: 500,
            cursor: cursor,
        });
        console.log(
            `Got page ${response.page} of ${Math.ceil(
            response.total / response.page_size
            )}, ${response.total} total`
        );
        for (const owner of response.result) {
            if(!addresses.includes(owner.owner_of)){
                addresses.push(owner.owner_of);
                owners.push({
                amount: owner.amount,
                owner: owner.owner_of,
                tokenId: owner.token_id,
                tokenAddress: owner.token_address,
                });
            }
        }
        cursor = response.cursor;
        } while (cursor != "" && cursor != null);
        console.log(cursor);
        let ol = [];

        console.log(owners.length);
        let totalLiquidity = 0;
        for(let i = 0; i < owners.length; i++){
            const options = {
            chain: "eth",
            address: owners[i].owner
            };
            const balance = await Moralis.Web3API.account.getNativeBalance(options);
            totalLiquidity += parseFloat(balance.balance);
            let totalLiq = (totalLiquidity / 10**18).toFixed(2);
            //document.getElementById('totalLiquidity').innerHTML = "Total Holder Liquidity: " + totalLiq + " ETH | " + "$" + (price * totalLiq).toFixed(2);
            ol.push({address: owners[i], ethBalance: (parseFloat(balance.balance) / 10**18).toFixed(2)});
        }

    const Project = Moralis.Object.extend('Blockchain_Cache');
    const project = new Project();

        let sorted = [];
        sorted = ol.sort(function(a,b,){return a.ethBalance - b.ethBalance});
        sorted = ol.reverse();

        project.set('data', sorted);
        project.set('contract_address', address);
        

        console.log(sorted);
        console.log((totalLiquidity / 10**18).toFixed(2));
        let totalLiq = (totalLiquidity / 10**18).toFixed(2);

        let summary = {
            "Holders": sorted.length,
            "HolderLiquidity": totalLiq,
            "HolderLiquidityUSD": (price * totalLiq).toFixed(2),
            "HighestHolderLiquidity": {"Address":sorted[0].address.owner, "Liquidity": sorted[0].ethBalance}
        }
        project.set('summary', summary);
        project.save();
        document.getElementById('totalLiquidity').innerHTML = "Holders: " + data[0].attributes.summary.Holders + " | Total Holder Liquidity: " + data[0].attributes.summary.HolderLiquidity + " ETH | " + "$" + data[0].attributes.summary.HolderLiquidityUSD;
        document.getElementById('highestLiquidity').innerHTML = "Highest Holder Liquidity: " + data[0].attributes.summary.HighestHolderLiquidity.Address + " " + data[0].attributes.summary.HighestHolderLiquidity.Liquidity + " ETH";
    } else {
        let cursor = null;
        let owners = [];
        let addresses = [];
        do {
        const response = await Moralis.Web3API.token.getNFTOwners({
            address: address,
            chain: "eth",
            limit: 500,
            cursor: cursor,
        });
        console.log(
            `Got page ${response.page} of ${Math.ceil(
            response.total / response.page_size
            )}, ${response.total} total`
        );
        for (const owner of response.result) {
            if(!addresses.includes(owner.owner_of)){
                addresses.push(owner.owner_of);
                owners.push({
                amount: owner.amount,
                owner: owner.owner_of,
                tokenId: owner.token_id,
                tokenAddress: owner.token_address,
                });
            }
        }
        cursor = response.cursor;
        } while (cursor != "" && cursor != null);
        console.log(cursor);
        let ol = [];

        console.log(owners.length);
        let totalLiquidity = 0;
        for(let i = 0; i < owners.length; i++){
            const options = {
            chain: "eth",
            address: owners[i].owner
            };
            const balance = await Moralis.Web3API.account.getNativeBalance(options);
            totalLiquidity += parseFloat(balance.balance);
            let totalLiq = (totalLiquidity / 10**18).toFixed(2);
            //document.getElementById('totalLiquidity').innerHTML = "Total Holder Liquidity: " + totalLiq + " ETH | " + "$" + (price * totalLiq).toFixed(2);
            ol.push({address: owners[i], ethBalance: (parseFloat(balance.balance) / 10**18).toFixed(2)});
        }

    const Project = Moralis.Object.extend('Blockchain_Cache');
    const project = new Project();

        let sorted = [];
        sorted = ol.sort(function(a,b,){return a.ethBalance - b.ethBalance});
        sorted = ol.reverse();

        project.set('data', sorted);
        project.set('contract_address', address);
        

        console.log(sorted);
        console.log((totalLiquidity / 10**18).toFixed(2));
        let totalLiq = (totalLiquidity / 10**18).toFixed(2);

        let summary = {
            "Holders": sorted.length,
            "HolderLiquidity": totalLiq,
            "HolderLiquidityUSD": (price * totalLiq).toFixed(2),
            "HighestHolderLiquidity": {"Address":sorted[0].address.owner, "Liquidity": sorted[0].ethBalance}
        }
        project.set('summary', summary);
        project.save();
        getCachedData();
        //document.getElementById('totalLiquidity').innerHTML = "Holders: " + data[0].attributes.summary.Holders + " | Total Holder Liquidity: " + data[0].attributes.summary.HolderLiquidity + " ETH | " + "$" + data[0].attributes.summary.HolderLiquidityUSD;
        //document.getElementById('highestLiquidity').innerHTML = "Highest Holder Liquidity: " + data[0].attributes.summary.HighestHolderLiquidity.Address + " " + data[0].attributes.summary.HighestHolderLiquidity.Liquidity + " ETH";
    }
}

dig = async function (address) {
    const addr = address.toLowerCase();


}