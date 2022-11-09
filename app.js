const Web3 = require('web3');
let fs = require('fs')

// Do not share mnemonic 12 words
let mnemonic = "novel shrug fatigue group winter nasty chimney usual smart snack talk already";
// Số lượng ngày mint
let mintTerm = 300;
const { Wallet } = require('ethers');


const BSC_CHAIN_MAINNET = 56;
const BSC_CHAIN_TESTNET = 97;
const ETH_CHAIN_MAINNET = 1;
const ETH_CHAIN_TESTNET = 1;
const FANTOM_CHAIN_MAINNET = 250;
const FANTOM_CHAIN_TESTNET = 4002;
const DOGE_CHAIN_MAINNET = 2000;
const DOGE_CHAIN_TESTNET = 1;
const CLAIM_TYPE_SEND_TOKEN_TO_ALL_ADDRESS = 0;
const CLAIM_TYPE_CLAIM_RANK = 1;
const CLAIM_TYPE_CLAIM_MINT_REWARD = 2;
const CLAIM_TYPE_CLAIM_MINT_REWARD_AND_SHARE = 3;
const CLAIM_TYPE_CLAIM_MINT_REWARD_AND_STAKE = 4;

function getResponse(url) {
    operUrl = urllib.request.urlopen(url)
    if (operUrl.getcode() == 200) {
        data = operUrl.read()
        jsonData = json.loads(data)
    } else {
        console.log("Error receiving data", operUrl.getcode())
    }
    return jsonData
}

function sendCoin(web3, chainId, currentIndex, masterIndex, numberOfAddress, value, gasPrice) {
    console.log("Send coin to wallet");
    let masterAddress = Wallet.fromMnemonic(mnemonic, `m/44'/60'/0'/0/{masterIndex}`);

    // console.log(w3.eth.get_balance(masterAddress.address,'latest'));
    nonce = web3.eth.getTransactionCount(masterAddress.address)
    for (let i = currentIndex; i < currentIndex + numberOfAddress; i++) {
        try {
            if (i === masterIndex) continue;
            acc = Wallet.fromMnemonic(mnemonic, `m/44'/60'/0'/0/{i}`);
            balance = web3.eth.get_balance(acc.address, 'latest')
            console.log('Index: {0} | Address: {1} | Balance: {2}'.format(i, acc.address, balance))

            // Set gas price strategy
            web3.eth.setGasPriceStrategy(medium_gas_price_strategy)

            if (web3.fromWei(21000 * gasPrice, "wei") > web3.fromWei(balance, "wei")) {
                // Calculate gas estimate
                gasEstimate = web3.eth.estimateGas({ "to": acc.address, "from": masterAddress.address, "value": value })
                // Construct a raw transaction
                raw_tx = {
                    'chainId': chainId,
                    "to": acc.address,
                    "from": masterAddress.address,
                    "value": value,
                    "gas": web3.toHex(gasEstimate),
                    "gasPrice": web3.toHex(gasPrice),
                    "nonce": web3.toHex(nonce)
                }

                // Sign the raw transaction with ethereum account
                signed_tx = masterAddress.signTransaction(raw_tx)
                // Send the signed transactions
                web3.eth.sendRawTransaction(signed_tx.rawTransaction)
                // time.sleep(15)
                console.log("Send Done! " + masterAddress.address + " --> " + acc.address + " : (" + str(value) + ")")
                nonce = nonce + 1
            }
            i = i + 1
        } catch (ex) {
            console.log("Send Failed! " + masterAddress.address + " --> " + acc.address + " : (" + str(value) + ")")
            console.log(ex)
            time.sleep(15)
            nonce = nonce + 1
        }
    }
}

