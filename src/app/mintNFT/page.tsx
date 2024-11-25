"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Flex, Button, Text, Input, Textarea, Toaster } from "@/once-ui/components";
import { MediaUpload } from "@/once-ui/modules/media/MediaUpload";
import { Header } from "@/once-ui/modules/layout/Header";
import { Footer } from "@/once-ui/modules/layout/Footer";
import { client } from "@/app/client";
import { contract } from "@/app/contract";
import { ThirdwebProvider} from "@thirdweb-dev/react";
import { upload } from "thirdweb/storage";
import { prepareContractCall } from "thirdweb";
import { useActiveAccount, useSendTransaction } from "thirdweb/react";

export default function mintNFT() {
  // use for form
  const [image, setImage] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [externalUrl, setExternalUrl] = useState("");
  // Use for mint or minting label button
  const [isMinting, setIsMinting] = useState(false);
  // use for set toast
  const [toasts, setToasts] = useState<{ id: string; message: string; variant: "success" | "danger"; }[]>([]);
  // use to send tx with smart contract given 
  const account = useActiveAccount();
  const { mutate: sendTransaction } = useSendTransaction();
  // Router for Next Congrats page
  const router = useRouter();
  
  // Fungsi untuk menangani upload gambar ke IPFS
  const handleImageUpload = async (file: File): Promise<string | null> => {
    try {
      if (!client) {
        throw new Error("SDK belum diinisialisasi. Pastikan MetaMask terhubung.");
      }
      const fileToUpload = new File([file], file.name, { type: file.type });
      const uploadedImageUrl = await upload({
        client,
        files: [fileToUpload],
      });
      console.log("Uploaded Image URL:", uploadedImageUrl);
      setImage(uploadedImageUrl);
      return uploadedImageUrl;
    } catch (error) {
      console.error("Error uploading image to IPFS:", error);
      return null;
    }
  };

  // Fungsi untuk upload metadata NFT (name, desc, image, extrnl url) to IPFS
  const uploadMetadata = async (): Promise<string | null> => {
    try {
      if (!client) {
        throw new Error("SDK belum diinisialisasi. Pastikan MetaMask terhubung.");
      }
      if (!name || !description || !image) {
        throw new Error("Pastikan semua field telah diisi, termasuk gambar.");
      }
      
      const metadata = {
        name,
        description,
        image,
        external_url: externalUrl,
      };

      const metadataFile = new File(
        [JSON.stringify(metadata)],
        "metadata.json",
        { type: "application/json" }
      );
      const uploadedMetadataUrl = await upload({
        client,
        files: [metadataFile],
      });
      console.log("Uploaded Metadata URL:", uploadedMetadataUrl);
      return uploadedMetadataUrl;
    } catch (error) {
      console.error("Error uploading metadata to IPFS:", error);
      const errorMessage = error instanceof Error ? error.message : "Gagal mengunggah metadata ke IPFS.";
      return null;
    }
  };

    // Fungsi untuk menambah toast
    const addToast = (message: string, variant: "success" | "danger") => {
      const id = Date.now().toString();
      setToasts((prevToasts) => [...prevToasts, { id, message, variant }]);
      setTimeout(() => removeToast(id), 5000); // Hapus toast setelah 5 detik
    };
  
    // Fungsi untuk menghapus toast
    const removeToast = (id: string) => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    };

  // Fungsi untuk mint NFT
  const mintNFT = async () => {
    try {
      // Set minting for button label
      setIsMinting(true);

      // if else condition client thirdweb
      if (!client || !contract) {
        throw new Error("Client or contract has not been initialized. Make sure everything is ready.");
      }
      // if else condition connected wallet or not
      if (!account?.address) {
        throw new Error("Wallet is not Connected, please connect your wallet.");
      }
  
      // validation input metadata
      if (!name || !description || !image) {
        throw new Error("Make sure all fields (name, description, image) are filled in.");
      }
  
      // upload metadata to IPFS
      const metadataUrl = await uploadMetadata();
      if (!metadataUrl) {
        throw new Error("Metadata gagal diunggah ke IPFS.");
      }
      console.log("NFT Metadata URL:", metadataUrl);
  
      // preprare transaksi
      const transaction = prepareContractCall({
        contract,
        method: "function mintNFT(address recipient, string tokenURI) returns (uint256)",
        params: [account.address, metadataUrl],
      });
  
      // Mengirim transaksi menggunakan fungsi sendTransaction thirdweb
      sendTransaction(transaction, {
        onSuccess: async (transactionReceipt) => {
          // Mengambil transactionHash dari hasil transaksi
          const { transactionHash } = transactionReceipt;
  
          // Tampilkan transaksi hash di konsol atau UI
          console.log("Transaction Hash:", transactionHash);
          addToast(`NFT successfully minted! TxHash: ${transactionHash}`, "success");
  
          // Simpan data NFT ke sessionStorage for next page congrats
          sessionStorage.setItem(
            "mintedNFTData",
            JSON.stringify({
              image,
              name,
              description,
              externalUrl,
            })
          );
  
          // Redirect ke halaman success-mint if succeed
          router.push("/success-mint");
          setIsMinting(false);
        },
        onError: (error) => {
          console.error("Transaction failed:", error);
          addToast("NFT minting failed. Please try again.", "danger");
          setIsMinting(false); // set button label to mint after minting failed
        },
      });
    } catch (error: unknown) {
      const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred during minting.";
      console.error("Minting error:", error);
      addToast(errorMessage, "danger");
      setIsMinting(false); // set button label to mint after minting failed

    }
  };
  
  // Fungsi untuk menangani submit form
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim()) {
      addToast("NFT name not yet filled.", "danger");
      return;
    }
    if (!description.trim()) {
      addToast("NFT description not yet filled.", "danger");
      return;
    }
    if (!image) {
      addToast("NFT image not yet selected.", "danger");
      return;
    }
    // Call function mintNFT() to mint.
    await mintNFT();
  };
  
  return (
  <ThirdwebProvider
    clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}
  >
    <Flex
      fillWidth
      paddingTop="l"
      paddingX="l"
      direction="column"
      alignItems="center"
      flex={1}
    >
      <Flex
        position="relative"
        as="section"
        overflow="hidden"
        fillWidth
        minHeight="0"
        direction="column"
        alignItems="center"
        flex={1}
      >
        <Header/>
        <Flex
          gap="24"
          padding="24"
          alignItems="center"
          justifyContent="center"
          fillWidth
        >
          {toasts.length > 0 && <Toaster toasts={toasts} removeToast={removeToast} />}
          <Text variant="heading-strong-xl" onBackground="neutral-medium">
            Mint NFT
          </Text>
          
        </Flex>
        <Flex
          gap="24"
          padding="32"
          alignItems="start"
          justifyContent="start"
          fillWidth
          direction="column"
          maxWidth={68}
        >
          <Text variant="heading-strong-m" onBackground="neutral-medium">
            Image of NFT
          </Text>
          <Flex
            border="neutral-medium"
            borderStyle="solid-1"
            direction="row"
            alignItems="center"
            justifyContent="center"
            fillWidth
            radius="l"
          >
            <Flex
              direction="column"
              gap="32"
              padding="32"
              justifyContent="start"
              fillWidth
              maxWidth={15}
            >
              <MediaUpload
                compress
                aspectRatio="1/1"
                quality={0.8}
                initialPreviewImage="/images/upload_image.png"
                onFileUpload={async (file) => {
                  await handleImageUpload(file);
                }}
                
              />
            </Flex>
            <Flex
              direction="column"
              gap="20"
              padding="20"
              justifyContent="start"
              fillWidth
            >
              <Text
                variant="heading-strong-s"
                onBackground="neutral-medium"
              >
                Drag and drop or click to upload
              </Text>
              <Text variant="body-default-s" onBackground="neutral-medium">
                Recommended size: 350 x 350 or aspect ratio 1/1. File types: JPG, or PNG
              </Text>
            </Flex>
          </Flex>
          <Text variant="heading-strong-xs" onBackground="neutral-medium">
            Name of NFT
          </Text>
          <Input
            id="name"
            label="e.g. Damn Cool Cat"
            value={name}
            labelAsPlaceholder
            onChange={(e) => setName(e.target.value)}
          />
          <Text variant="heading-strong-xs" onBackground="neutral-medium">
            Description of NFT
          </Text>
          <Textarea
            id="description"
            label="What's your description?"
            value={description}
            lines={4}
            labelAsPlaceholder
            resize="vertical"
            onChange={(e) => setDescription(e.target.value)}
          />
          <Text variant="heading-strong-xs" onBackground="neutral-medium">
            External URL of NFT
          </Text>
          <Input
            id="externalUrl"
            label="e.g. https://external-url.com"
            value={externalUrl}
            labelAsPlaceholder
            onChange={(e) => setExternalUrl(e.target.value)}
          />
          <Flex
            marginTop="16"
            alignItems="center"
            justifyContent="center"
            fillWidth
          >
            <Button
              size="l"
              variant="primary"
              onClick={handleSubmit}
              disabled={isMinting}
            >
              {isMinting ? "Minting..." : "Mint NFT"}
            </Button>
          </Flex>
        </Flex>
      </Flex>
      <Footer></Footer>
    </Flex>
  </ThirdwebProvider>

  );
}