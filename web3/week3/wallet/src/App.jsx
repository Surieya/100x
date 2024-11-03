import { useState } from "react";
import { generateMnemonic } from "bip39";
function App() {
  const [mnemonic, setMnemonic] = useState("");
  return (
    <>
      <button
        onClick={async function () {
          const mn = await generateMnemonic();
          setMnemonic(mn);
        }}
      >
        Create Seed Phrase
      </button>

      <input type="text" value={mnemonic}></input>
    </>
  );
}

export default App;