function sendTokenToMultiAddress(web3, chainId, currentIndex, fromAddressIndex, numberOfAddress, value, gasPrice) {
    console.log("Send coin to wallet");
    let fromAddress = Wallet.fromMnemonic(mnemonic, `m/44'/60'/0'/0/{fromAddressIndex}`);

    // console.log(w3.eth.get_balance(masterAddress.address,'latest'));
    nonce = web3.eth.getTransactionCount(fromAddress.address);
    for (let toAddressIndex = currentIndex; toAddressIndex < currentIndex + numberOfAddress; toAddressIndex++) {
        if (toAddressIndex === fromAddressIndex) continue;
        let toAddress = Wallet.fromMnemonic(mnemonic, `m/44'/60'/0'/0/{toAddressIndex}`);
        balance = web3.eth.getBalance(toAddress.address, 'latest')
        console.log('Index: {0} | Address: {1} | Balance: {2}'.format(toAddressIndex, toAddress.address, balance))

        // Set gas price strategy
        web3.eth.setGasPriceStrategy(medium_gas_price_strategy)

        if (web3.utils.fromWei(21000 * gasPrice, "wei") > web3.utils.fromWei(balance, "wei")) {
            // Calculate gas estimate
            let gasEstimate = web3.eth.estimateGas({ "to": toAddress.address, "from": fromAddress.address, "value": value })
            // Construct a raw transaction
            let rawTx = {
                'chainId': chainId,
                "from": fromAddress.address,
                "to": toAddress.address,
                "value": value,
                "gas": web3.toHex(gasEstimate),
                "gasPrice": web3.toHex(gasPrice),
                "nonce": web3.toHex(nonce)
            }

            // Sign the raw transaction with ethereum account
            signed_tx = fromAddress.signTransaction(rawTx)
            // Send the signed transactions
            web3.eth.sendRawTransaction(signed_tx.rawTransaction)
            // time.sleep(15)
            console.log("Send Done! " + fromAddress.address + " --> " + toAddress.address + " : (" + str(value) + ")")
            nonce = nonce + 1
        }
    }
}

