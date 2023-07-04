const cryptoForm = document.getElementById('cryptoForm');
const cryptoResult = document.getElementById('crypto-result');

cryptoForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const cryptoName = cryptoForm.elements.cryptoName.value;
    const url = "https://api.coingecko.com";
    const endpoint = "/api/v3/simple/price?";
    const coins = `ids=${cryptoName}&vs_currencies=usd&include_24hr_change=true`;

    try {
        const response = await fetch(`${url}${endpoint}${coins}`);
        const json = await response.json();
        const coinEmpty = Object.entries(json).length === 0;
        getCoinSuccess(json, coinEmpty);
    } catch (error) {
        console.log('Ocorreu um erro:', error.message);
    }
});

async function getCoinSuccess(json, coinEmpty = false) {
    cryptoResult.innerHTML = "";

    if (!coinEmpty) {
        const coinData = Object.entries(json);

        for (const [coin, coinDetails] of coinData) {
            const price = coinDetails.usd;
            const change = coinDetails.usd_24h_change;

            try {
                const imageUrl = await getImage(coin);
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
                            <span class="price">${price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
                            <span class="change">${change}</span>
                        </div>
                    </div>
                `;
            } catch (error) {
                console.log('An error occurred while obtaining the image', error.message);
            }
        }
    } else {
        cryptoResult.innerHTML += `
            <div class="coin-logo" mb-3>
                <img src="images/cheems-sad.jpg"></img>
            </div>
            <div class="coin-name" mb-3>
                <h3>Aii.. Não encontrei, eu sou versão <i>FREE</i></h3>
            </div>
            <div class="coin-price" mb-3>
                <p>Tente novamente por favor...<br><i>Escreva o nome da moeda completo, exemplo: Bitcoin</i></p>
            </div>
        `;
    }
}

async function getImage(crypto) {
    const url = "https://api.coingecko.com";
    const endpoint = "/api/v3/coins/";
    const coins = `${crypto}?localization=false&tickers=false&market_data=false&community_data=false&developer_data=false&sparkline=false`;

    try {
        const response = await fetch(`${url}${endpoint}${coins}`);
        const json = await response.json();
        const coinDetails = json;
        return coinDetails.image && coinDetails.image.large;
    } catch (error) {
        console.log('An error occurred while obtaining the image', error.message);
        throw error;
    }
}