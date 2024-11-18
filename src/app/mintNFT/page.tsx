
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Flex, Button, Text, Input, Textarea } from "@/once-ui/components";
import { MediaUpload } from "@/once-ui/modules/media/MediaUpload";
import { Header } from "@/once-ui/modules/layout/Header";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { ethers } from "ethers";
import Link from "next/link";

export default function MintNFT() {
  const [image, setImage] = useState<string | null>(null); // Store image URL
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [externalUrl, setExternalUrl] = useState("");
  const [isMinting, setIsMinting] = useState(false);
  const [mintError, setMintError] = useState<string | null>(null);
  const router = useRouter();
  
  const contractAddress = "0xA895a9b5882DBa287CF359b6a722C5be46aCb675";
  
  // Global configuration for ThirdwebSDK
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const sepoliaChainId = 11155111;
  const sdk = new ThirdwebSDK(provider, {
    chainId: sepoliaChainId,
    clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
    secretKey: process.env.NEXT_PUBLIC_THIRDWEB_SECRET_KEY,
  });

  // Fungsi untuk menangani upload gambar ke IPFS
  const handleImageUpload = async (file: File): Promise<string | null> => {
    try {
      const fileToUpload = new File([file], file.name, { type: file.type });
      const uploadedImageUrl = await sdk.storage.upload(fileToUpload);
      console.log("Uploaded Image URL:", uploadedImageUrl);
      setImage(uploadedImageUrl);
      return uploadedImageUrl;
    } catch (error) {
      console.error("Error uploading image to IPFS:", error);
      return null;
    }
  };

  // Fungsi untuk upload metadata NFT ke IPFS
  const uploadMetadata = async (): Promise<string | null> => {
    try {
      if (!name || !description || !image) {
        throw new Error("Pastikan semua field telah diisi, termasuk gambar.");
      }
      
      const metadata = {
        name,
        description,
        image, // URL gambar dari IPFS
        external_url: externalUrl,
      };

      const metadataFile = new File(
        [JSON.stringify(metadata)],
        "metadata.json",
        { type: "application/json" }
      );
      const uploadedMetadataUrl = await sdk.storage.upload(metadataFile);
      console.log("Uploaded Metadata URL:", uploadedMetadataUrl);
      return uploadedMetadataUrl;
    } catch (error) {
      console.error("Error uploading metadata to IPFS:", error);
      setMintError(error.message || "Gagal mengunggah metadata ke IPFS.");
      return null;
    }
  };

  // Fungsi untuk mint NFT
  const mintNFT = async () => {
    try {
      setIsMinting(true);
      setMintError(null);

      if (!window.ethereum) {
        alert("MetaMask tidak terdeteksi!");
        return;
      }

      const signer = provider.getSigner();
      const contract = await sdk.getContract(contractAddress);

      // Unggah metadata ke IPFS
      const metadataUrl = await uploadMetadata();
      if (!metadataUrl) {
        throw new Error("Metadata gagal diunggah ke IPFS.");
      }

      // Log metadata URL before minting
      console.log("NFT Metadata URL:", metadataUrl);

      const transactionData = {
        to: contractAddress,
        data: contract.encoder.encode("mintNFT", [
          await signer.getAddress(),
          metadataUrl, // URL metadata dari IPFS
        ]),
        gasLimit: ethers.utils.hexlify(300000),
      };

      const transactionResponse = await signer.sendTransaction(transactionData);
      await transactionResponse.wait(); // Tunggu transaksi konfirmasi
      alert("NFT berhasil di-mint!");

      // Simpan data ke sessionStorage setelah minting berhasil
      sessionStorage.setItem("mintedNFTData", JSON.stringify({
        image,
        name,
        description,
        externalUrl,
      }));

      // Redirect ke halaman success-mint setelah minting berhasil
      router.push("/success-mint");
    } catch (error) {
      setMintError(error.message || "Terjadi kesalahan saat minting");
      console.error("Minting error:", error);
    } finally {
      setIsMinting(false);
    }
  };

  // Fungsi untuk menangani submit form
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (image) {
      mintNFT();
    } else {
      console.log("Image URL is not yet available.");
    }
  };
  
  // Example of calling handleImageUpload and updating state
  // const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files ? event.target.files[0] : null;
  //   if (file) {
  //     const uploadedUrl = await handleImageUpload(file);
  //     if (uploadedUrl) {
  //       setImage(uploadedUrl); // Set image URL after upload
  //     } else {
  //       console.log("Failed to upload image.");
  //     }
  //   }
  // };
  
  

  return (
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
        maxWidth={68}
        direction="column"
        alignItems="center"
        flex={1}
      >
        <Header
          name="Scott"
          subline="Infinite Inc."
          avatar="/images/demos/avatar_01.png"
        />
        <Flex
          gap="24"
          padding="24"
          alignItems="center"
          justifyContent="center"
          fillWidth
          background="brand-weak"
        >
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
          background="brand-weak"
          direction="column"
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
                aspectRatio="4 / 3"
                quality={0.8}
                initialPreviewImage="/images/upload_image.png"
                onFileUpload={handleImageUpload} // Menggunakan onFileUpload yang menerima file
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
                Recommended size: 350 x 350. File types: JPG, PNG, SVG, or GIF
              </Text>
            </Flex>
          </Flex>
          <Text variant="heading-strong-xs" onBackground="neutral-medium">
            Name
          </Text>
          <Input
            id="name"
            label="e.g. Damn Cool Cat"
            value={name}
            labelAsPlaceholder
            onChange={(e) => setName(e.target.value)}
          />
          <Text variant="heading-strong-xs" onBackground="neutral-medium">
            Description
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
            External URL
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
          {mintError && (
            <Text color="danger" variant="body-default-s">
              {mintError}
            </Text>
          )}
        </Flex>
      </Flex>
      <Flex
        as="footer"
        position="relative"
        fillWidth
        paddingX="l"
        paddingY="m"
        justifyContent="space-between"
      >
        <Text variant="body-default-s" onBackground="neutral-weak">
          © 2024 Once UI,{" "}
          <Link href="https://github.com/once-ui-system/nextjs-starter?tab=MIT-1-ov-file">
            MIT License
          </Link>
        </Text>
        <Flex gap="12">
          <Button
            href="https://github.com/once-ui-system/nextjs-starter"
            prefixIcon="github"
            size="s"
            variant="tertiary"
          >
            GitHub
          </Button>
          <Button
            href="https://discord.com/invite/5EyAQ4eNdS"
            prefixIcon="discord"
            size="s"
            variant="tertiary"
          >
            Discord
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
}