function claim(claimType, web3, chainId, currentIndex, masterIndex, numberOfAddress, value, gasPrice, contract, data, gasPriceX = 8, gasPriceY = 1, website = "", api_key = "") {
    console.log("Mint coin to wallet")
    let masterAddress = Wallet.fromMnemonic(mnemonic, `m/44'/60'/0'/0/{masterIndex}`);

    nonce = web3.eth.getTransactionCount(masterAddress.address)
    for (let i = currentIndex; i < currentIndex + numberOfAddress; i++) {
        try {
            if (i === masterIndex) continue;
            acc = Wallet.fromMnemonic(mnemonic, `m/44'/60'/0'/0/{i}`);
            balance = web3.eth.get_balance(acc.address, 'latest')
            console.log('Index: {0} | Address: {1} | Balance: {2}'.format(i, acc.address, balance))

            // Set gas price strategy
            web3.eth.setGasPriceStrategy(medium_gas_price_strategy)

            if (web3.fromWei(21000 * gasPrice, "wei") > web3.fromWei(balance, "wei")) {
                // Calculate gas estimate
                gasEstimate = web3.eth.estimateGas({ "to": acc.address, "from": masterAddress.address, "value": value })
                // Construct a raw transaction
                raw_tx = {
                    'chainId': chainId,
                    "to": acc.address,
                    "from": masterAddress.address,
                    "value": value,
                    "gas": web3.toHex(gasEstimate),
                    "gasPrice": web3.toHex(gasPrice),
                    "nonce": web3.toHex(nonce)
                }

                // Sign the raw transaction with ethereum account
                signed_tx = masterAddress.signTransaction(raw_tx)
                // Send the signed transactions
                web3.eth.sendRawTransaction(signed_tx.rawTransaction)
                // time.sleep(15)
                console.log("Send Done! " + masterAddress.address + " --> " + acc.address + " : (" + str(value) + ")")
                nonce = nonce + 1
            }

            balance == web3.eth.get_balance(acc.address, 'latest')
            methodId = ""
            timeStamp = 0
            mint_time_cal = 0
            functionName = ""
            date = datetime.now()
            url = website + "api?module=account&action=txlist&address=" + acc.address + "&startblock=0&endblock=99999999&page=1&offset=100&sort=desc&apikey=" + api_key
            jsonData = getResponse(url)
            for (ts in jsonData["result"]) {
                if (ts['to'].upper() == contract.upper()) {
                    methodId = ts['methodId']
                    timeStamp = ts['timeStamp']
                    functionName = ts['functionName']
                    if (methodId == '0x9ff054df') {
                        date = datetime.fromtimestamp(int(timeStamp))
                        mint_time_cal = 0x9ff054df000000000000000000000000000000000000000000000000000000000000001e - 0x9ff054df0000000000000000000000000000000000000000000000000000000000000000
                    }
                    break
                }
            }
            if (((claimType == 1) && (methodId != '0x9ff054df'))
                || ((claimType > 1) && (methodId == '0x9ff054df') && (int(time.time()) - (mint_time_cal * 60 * 60 * 24) >= int(timeStamp)))) {
                gasEstimate = web3.eth.estimate_gas({ 'to': acc.address, 'from': masterAddress.address, 'value': 1 })
                // Construct a raw transaction
                raw_tx = {
                    'chainId': chainId,
                    "data": web3.toHex(data),
                    "to": contract,
                    "from": acc.address,
                    "value": web3.toHex(0),
                    "gas": web3.toHex(gasEstimate * gasPriceX),
                    "gasPrice": web3.toHex(web3.toWei(gasPriceY, "gwei")),
                    "nonce": web3.toHex(web3.eth.getTransactionCount(acc.address))
                }

                // Sign the raw transaction with ethereum account
                signed_tx = acc.signTransaction(raw_tx)

                // Send the signed transactions
                web3.eth.sendRawTransaction(signed_tx.rawTransaction)
            }
            i = i + 1
            fo = open(os.path.abspath("MintStatus.txt"), "a")
            // fo.write(f'{i}\t{acc.address}\t{methodId}\t{functionName}\t{mintTerm}\t{date}\n')
            fo.close()
            fx = open(os.path.abspath("MintAdress.txt"), "w")
            fx.write(str(i))
            fx.close()
            nonce = nonce + 1

        } catch (ex) {
            console.log(ex)
            time.sleep(15)
            nonce = nonce + 1
        }
    }
}

function claimRank(claimType, web3, chainId, currentIndex, masterIndex, numberOfAddress, value, gasPrice, contract, mintTerm, gasPriceX, gasPriceY, website, api_key) {
    data = 0x9ff054df0000000000000000000000000000000000000000000000000000000000000000 + mintTerm
    claim(claimType, web3, chainId, currentIndex, masterIndex, numberOfAddress, value, gasPrice, contract, data, gasPriceX, gasPriceY, website, api_key)
}

function claimMintReward(claimType, web3, chainId, currentIndex, masterIndex, numberOfAddress, value, gasPrice, contract, gasPriceX, gasPriceY, website, api_key) {
    data = 0x52c7f8dc
    claim(claimType, web3, chainId, currentIndex, masterIndex, numberOfAddress, value, gasPrice, contract, data, gasPriceX, gasPriceY, website, api_key)
}

function claimMintRewardAndShare(claimType, web3, chainId, currentIndex, masterIndex, numberOfAddress, value, gasPrice, contract, gasPriceX, gasPriceY, website, api_key) {
    let masterAddress = Wallet.fromMnemonic(mnemonic, `m/44'/60'/0'/0/{masterIndex}`);

    add_hex = int(masterAddress.address, 16) * 0x10000000000000000000000000000000000000000000000000000000000000000
    data = 0x1c56030500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000064 + add_hex
    claim(claimType, web3, chainId, currentIndex, masterIndex, numberOfAddress, value, gasPrice, contract, data, gasPriceX, gasPriceY, website, api_key)
}

