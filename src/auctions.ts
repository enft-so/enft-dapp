import { Constant, I64 } from "ergo-lib-wasm-browser";
import { Address } from "@coinbarn/ergo-ts";
import { txFee, auctionAddresses, auctionAddress, contracts, auctionNFT } from './ergoconst';

function decodeStr(str) {
    return new TextDecoder().decode(Constant.decode_from_base16(str).to_byte_array())
}

export async function encodeHex(reg) {
    return Constant.from_byte_array(Buffer.from(reg, 'hex')).encode_to_base16()
}

function toHexString(byteArray) {
    return Array.from(byteArray, function (byte) {
        return ('0' + ((byte as any) & 0xFF).toString(16)).slice(-2);
    }).join('')
}

function decodeString(encoded) {
    return toHexString(Constant.decode_from_base16(encoded).to_byte_array())
}

export async function encodeNum(n, isInt = false) {
    if (isInt) return Constant.from_i32(n).encode_to_base16()
    else return Constant.from_i64(I64.from_str(n)).encode_to_base16()
}

export function decodeNum(n, isInt = false) {
    if (isInt) return Constant.decode_from_base16(n).to_i32()
    else return Constant.decode_from_base16(n).to_i64().to_str()
}

export function decodeLongTuple(val) {
    return Constant.decode_from_base16(val).to_i64_str_array().map(cur => parseInt(cur))
}

function isPicture(artCode) {
    return artCode === "0e020101" || artCode === "0e0430313031";
}

export function boxById(id) {
    return fetch(`https://api.ergoplatform.com/api/v0/transactions/boxes/${id}`)
        .then((res: Response) => res.json())
}

async function loadTokensById(ids) {
    let fetches = ids.map((t) =>
        fetch(`https://api.ergoplatform.com/api/v0/assets/${t}/issuingBox`)
    );
    let fetchesResolved = await Promise.all(fetches);

    let tokens = await Promise.all(fetchesResolved.map((r: Response) => r.json()));
    return tokens
}

const allAuctionErgoTrees = auctionAddresses.map(a => new Address(a).ergoTree)

const auctions = "https://api.ergoplatform.com/api/v0/transactions/boxes/byAddress/unspent/5t19JGogcry9DRipPNcLs4mSnHYXQoqazPDMXXcdMixeH2mkgzMvWXjENsHRJzfHAFnTL5FBDHQCzBcnYg4CU1LcJZMmUXAaDcsKdgfBk4sE9BDbLt6Yxkjh6ow65HGCgxkwNAEArMAz8tqZL7GzKx4AvYVkqG3ExKggwDyVrvx7YzN8xeFtEUcnVkDKM8ow7YWW8eee2EidfYArPRd8fxQr5EuZVEiQbzKZ6m4xgtHfhsEptE3pNdt69F94gkytpounxBYpJPqfeZ8hVxLk8qaXTGFiJTDTt2p9D5ue4skZf4AGSLJyuzpMkjdifczQNc784ic1nbTAcjL3FKGHqnkaVwnCxU7go45X9ZFHwdpc6v67vFDoHzAAqypax4UFF1ux84X5G4xK5NFFjMZtvPyjqn2ErNXVgHBs2AkpngBPjnVRiN4sWkhR66NfBNpigU8PaTiB4Rim2FMZSXuyhRySCA1BV8ydVxz45T9VHqHA6WYkXp2ppAHmc29F8MrHX5Ew2x6amraFgvsdgAB3XiiEqEjRc83mhZVL1QgKi5CdeeGNYiXeCkxaRhG3j6r1JdAgzGDAQfN8sdRcEc1aYxbPfbqM1s81NFm7K1UmMUxrfCUp73poGAfV8FvQa2akyascKBaSCqvwuHW2ZP4oMoJHjZjTAgQjQF8cBNF9YLo6wXEtMQT5FYc3bHSgd4xZXCk2oHYjUSACW1Z5e7KZ3Qw1Sa2UvpMdWhbZ5Ncu99WT7v6nHFLJvHEPM7evr41nhCe9Yt3pAq4ee4rKCtEer4vQWq2b5UJSDXDj5VkVepQ5tmeXfXrBc42Yqucy6VeQSE7W66o4hQjwW1iN3yipmdTmpaAEASmbXwCxRSm7g4sNkfA969xo14PZQpBY3QUGqgCWoqJJVFWMhfvD53rzfgJpA4JH5B1fvY99q5iwbsAKdJfZi4fxub9QWZSNQfht4JqXMDmc6XTkWLE4VCxBRQYzF44H2E6mdf5EbZHUrpXj5c2VfC6PZGg9qmrz14aZjafM4M7kRTqMwVB8R9r7kXM1FWidGoprp2fRoJUALAKxKDSTVHX8ejT8zkSKJ5W45dSQjMe3WUDTeKhiy6Fqio2ukV8THaizTp6yZWxMVdu3a15pGBv1kmXZJEnLN9BsxyhnW2iGM7tvwK1jAneXeBH1uVdusR59j5ubCGKeoaS5ToC8Ky6wZ2iCyb2JF5CTvR4sMUg2ksmUm1dk8EoRjJ9i5gkqY"

