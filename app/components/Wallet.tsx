"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import nacl from "tweetnacl";
import { generateMnemonic, mnemonicToSeedSync, validateMnemonic } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import bs58 from "bs58";
import { ethers } from "ethers";
import {
  Copy,
  Eye,
  EyeOff,
  Trash,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Wallet {
  publicKey: string;
  privateKey: string;
  mnemonic: string;
  path: string;
}

const WalletGenerator = () => {
  const [mnemonicWords, setMnemonicWords] = useState<string[]>(Array(12).fill(""));
  const [pathTypes, setPathTypes] = useState<string[]>([]);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [showMnemonic, setShowMnemonic] = useState<boolean>(false);
  const [mnemonicInput, setMnemonicInput] = useState<string>("");
  const [visiblePrivateKeys, setVisiblePrivateKeys] = useState<boolean[]>([]);
  const [visiblePhrases, setVisiblePhrases] = useState<boolean[]>([]);
  const [gridView, setGridView] = useState<boolean>(false);

  const pathTypeNames: { [key: string]: string } = {
    "501": "Solana",
    "60": "Ethereum",
  };

  const pathTypeName = pathTypeNames[pathTypes[0]] || "";

  useEffect(() => {
    const storedWallets = localStorage.getItem("wallets");
    const storedMnemonic = localStorage.getItem("mnemonics");
    const storedPathTypes = localStorage.getItem("paths");

    if (storedWallets && storedMnemonic && storedPathTypes) {
      setMnemonicWords(JSON.parse(storedMnemonic));
      setWallets(JSON.parse(storedWallets));
      setPathTypes(JSON.parse(storedPathTypes));
      setVisiblePrivateKeys(JSON.parse(storedWallets).map(() => false));
      setVisiblePhrases(JSON.parse(storedWallets).map(() => false));
    }
  }, []);

  const handleDeleteWallet = (index: number) => {
    const updatedWallets = wallets.filter((_, i) => i !== index);
    const updatedPathTypes = pathTypes.filter((_, i) => i !== index);

    setWallets(updatedWallets);
    setPathTypes(updatedPathTypes);
    localStorage.setItem("wallets", JSON.stringify(updatedWallets));
    localStorage.setItem("paths", JSON.stringify(updatedPathTypes));
    setVisiblePrivateKeys(visiblePrivateKeys.filter((_, i) => i !== index));
    setVisiblePhrases(visiblePhrases.filter((_, i) => i !== index));
    toast.success("Wallet deleted successfully!");
  };

  const handleClearWallets = () => {
    localStorage.removeItem("wallets");
    localStorage.removeItem("mnemonics");
    localStorage.removeItem("paths");
    setWallets([]);
    setMnemonicWords([]);
    setPathTypes([]);
    setVisiblePrivateKeys([]);
    setVisiblePhrases([]);
    toast.success("All wallets cleared.");
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard!");
  };

  const togglePrivateKeyVisibility = (index: number) => {
    setVisiblePrivateKeys(
      visiblePrivateKeys.map((visible, i) => (i === index ? !visible : visible))
    );
  };

  const togglePhraseVisibility = (index: number) => {
    setVisiblePhrases(
      visiblePhrases.map((visible, i) => (i === index ? !visible : visible))
    );
  };

  const generateWalletFromMnemonic = (
    pathType: string,
    mnemonic: string,
    accountIndex: number
  ): Wallet | null => {
    try {
      const seedBuffer = mnemonicToSeedSync(mnemonic);
      const path = `m/44'/${pathType}'/0'/${accountIndex}'`;
      const { key: derivedSeed } = derivePath(path, seedBuffer.toString("hex"));

      let publicKeyEncoded: string;
      let privateKeyEncoded: string;

      if (pathType === "501") {
        // Solana
        const { secretKey } = nacl.sign.keyPair.fromSeed(derivedSeed);
        const keypair = Keypair.fromSecretKey(secretKey);

        privateKeyEncoded = bs58.encode(secretKey);
        publicKeyEncoded = keypair.publicKey.toBase58();
      } else if (pathType === "60") {
        // Ethereum
        const privateKey = Buffer.from(derivedSeed).toString("hex");
        privateKeyEncoded = privateKey;

        const wallet = new ethers.Wallet(privateKey);
        publicKeyEncoded = wallet.address;
      } else {
        toast.error("Unsupported path type.");
        return null;
      }

      return {
        publicKey: publicKeyEncoded,
        privateKey: privateKeyEncoded,
        mnemonic,
        path,
      };
    } catch (error) {
      toast.error("Failed to generate wallet. Please try again.");
      return null;
    }
  };

  const handleGenerateWallet = () => {
    let mnemonic = mnemonicInput.trim();

    if (mnemonic) {
      if (!validateMnemonic(mnemonic)) {
        toast.error("Invalid recovery phrase. Please try again.");
        return;
      }
    } else {
      mnemonic = generateMnemonic();
    }

    const words = mnemonic.split(" ");
    setMnemonicWords(words);

    const wallet = generateWalletFromMnemonic(
      pathTypes[0],
      mnemonic,
      wallets.length
    );
    if (wallet) {
      const updatedWallets = [...wallets, wallet];
      setWallets(updatedWallets);
      localStorage.setItem("wallets", JSON.stringify(updatedWallets));
      localStorage.setItem("mnemonics", JSON.stringify(words));
      localStorage.setItem("paths", JSON.stringify(pathTypes));
      setVisiblePrivateKeys([...visiblePrivateKeys, false]);
      setVisiblePhrases([...visiblePhrases, false]);
      toast.success("Wallet generated successfully!");
    }
  };

  const handleAddWallet = () => {
    if (!mnemonicWords) {
      toast.error("No mnemonic found. Please generate a wallet first.");
      return;
    }

    const wallet = generateWalletFromMnemonic(
      pathTypes[0],
      mnemonicWords.join(" "),
      wallets.length
    );
    if (wallet) {
      const updatedWallets = [...wallets, wallet];
      setWallets(updatedWallets);
      localStorage.setItem("wallets", JSON.stringify(updatedWallets));
      setVisiblePrivateKeys([...visiblePrivateKeys, false]);
      setVisiblePhrases([...visiblePhrases, false]);
      toast.success("Wallet added successfully!");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {wallets.length === 0 && (
        <motion.div
          className="flex flex-col gap-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.3,
            ease: "easeInOut",
          }}
        >
          <div className="flex flex-col gap-4">
            {pathTypes.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  ease: "easeInOut",
                }}
                className="flex gap-4 flex-col my-12"
              >
                <div className="text-center flex flex-col gap-2">
                  <h1 className="tracking-tighter text-4xl md:text-5xl font-black">
                   Create Wallets
                  </h1>
                  <p className="text-primary/80 font-semibold text-lg md:text-xl">
                    Choose a blockchain to get started.
                  </p>
                </div>
                <div className="flex justify-center gap-2">
                  <Button
                    size={"lg"}
                    onClick={() => {
                      setPathTypes(["501"]);
                      toast.success(
                        "Wallet selected. Please generate a wallet to continue."
                      );
                    }}
                  >
                    Solana
                  </Button>
                  <Button
                    size={"lg"}
                    onClick={() => {
                      setPathTypes(["60"]);
                      toast.success(
                        "Wallet selected. Please generate a wallet to continue."
                      );
                    }}
                  >
                    Ethereum
                  </Button>
                </div>
              </motion.div>
            )}
            {pathTypes.length !== 0 && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  ease: "easeInOut",
                }}
                className="flex flex-col gap-4"
              >
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-muted-foreground">
                    Generating {pathTypeName} wallet.
                  </p>
                  <h1 className="tracking-tighter text-4xl md:text-5xl font-black">
                    Generate a {pathTypeName} wallet.
                  </h1>
                  <p className="text-primary/80 font-semibold text-lg md:text-xl">
                    You can use your own recovery phrase.
                  </p>
                </div>
                <Input
                  type={showMnemonic ? "text" : "password"}
                  value={mnemonicInput}
                  onChange={(e) => setMnemonicInput(e.target.value)}
                  placeholder="Enter your recovery phrase (optional)"
                  className="mb-2"
                />
                <Button
                  onClick={() => setShowMnemonic(!showMnemonic)}
                  variant="outline"
                  className="mb-4"
                >
                  {showMnemonic ? <EyeOff /> : <Eye />}
                  {showMnemonic ? "Hide" : "Show"} Mnemonic
                </Button>
                <Button size="lg" onClick={handleGenerateWallet}>
                  Generate Wallet
                </Button>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
      {wallets.length > 0 && (
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">
              Your {pathTypeName} Wallets ({wallets.length})
            </h2>
            <div className="flex gap-2">
              <Button variant="destructive" onClick={handleClearWallets}>
                <Trash />
                Clear All
              </Button>
            </div>
          </div>
          <div
            className={`grid gap-4 ${
              gridView ? "grid-cols-2 md:grid-cols-3" : "grid-cols-1"
            }`}
          >
            {wallets.map((wallet, index) => (
              <motion.div
                key={index}
                className="border p-4 rounded-lg bg-background shadow-sm relative"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  ease: "easeInOut",
                }}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-lg">Wallet {index + 1}</p>
                    <p className="text-sm text-muted-foreground">{wallet.path}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => togglePrivateKeyVisibility(index)}
                    >
                      {visiblePrivateKeys[index] ? <EyeOff /> : <Eye />}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => togglePhraseVisibility(index)}
                    >
                      {visiblePhrases[index] ? <EyeOff /> : <Eye />}
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon">
                          <Trash />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete this wallet.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteWallet(index)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="font-semibold text-sm text-muted-foreground">
                    Public Key
                  </p>
                  <p className="mb-2 text-lg">{wallet.publicKey}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(wallet.publicKey)}
                  >
                    <Copy />
                    Copy Public Key
                  </Button>
                </div>
                <div className="mt-4">
                  <p className="font-semibold text-sm text-muted-foreground">
                    Private Key
                  </p>
                  <p className="mb-2 text-lg">
                    {visiblePrivateKeys[index]
                      ? wallet.privateKey
                      : "•".repeat(64)}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(wallet.privateKey)}
                  >
                    <Copy />
                    Copy Private Key
                  </Button>
                </div>
                <div className="mt-4">
                  <p className="font-semibold text-sm text-muted-foreground">
                    Recovery Phrase
                  </p>
                  <p className="mb-2 text-lg">
                    {visiblePhrases[index]
                      ? wallet.mnemonic
                      : "•".repeat(wallet.mnemonic.length)}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(wallet.mnemonic)}
                  >
                    <Copy />
                    Copy Recovery Phrase
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
          <Button size="lg" onClick={handleAddWallet}>
            Add Another Wallet
          </Button>
        </div>
      )}
    </div>
  );
};

export default WalletGenerator;
