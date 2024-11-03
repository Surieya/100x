import {
  createMint,
  getMinimumBalanceForRentExemptMint,
  createInitializeMint2Instruction,
  MINT_SIZE,
  TOKEN_2022_PROGRAM_ID,
  getMintLen,
  TYPE_SIZE,
  LENGTH_SIZE,
  ExtensionType,
  createInitializeMetadataPointerInstruction,
} from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Keypair, Transaction, SystemProgram } from "@solana/web3.js";
import { pack, createInitializeInstruction } from "@solana/spl-token-metadata";
import React from "react";

const TokenLaunchPadNew = () => {
  const wallet = useWallet();
  const { connection } = useConnection();
  async function createToken() {
    // createMint();

    // const lamports = await getMinimumBalanceForRentExemptAccountWithExtensions(connection);

    const mintKeyPair = Keypair.generate();

    const metadata = {
      mint: mintKeyPair.publicKey,
      name: "RUSTY",
      symbol: "RUS    ",
      uri: "https://cdn.100xdevs.com/metadata.json",
      additionalMetadata: [],
    };

    const mintLen = getMintLen([ExtensionType.MetadataPointer]);
    const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;

    const lamports = await connection.getMinimumBalanceForRentExemption(
      mintLen + metadataLen
    );

    const transaction = new Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: wallet.publicKey,
        newAccountPubkey: mintKeyPair.publicKey,
        space: mintLen,
        lamports,
        programId: TOKEN_2022_PROGRAM_ID,
      }),
      createInitializeMetadataPointerInstruction(
        mintKeyPair.publicKey,
        wallet.publicKey,
        mintKeyPair.publicKey,
        TOKEN_2022_PROGRAM_ID
      ),
      createInitializeMint2Instruction(
        mintKeyPair.publicKey,
        9,
        wallet.publicKey,
        wallet.publicKey,
        TOKEN_2022_PROGRAM_ID
      ),
      createInitializeInstruction({
        programId: TOKEN_2022_PROGRAM_ID,
        mint: mintKeyPair.publicKey,
        metadata: mintKeyPair.publicKey,
        name: metadata.name,
        symbol: metadata.symbol,
        uri: metadata.uri,
        mintAuthority: wallet.publicKey,
        updateAuthority: wallet.publicKey,
      })
    );

    transaction.feePayer = wallet.publicKey;
    transaction.recentBlockhash = (
      await connection.getLatestBlockhash()
    ).blockhash;
    transaction.partialSign(mintKeyPair);
    await wallet.sendTransaction(transaction, connection);

    console.log(
      "Created mint with meta data " + mintKeyPair.publicKey.toString()
    );
  }

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <h1>Solana Token Launchpad</h1>
      <input className="inputText" type="text" placeholder="Name"></input>{" "}
      <br />
      <input
        className="inputText"
        type="text"
        placeholder="Symbol"
      ></input>{" "}
      <br />
      <input
        className="inputText"
        type="text"
        placeholder="Image URL"
      ></input>{" "}
      <br />
      <input
        className="inputText"
        type="text"
        placeholder="Initial Supply"
      ></input>{" "}
      <br />
      <button onClick={createToken} className="btn">
        Create a token
      </button>
    </div>
  );
};

export default TokenLaunchPadNew;