function tokenIdsFromBoxes(boxes) {
    let ids = boxes.flatMap(box => box.assets.map(asset => asset.tokenId));
    return ids
}

function decodeR9(r9) {
    return ipfsToGateway(decodeStr(r9))
}

export async function currentHeight() {
    // return explorer.getCurrentHeight();
    return fetch('https://api.ergoplatform.com/api/v0/blocks?limit=1')
        .then((res: Response) => res.json())
        .then(res => res.items[0].height)
}

export async function currentBlock() {
    // return explorer.getCurrentHeight();
    return fetch('https://api.ergoplatform.com/api/v0/blocks?limit=1')
        .then((res: Response) => res.json())
        .then(res => res.items[0])
}

function getBalance(address) {
    return fetch(`https://api.ergoplatform.com/api/v1/addresses/${address}/balance/confirmed`).then(r => r.json())
}

export async function loadPicturesFromAddress(address) {
    const ids = (await getBalance(address)).tokens.map(t => t.tokenId)

    if (!ids || ids?.length < 0) {
        return []
    }
    let tokens = await loadTokensById(ids);
    return tokens
        .filter(
            (n) => isPicture(n[0]?.additionalRegisters?.R7) && n[0]?.additionalRegisters?.R9
        )
        .sort((n1, n2)=> n1[0].creationHeight - n2[0].creationHeight)
        .map((n) => {
            return {
                id: n[0].assets[0].tokenId,
                tokenId: n[0].assets[0].tokenId,
                name: n[0].assets[0].name,
                description: decodeStr(n[0].additionalRegisters.R5),
                src: decodeR9(n[0].additionalRegisters.R9)
            }
        });
}

export async function loadPicturesByTokenIds(ids) {
    let tokens = await loadTokensById(ids);
    return tokens
        .filter(
            (n) => isPicture(n[0]?.additionalRegisters?.R7) && n[0]?.additionalRegisters?.R9
        )
        .map((n) => {
            return {
                tokenId: n[0].assets[0].tokenId,
                name: n[0].assets[0].name,
                description: decodeStr(n[0].additionalRegisters.R5),
                src: decodeR9(n[0].additionalRegisters.R9)
            }
        });
}

const auctionLinkPrefix = "https://ergoauctions.org/#/auction/active?type=picture&artist="

import { yoroiSendFunds } from "./yoroiDappConnector";


