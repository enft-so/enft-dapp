import { Address } from "ergo-lib-wasm-browser";
import { txFee } from "./ergoconst";
import {currentHeight} from "./auctions"

export function isYoroiDappConnectorInstalled(){
    return (typeof ergo_request_read_access === "function")
}

export async function isYoroiWalletAccessibleForRead(){
    return await ergo_check_read_access()
}

export async function requestYoroiWalletReadAcess(){
    return await ergo_request_read_access()
}

export async function getBalance(addr) {
    return await fetch(`https://api.ergoplatform.com/api/v1/addresses/${addr}/balance/confirmed`).then(res => res.json());
}

export async function loadTokensFromYoroiWallet(){
    const addresses = (await ergo.get_used_addresses()).concat(await ergo.get_unused_addresses())
    let tokens = {}
    for (let i = 0; i < addresses.length; i++) {
        (await getBalance(addresses[i])).tokens.forEach(ass => {
            if (!Object.keys(tokens).includes(ass.tokenId))
                tokens[ass.tokenId] = {
                    amount: 0,
                    name: ass.name,
                    tokenId: ass.tokenId
                }
            tokens[ass.tokenId].amount += parseInt(ass.amount)
        })
    }
    return tokens
}

export async function loadErgBalanceFromYoroiWallet(){
    return await ergo.get_balance()
}

export async function getChangeAddress(){
    return await ergo.get_change_address()
}

export async function sendNFtToSelf(tokenId){
    const boxes =  await ergo.get_utxos("1",tokenId);
    const box  = boxes[0];
    if(boxes == undefined){
        return false;
    }
    console.log({box})

    const unsigned = {
       inputs: [
            {
                ...box,
                extension: {}
            }
       ],
       outputs: [
        {
            "value": box.value,
            "ergoTree": box.ergoTree,
            "assets": box.assets,
            "creationHeight": await currentHeight(),
            "additionalRegisters": {},
        }
       ],
       dataInputs: [],
       fee: txFee
    }

    try {
        console.log("awaiting sign", {ergo, sign: ergo.sign_tx})
        return await ergo.sign_tx(unsigned)
    } catch (e) {
       console.error('Error while signing Tx!', e)
       return null
    }
}

export async function yoroiSendFunds(need, addr, block, registers={}, notif=true) {
    // await setupYoroi()
    let have = JSON.parse(JSON.stringify(need))
    have['ERG'] += txFee
    let ins = []
    const keys = Object.keys(have)

    const allBal = await loadTokensFromYoroiWallet()
    if (keys.filter(key => key !== 'ERG').filter(key => !Object.keys(allBal).includes(key) || allBal[key].amount < have[key]).length > 0) {
        console.error('Not enough balance in the Yoroi wallet! See FAQ for more info.', true)
        return
    }

    for (let i = 0; i < keys.length; i++) {
        if (have[keys[i]] <= 0) continue
        const curIns = await ergo.get_utxos(have[keys[i]].toString(), keys[i]);
        if (curIns !== undefined) {
            curIns.forEach(bx => {
                have['ERG'] -= parseInt(bx.value)
                bx.assets.forEach(ass => {
                    if (!Object.keys(have).includes(ass.tokenId)) have[ass.tokenId] = 0
                    have[ass.tokenId] -= parseInt(ass.amount)
                })
            })
            ins = ins.concat(curIns)
        }
    }
    if (keys.filter(key => have[key] > 0).length > 0) {
        console.error('Not enough balance in the Yoroi wallet! See FAQ for more info.', true)
        return
    }

    const fundBox = {
        value: need['ERG'].toString(),
        ergoTree: Address.from_mainnet_str(addr).to_ergo_tree().to_base16_bytes(),
        assets: keys.filter(key => key !== 'ERG').map(key => {
            return {
                tokenId: key,
                amount: need[key].toString()
            }
        }),
        additionalRegisters: registers,
        creationHeight: block.height
    }

    const feeBox = {
        value: txFee.toString(),
        creationHeight: block.height,
        ergoTree: "1005040004000e36100204a00b08cd0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798ea02d192a39a8cc7a701730073011001020402d19683030193a38cc7b2a57300000193c2b2a57301007473027303830108cdeeac93b1a57304",
        assets: [],
        additionalRegisters: {},
    }

    const changeBox = {
        value: (-have['ERG']).toString(),
        ergoTree: Address.from_mainnet_str(await ergo.get_change_address()).to_ergo_tree().to_base16_bytes(),
        assets: Object.keys(have).filter(key => key !== 'ERG')
            .filter(key => have[key] < 0)
            .map(key => {
                return {
                    tokenId: key,
                    amount: (-have[key]).toString()
                }
            }),
        additionalRegisters: {},
        creationHeight: block.height
    }

    const unsigned = {
        inputs: ins.map(curIn => {
            return {
                ...curIn,
                extension: {}
            }
        }),
        outputs: [fundBox, changeBox, feeBox],
        dataInputs: [],
        fee: txFee
    }

    console.log({unsigned})

    let tx = null
    try {
        tx = await ergo.sign_tx(unsigned)
        console.log("signed tx:", tx)
    } catch (e) {
        console.error('Error while sending funds from Yoroi!', true)
        return
    }
    console.log("submitting tx:", tx)
    //const txId = await ergo.submit_tx(tx)

    console.log('Yoroi tx id', txId)
    if (notif) {
        if (txId !== undefined && txId.length > 0)
            console.warn('The operation is being done with Yoroi, please wait...')
        else
        console.error('Error while sending funds using Yoroi!', true)
    }
    return txId
}