function claimMintRewardAndStake(claimType, web3, chainId, currentIndex, masterIndex, numberOfAddress, value, gasPrice, contract, mintTerm, gasPriceX, gasPriceY, website, api_key) {
    data = 0x5bccb4c400000000000000000000000000000000000000000000000000000000000000640000000000000000000000000000000000000000000000000000000000000000 + mintTerm;
    claim(claimType, web3, chainId, currentIndex, masterIndex, numberOfAddress, value, gasPrice, contract, data, gasPriceX, gasPriceY, website, api_key);
}

function main() {
    let website = "";
    let api_key = ""; // https://bsc-testnet.web3api.com/v1/XXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    var web3 = new Web3(new Web3.providers.HttpProvider('https://bsc-testnet.web3api.com/v1/XXXXXXXXXXXXXXXXXXXXXXXXXXXXX'));

    let chainId = 97;
    let claimType = 1;
    let mintTerm = 30;
    let value = 0;
    let gasPrice = 0;
    let numberOfAddress = 50;
    let contract = "0x2AB0e9e4eE70FFf1fB9D67031E44F6410170d00e";
    let masterIndex = 0;
    let gasPriceX = 8;
    let gasPriceY = 1;

    // mint_term = 100
    // Ethereum Mainnet
    // chainId = 1
    // Binance Smart Chain Mainnet
    // chainId = 56
    // Avalanche C-Chain
    // chainId = 43114
    // Polygon Mainnet
    // chainId = 137
    // Arbitrum One
    // chainId = 42161
    // Optimism
    // chainId = 10
    // Moonbeam
    // chainId = 1284
    // Dogechain Mainnet
    // chainId = 2000

    // Thay đổi thông tin API tương ứng cho từng mạng
    // BSC mainnet
    if (chainId === BSC_CHAIN_MAINNET) {
        website = "https://api.bscscan.com/"
        api_key = "YYYYYYYYYYYYYYYYYYYYYYYYYYY"
        web3 = Web3(Web3.HTTPProvider('https://bsc-mainnet.web3api.com/v1/VTWTTT6U8VNA9R5BQQS7BJI43ZUQ2Z9TYY'))
        // Gas send coin to other wallet
        value = web3.toWei(0.0005, "ether")
        gasPrice = web3.toWei(10, "gwei")
        contract = "0x2AB0e9e4eE70FFf1fB9D67031E44F6410170d00e"
        // Master wallet
        masterIndex = 0
        // Gas mint
        gasPriceX = 8
        gasPriceY = 1
    } else if (chainId === BSC_CHAIN_TESTNET) {
        website = "https://api-testnet.bscscan.com/";
        api_key = "T87ZC8389NJ3R21IM3H7DWBHQDXKRFP9NW";
        web3 = new Web3(new Web3.providers.HttpProvider('https://bsc-testnet.web3api.com/v1/VTWTTT6U8VNA9R5BQQS7BJI43ZUQ2Z9TYY'));
        // Gas send coin to other wallet
        value = web3.utils.toWei('0.0005', "ether");
        gasPrice = web3.utils.toWei('10', "gwei");
        contract = "0xca41f293A32d25c2216bC4B30f5b0Ab61b6ed2CB";
        // // Master wallet
        masterIndex = 0;
        // // Gas mint
        gasPriceX = 8;
        gasPriceY = 1;
    } else if (chainId == DOGE_CHAIN_MAINNET) {
        website = "https://api.dogechain.com/"
        api_key = "YYYYYYYYYYYYYYYYYYYYYYYYYYY"
        web3 = new Web3(new Web3.providers.HttpProvider('https://dogechain-mainnet.gateway.pokt.network/v1/lb/ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ'));
        // Gas send coin to other wallet
        value = web3.utils.toWei('0.0005', "ether");
        gasPrice = web3.utils.toWei('10', "gwei");
        contract = "0x948eed4490833D526688fD1E5Ba0b9B35CD2c32e"
        // Master wallet
        masterIndex = 0
        // Gas mint
        gasPriceX = 8
        gasPriceY = 1
    } else if (chainId === FANTOM_CHAIN_MAINNET) {
        website = "https://api.ftmscan.com/"
        api_key = "XBC9IVAQF8HBIKTJI7RG7AQCJNUJRQ22PT"
        web3 = new Web3(new Web3.providers.HttpProvider('https://rpc.ankr.com/fantom'));
        // Gas send coin to other wallet
        value = web3.utils.toWei('0.05', "ether");
        gasPrice = web3.utils.toWei('100', "gwei");
        contract = "0xeF4B763385838FfFc708000f884026B8c0434275"
        // Master wallet
        masterIndex = 0
        // Gas mint
        gasPriceX = 10
        gasPriceY = 100
    } else if (chainId === FANTOM_CHAIN_TESTNET) {
        website = "https://api-testnet.ftmscan.com/"
        api_key = "XBC9IVAQF8HBIKTJI7RG7AQCJNUJRQ22PT"
        web3 = new Web3(new Web3.providers.HttpProvider('https://rpc.ankr.com/fantom_testnet'));
        // Gas send coin to other wallet
        value = web3.utils.toWei('0.00025', "ether");
        gasPrice = web3.utils.toWei('5', "gwei");
        contract = "0xeF4B763385838FfFc708000f884026B8c0434275"
        // Master wallet
        masterIndex = 0
        // Gas mint
        gasPriceX = 5
        gasPriceY = 2
    }

    while (true) {

        let filename = "MintAddress.txt"
        let t = fs.readFileSync(process.cwd() + "/" + filename).toString()
        let currentIndex = t ? Number(t) : 0;
        console.log("currentIndex");
        console.log(currentIndex);

        // send coin to all address
        if (claimType === CLAIM_TYPE_SEND_TOKEN_TO_ALL_ADDRESS) {
            sendCoin(web3, chainId, currentIndex, masterIndex, numberOfAddress, value, gasPrice);
        }
        // claimRank
        else if (claimType == CLAIM_TYPE_CLAIM_RANK) {
            sendCoin(web3, chainId, currentIndex, masterIndex, numberOfAddress, value, gasPrice);
            claimRank(claimType, web3, chainId, currentIndex, masterIndex, numberOfAddress, value, gasPrice, contract, mintTerm, gasPriceX, gasPriceY, website, api_key);
        }
        // claimMintReward
        else if (claimType == CLAIM_TYPE_CLAIM_MINT_REWARD) {
            sendCoin(web3, chainId, currentIndex, masterIndex, numberOfAddress, value, gasPrice);
            claimMintReward(claimType, web3, chainId, currentIndex, masterIndex, numberOfAddress, value, gasPrice, contract, gasPriceX, gasPriceY, website, api_key);
        }
        // claimMintRewardAndShare
        else if (claimType == CLAIM_TYPE_CLAIM_MINT_REWARD_AND_SHARE) {
            sendCoin(web3, chainId, currentIndex, masterIndex, numberOfAddress, value, gasPrice);
            claimMintRewardAndShare(claimType, web3, chainId, currentIndex, masterIndex, numberOfAddress, value, gasPrice, contract, gasPriceX, gasPriceY, website, api_key);
        }
        // claimMintRewardAndStake
        else if (claimType == CLAIM_TYPE_CLAIM_MINT_REWARD_AND_STAKE) {
            sendCoin(web3, chainId, currentIndex, masterIndex, numberOfAddress, value, gasPrice);
            claimMintRewardAndStake(claimType, web3, chainId, currentIndex, masterIndex, numberOfAddress, value, gasPrice, contract, mintTerm, gasPriceX, gasPriceY, website, api_key);
        }
    }
}

main();