async function getImageSources(boxes: Box[]): Promise<Auction[]> {
    const height: number = await currentHeight();
    let tokens = (await loadTokensById(tokenIdsFromBoxes(boxes))
    );
    let auctions: Auction[] = tokens
        .filter(
            (n) => isPicture(n[0]?.additionalRegisters?.R7) && n[0]?.additionalRegisters?.R9
        )
        .map((n) => {
            const box = boxes.find(b => b.assets[0].tokenId == n[0].assets[0].tokenId)
            const stepInit = decodeLongTuple(box.additionalRegisters.R6)
            const infoJsonString = decodeStr(box.additionalRegisters.R9)
            const biderAddress = Address.fromErgoTree(decodeString(box.additionalRegisters.R5)).address
            const sellerAddress = Address.fromErgoTree(decodeString(box.additionalRegisters.R4)).address
            let startTime, description
            try {
                const infoJs = JSON.parse(infoJsonString)
                startTime = infoJs.startTime
                description = infoJs.description

            } catch (e) {
                startTime = parseInt(infoJsonString.split(',')[1])
                description = infoJsonString.split(',')[2]
            }
            //const finalBlock:number = +decodeNum(box.additionalRegisters.R5, true)
            return {
                timeLeft: "",
                token: n[0],
                box: box,
                artist: n[0].address,
                royalty:  decodeStr(n[0].additionalRegisters.R4)?.length > 0 ? +decodeStr(n[0].additionalRegisters.R4): 0,
                bidder: biderAddress,
                seller: sellerAddress,
                bids: [],
                boxId: box.id,
                boxTxId: box.txId,
                value: box.value,
                nextBid: (box.value < stepInit[0]) ? stepInit[0] : box.value + stepInit[1],
                initialValue: stepInit[0],
                minStep: stepInit[1],
                startTime: startTime,
                endTime: parseInt(decodeNum(box.additionalRegisters.R7) as any),
                instantAmount: parseInt(decodeNum(box.additionalRegisters.R8) as any),
                tokenId: n[0].assets[0].tokenId,
                name: n[0].assets[0].name,
                description: decodeStr(n[0].additionalRegisters.R5)?.length > 0 ? decodeStr(n[0].additionalRegisters.R5) : description,
                src: decodeR9(n[0].additionalRegisters.R9)
            }
        });
    return auctions;
}


export async function getOneAuction(): Promise<Auction[]> {
    const auctionBoxes = (await getActiveAuctions()).slice(0, 1);
    const auctions = await getImageSources(auctionBoxes)
    //auctions[0].bids = await loadBids(auctions[0].boxTxId, []);
    return auctions.sort((a: Auction, b: Auction) => a.endTime - b.endTime)
}


export async function getCurrentAuctions(): Promise<Auction[]> {
    const auctionBoxes = await getActiveAuctions()
    if (auctionBoxes && auctionBoxes.length > 0) {
        const auctions = await getImageSources(auctionBoxes)
        //auctions[0].bids = await loadBids(auctions[0].boxTxId, []);
        return auctions.sort((a: Auction, b: Auction) => a.endTime - b.endTime)
    } else {
        return []
    }
}

async function getActiveAuctions(): Promise<Box[]> {
    let response = await fetch(auctions);
    let data = await response.json();

    return data.filter(b => b.additionalRegisters.R9)//.slice(0,5); //TODO remove slice
}

export async function getBoxesForAsset(asset) {
    let response = await fetch(`https://api.ergoplatform.com/api/v1/boxes/unspent/byTokenId/${asset}`)
    let data = await response.json();
    return data;
}

async function getTxById(txId): Promise<Transaction> {
    let response = await fetch(`https://api.ergoplatform.com/api/v0/transactions/${txId}`);
    let data = await response.json();
    return data;
}

async function getBoxById(txId: BoxId): Promise<Box> {
    let response = await fetch(`https://api.ergoplatform.com/api/v0/transactions/boxes/${txId}`);
    let data = await response.json();
    return data;
}

function isAuctionTree(tree: ErgoTree): boolean {
    return allAuctionErgoTrees.some(t => t == tree)
}

export async function loadBids(boxTxId: TxId, bids: Array<AuctionBid>) {
    if (!bids) {
        bids = []
    }
    // load transaction
    const tx = await getTxById(boxTxId);
    const bid: AuctionBid = {
        timestamp: tx.summary.timestamp,
        value: tx.outputs[0].value
    }
    bids = [...bids, bid]
    const bidBox = await getBoxById(tx.inputs.at(-1).id)
    if (isAuctionTree(bidBox.ergoTree)) {
        return [...await loadBids(bidBox.txId, bids)]
    } else {
        return bids
    }
}


// custom types
type AuctionBid = {
    timestamp: number
    value: NanoErgs
}


