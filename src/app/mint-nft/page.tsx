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
  const [image, setImage] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [externalUrl, setExternalUrl] = useState("");
  const [isMinting, setIsMinting] = useState(false);
  const [mintError, setMintError] = useState<string | null>(null);
  const router = useRouter(); // Now it's correctly defined

  const contractAddress = "0xA895a9b5882DBa287CF359b6a722C5be46aCb675";
  const sepoliaChainId = 11155111;

  const handleImageUpload = (uploadedImageUrl: string) => {
    setImage(uploadedImageUrl);
  };

  const mintNFT = async () => {
    try {
      setIsMinting(true);
      setMintError(null);
  
      if (!window.ethereum) {
        alert("MetaMask tidak terdeteksi!");
        return;
      }
  
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const sdk = new ThirdwebSDK(provider, {
        chainId: sepoliaChainId,
        clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
        secretKey: process.env.NEXT_PUBLIC_THIRDWEB_SECRET_KEY,
      });
      
      const contract = await sdk.getContract(contractAddress);
  
      // Upload image to IPFS
      const uploadedImage = await sdk.storage.upload(image);
      const metadata = {
        name,
        description,
        image: uploadedImage,
        external_url: externalUrl,
      };
  
      const transactionData = {
        to: contractAddress,
        data: contract.encoder.encode("mintNFT", [
          await signer.getAddress(),
          JSON.stringify(metadata),
        ]),
        gasLimit: ethers.utils.hexlify(300000),
      };
  
      const transactionResponse = await signer.sendTransaction(transactionData);
      await transactionResponse.wait();  // Wait until the transaction is confirmed
      alert("NFT berhasil di-mint!");
      
      // Save data to sessionStorage after minting is successful
      sessionStorage.setItem('mintedNFTData', JSON.stringify({
        image: image,
        name: name,
        description: description,
        externalUrl: externalUrl,
      }));

      // Redirect to success-mint page after successful minting
      router.push('/success-mint');
      
    } catch (error) {
      setMintError(error.message || "Terjadi kesalahan saat minting");
      console.error("Minting error:", error);
    } finally {
      setIsMinting(false);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    mintNFT();
  };

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
                onUpload={handleImageUpload}
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
          <Text variant="heading-strong-xs" onBackground="neutral-medium" >
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
          <Text variant="heading-strong-xs" onBackground="neutral-medium" >
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
