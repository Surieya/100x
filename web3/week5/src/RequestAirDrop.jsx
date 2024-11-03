import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export function RequestAirdrop() {
  const wallet = useWallet();
  const { connection } = useConnection();

  async function requestAirdrop() {
    const publicKey = wallet.publicKey;
    const amount = document.getElementById("amount").value;
    const signature = await connection.requestAirdrop(
      publicKey,
      amount * LAMPORTS_PER_SOL
    );

    alert("transaction successfull signature" + signature);
  }
  return (
    <div>
      <input type="text" id="amount" placeholder="Amount..." />
      <button onClick={requestAirdrop}>Request Airdrop</button>
      {/* {wallet.publicKey?.toBase58()} */}
    </div>
  );
}
