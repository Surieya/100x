const { Keypair,TOKEN_PROGRAM_ID,Connection, LAMPORTS_PER_SOL, clusterApiUrl, PublicKey } = require('@solana/web3.js');


const { createMint, getOrCreateAssociatedTokenAccount, mintTo } = require('@solana/spl-token');



const connection = new Connection(clusterApiUrl('devnet'));

async function airdrop(pubKey, amt) {
    const airdropSign = await connection.requestAirdrop(new PublicKey(pubKey),amt);
    console.log(airdropSign);
    await connection.confirmTransaction({ signature: airdropSign });

}



async function createMintForToken(payer,mintAuthority) {
    const mint = await createMint(
        connection,
        payer,
        mintAuthority,
        null,
        6,
        TOKEN_PROGRAM_ID
    )
   console.log('Mint created at', mint.toBase58());
    return mint;
}


async function mintNewTokens(payer,mint, to, amt) {
    const tokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        payer,
        mint,
        new PublicKey(to)
    );


    console.log(console.log('Token account created at', tokenAccount.address.toBase58()))
    
        await mintTo(
            connection,
            payer,
            mint,
            tokenAccount.address,
            payer,
            amt
        )
        
    console.log('Minted', amt, 'tokens to', tokenAccount.address.toBase58());
    
}

// airdrop("HfRkRvMQpGPK8gAB4UdsTcWW6mQfo6GzXxYDPcGbq1Bf", LAMPORTS_PER_SOL).then((sign) => {
//     console.log(sign);
// })


const payer = Keypair.fromSecretKey(Uint8Array.from([215, 179, 250, 234, 206, 184, 73, 255, 250, 221, 27, 167, 36, 173, 148, 143, 85, 94, 241, 142, 184, 136, 57, 185, 4, 172, 6, 118, 151, 53, 193, 169, 247, 147, 11, 140, 72, 100, 103, 117, 121, 39, 49, 158, 148, 227, 178, 107, 241, 140, 48, 34, 122, 248, 27, 210, 166, 168, 16, 64, 81, 50, 90, 42]))

const mintAuthority = payer;
// console.log(mintAuthority);


async function main() {
    // const mint = await createMintForToken(payer, mintAuthority.publicKey);


    const mint = await createMintForToken(payer, mintAuthority.publicKey);

    await mintNewTokens(payer,mint, mintAuthority.publicKey, 1000);  
}

//9i4jitDHfPW9k2iacJx3KZWQ9u2jS55kGbyaUDiLZANL
main();
