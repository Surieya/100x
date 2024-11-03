import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useEffect } from "react";

export function ShowBalance() {
  const { connection } = useConnection();
  const wallet = useWallet();

  async function getUserBalance() {
    if (wallet.publicKey) {
      const balance = await connection.getBalance(wallet.publicKey);
      document.getElementById("balance").innerHTML = balance / LAMPORTS_PER_SOL;
    }
  }

  useEffect(() => {
    getUserBalance();
  }, [wallet]);

  return (
    <div>
      Balance <span id="balance"></span> SOL
    </div>
  );
}
