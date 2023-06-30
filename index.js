const cryptoForm = document.getElementById('cryptoForm');
const cryptoResult = document.getElementById('crypto-result');

cryptoForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const cryptoName = cryptoForm.elements.cryptoName.value;
    const url = "https://api.coingecko.com";
    const endpoint = "/api/v3/simple/price?";
    const coins = `ids=${cryptoName}&vs_currencies=usd&include_24hr_change=true`;

    fetch(`${url}${endpoint}${coins}`)
        .then(res => res.json())
        .then(json => {
            const coinData = Object.entries(json);
            cryptoResult.innerHTML = ""; // Limpar o conteúdo anterior

            coinData.forEach(([coin, coinDetails]) => {
                const price = coinDetails.usd;
                const change = coinDetails.usd_24h_change;

                getImage(coin)
                    .then(imageUrl => {
                        cryptoResult.innerHTML += `
                            <div class="coin ${change < 0 ? 'down' : 'up'}">
                                <div class="coin-logo" mb-3>
                                    <img src="${imageUrl}"></img>
                                </div>
                                <div class="coin-name" mb-3>
                                    <h3>${coin}</h3>
                                    <span>/USD</span>
                                </div>
                                <div class="coin-price" mb-3>
                                    <span class="price">$${price.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}</span>
                                    <span class="change">$${change}</span>
                                </div>
                            </div>                    
                        `;
                    });
            });
        });
});

function getImage(crypto) {
    const url = "https://api.coingecko.com";
    const endpoint = "/api/v3/coins/";
    const coins = `${crypto}?localization=false&tickers=false&market_data=false&community_data=false&developer_data=false&sparkline=false`;

    return fetch(`${url}${endpoint}${coins}`)
        .then(res => res.json())
        .then(json => {
            const coinDetails = json;
            return coinDetails.image && coinDetails.image.large;
        });
}