export type Auction = {
    timeLeft: any
    token: any
    box: Box
    bids: AuctionBid[]
    boxTxId: TxId
    boxId: BoxId
    artist: ErgoAddress
    royalty: number
    bidder: ErgoAddress
    seller: ErgoAddress
    instantAmount: NanoErgs
    initialValue: NanoErgs
    minStep: NanoErgs
    nextBid: NanoErgs
    value: NanoErgs
    endTime: number
    tokenId: TokenId
    name: string
    description: string
    src: string
}

// ergo types

type ErgoAddress = string
type Register = string
type ErgoTree = string
type TokenId = string
type BoxId = string
type BlockId = string
type BlockHeight = number
type TxId = string | null
type NanoErgs = number

type AdditionalRegisters = {
    R4: Register
    R5: Register
    R6: Register
    R7: Register
    R8: Register
    R9: Register
}


type Box = {
    id: BoxId
    additionalRegisters: AdditionalRegisters
    address: ErgoAddress
    assets: Asset[]
    creationHeight: number
    ergoTree: string
    index: number
    mainChain: true
    spentTransactionId: TxId
    txId: TxId
    value: NanoErgs
}

type Asset = {
    value: number
    amount: number
    decimals: number
    index: number
    name: string
    tokenId: TokenId
    type: string
}

type IOSummary = {
    feePerByte: number
    totalCoinsTransfered: number
    totalFee: 2000000
}

type TxSummary = {
    block: { id: BlockId, height: BlockHeight }
    confirmationsCount: 109
    id: TxId
    index: number
    size: number
    timestamp: number
}

type TxInput = {
    address: ErgoAddress
    id: BoxId
    index: number
    outputIndex: number
    outputTransactionId: TxId
    spendingProof: null
    transactionId: TxId
    value: NanoErgs
}

type Transaction = {
    dataInputs: any[]
    inputs: TxInput[]
    ioSummary: IOSummary
    outputs: any[]
    summary: TxSummary
}

function ipfsToGateway(imgSrc) {
    const ipfsPrefix = "ipfs://"
    const gateway = "https://cloudflare-ipfs.com/ipfs/"
    if (imgSrc && imgSrc.startsWith(ipfsPrefix)) {
        return imgSrc.replace(ipfsPrefix, gateway)
    } else {
        return imgSrc
    }
}

// Auction stats

export function getAuctionStats(limit, offset) {
    const auctionTxUrl = `https://api.ergoplatform.com/api/v1/addresses/${auctionAddress}/transactions?limit=${limit}&offset=${offset}`
    return fetch(auctionTxUrl).then(res => res.json())
        .then(a =>
            a.items.filter((tx) => {
                return tx.outputs[0].address !== auctionAddress
                    && tx.inputs[0].address === auctionAddress
                    && (tx.inputs[0].value / 1e9 > 0.01)
            })
                .map(tx => {
                    tx.inputs[0].spentTransactionId = tx.id
                    return tx.inputs[0]
                }))
}

// Bids

const template = `{
    val userAddress = PK("$userAddress")
    val bidAmount = $bidAmountL
    val currencyId = fromBase64("$currencyId")
    val placeBid = {
      INPUTS(INPUTS.size - 1).id == fromBase64("$auctionId") &&
        OUTPUTS(0).R5[Coll[Byte]].get == userAddress.propBytes && 
        ((currencyId.size == 0 && OUTPUTS(0).value == bidAmount) ||
           (OUTPUTS(0).tokens(1)._1 == currencyId && OUTPUTS(0).tokens(1)._2 == bidAmount))
    }
    val returnFunds = {
      val total = INPUTS.fold(0L, {(x:Long, b:Box) => x + b.value}) - 2000000
      OUTPUTS(0).value >= total && OUTPUTS(0).propositionBytes == userAddress.propBytes && OUTPUTS.size == 2
    }
    sigmaProp((placeBid || returnFunds) && HEIGHT < $timestampL)
  }`;

async function compileErgoScript(ergoScriptString) {
    const url = 'https://assembler.ergoauctions.org/compile'
    return await fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            api_key: '',
        },
        body: ergoScriptString,
    }).then(res => res.json());
}



