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

getData = async function () {
    const address = document.getElementById('address').value;
    document.getElementById('totalLiquidity').innerHTML = "Working . . .";

    let cursor = null;
    let owners = [];
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
        owners.push({
        amount: owner.amount,
        owner: owner.owner_of,
        tokenId: owner.token_id,
        tokenAddress: owner.token_address,
        });
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
        ol.push({address: owners[i], ethBalance: (parseFloat(balance.balance) / 10**18).toFixed(2)});
    }

    let sorted = [];
    sorted = ol.sort(function(a,b,){return a.ethBalance - b.ethBalance});
    sorted = ol.reverse();

    console.log(sorted);
    console.log((totalLiquidity / 10**18).toFixed(2));
    let totalLiq = (totalLiquidity / 10**18).toFixed(2);

    document.getElementById('totalLiquidity').innerHTML = "Total Holder Liquidity: " + totalLiq + " ETH";
    document.getElementById('highestLiquidity').innerHTML = "Highest Holder Liquidity: " + sorted[0].address.owner + " " + sorted[0].ethBalance + " ETH";

    return ol;
}