export async function getBidErgoScript(amount, auctionBox:Box, bidderAddress) {
    console.warn({auctionBox})
    let id64 = Buffer.from(auctionBox.id, 'hex').toString('base64');
    let currencyId = ''
    if (auctionBox.assets.length > 1) currencyId = auctionBox.assets[1].tokenId
    currencyId = Buffer.from(currencyId, 'hex').toString('base64');

    let script = template
        .replace('$auctionId', id64)
        .replace('$userAddress', bidderAddress)
        .replace('$bidAmount', amount)
        .replace('$currencyId', currencyId)
        .replace('$timestamp', "" + Date.now())
        .replaceAll('\n', '\\n');

    const compiled = await compileErgoScript(JSON.stringify(script))
    return compiled.address;
}

export async function registerBid(bidAmount, auction:Auction, bidderAddress) {
    let additionalData = {
        dataInput: (await getBoxesForAsset(auctionNFT)).items[0]
    }
    const block = await currentBlock()
    const p2s = await getBidErgoScript(bidAmount, auction.box, bidderAddress)
    let nextEndTime = auction.endTime
    if (auction.endTime - block.timestamp <= contracts[auctionAddress].extendThreshold) {
        nextEndTime += contracts[auctionAddress].extendNum
    }

    let auctionErg = bidAmount
    let start: any = {
        erg: bidAmount + txFee,
    }
    let auctionAssets = [
        {
            tokenId: auction.box.assets[0].tokenId,
            amount: auction.box.assets[0].amount
        }
    ]
    let returnBidder: any = {
        value: auction.box.value,
        address: auction.bidder,
    };
    if (auction.box.assets.length > 1) {
        start = {}
        start[auction.box.assets[1].tokenId] = bidAmount

        auctionErg = auction.box.value
        auctionAssets = [
            {
                tokenId: auction.box.assets[0].tokenId,
                amount: auction.box.assets[0].amount
            },
            {
                tokenId: auction.box.assets[1].tokenId,
                amount: bidAmount,
            },
        ]

        returnBidder = {
            value: -1,
            address: auction.bidder,
            assets: [
                {
                    tokenId: auction.box.assets[1].tokenId,
                    amount: auction.box.assets[1].amount
                }
            ]
        }
    }

    let newBox = {
        value: auctionErg,
        address: auctionAddress,
        assets: auctionAssets,
        registers: {
            R4: auction.box.additionalRegisters.R4,
            R5: await encodeHex(new Address(bidderAddress).ergoTree),
            R6: auction.box.additionalRegisters.R6,
            R7: await encodeNum(nextEndTime.toString()),
            R8: auction.box.additionalRegisters.R8,
            R9: auction.box.additionalRegisters.R9,
        },
    };
    let request = {
        // address: "4MQyML64GnzMxZgm",
        address: p2s,
        returnTo: bidderAddress,
        startWhen: start,
        txSpec: {
            requests: [newBox, returnBidder],
            fee: txFee,
            inputs: ['$userIns', auction.boxId],
            dataInputs: [additionalData.dataInput.boxId],
        },
    };
    return await follow(request)
        .then((res) => {
            if (res.id !== undefined) {
                let pending = {
                    id: res.id,
                    address: p2s,
                    time: Date.now(),
                    key: 'bid',
                    auction: auction,
                    amount: bidAmount
                };
                console.log({ pending })
                //addForKey(pending, 'pending')
            }
            res.address = p2s
            res.block = block
            return res;
        });
}

export async function follow(request) {
    const url = 'https://assembler.ergoauctions.org/follow'
    return await fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            api_key: '',
        },
        body: JSON.stringify(request),
    })
        .then((res) =>
            res.json()
        ).then(res => {
            if (res.success === false) throw new Error()
            return res
        });
}

export async function sendBid(bidAmount, auction: Auction, bidderAddress) {
    const r = await registerBid(bidAmount, auction, bidderAddress)
    if (r.id === undefined) throw Error("Could not contact the assembler service")
    let need = { ERG: bidAmount + txFee }
    if (auction.box.assets.length > 1) {
        need = { ERG: 2000000 }
        need[auction.box.assets[1].tokenId] = bidAmount
    }
    return await yoroiSendFunds(need, r.address, r.block)
}