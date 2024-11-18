"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Heading,
  Text,
  Flex,
  Button,
  RevealFx,
  SmartImage,
  Grid,
  Icon,
  Input,
  InlineCode,
  Logo,
  Background,
  LetterFx,
  Arrow,
} from "@/once-ui/components";
import { Header } from "@/once-ui/modules/layout/Header";
import Link from "next/link";

export default function SuccessMint() {
  const [mintedNFTData, setMintedNFTData] = useState<any>(null);

  useEffect(() => {
    // Ambil data dari sessionStorage saat halaman dimuat
    const data = sessionStorage.getItem('mintedNFTData');
    if (data) {
      setMintedNFTData(JSON.parse(data));
    }
  }, []);

  if (!mintedNFTData) {
    return (
      <Flex alignItems="center" justifyContent="center" fillWidth>
        <Text>Loading...</Text>
      </Flex>
    );
  }

  // Mengekstrak hash dan path file dari IPFS URL
  const ipfsUrl = mintedNFTData.image; // "ipfs://QmRw59D9GwuCFDKuieyg1umBgdF3FpZmTjN6pb1wBffdWe/lesson%20on%20fine-tuning%20BERT%20models.png"
  const ipfsHash = ipfsUrl.replace("ipfs://", ""); // Hapus prefix "ipfs://"

  // Menyusun URL untuk IPFS Gateway
  const ipfsGatewayUrl = `https://ipfs.io/ipfs/${ipfsHash}`;


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
        <RevealFx speed="medium" delay={0} translateY={0}>
          <Flex
            direction="column"
            padding="24"
            alignItems="center"
            justifyContent="center"
            gap="8"
          >
            <Text
              variant="heading-strong-m"
              onBackground="neutral-medium"
              marginBottom="16"
            >
              Congratulations
            </Text>
            <Text onBackground="neutral-medium">
              You've crystalized your art, it will be marked for so long time.
            </Text>

            <Flex
              direction="column"
              marginTop="24"
              gap="24"
              padding="24"
              alignItems="center"
              justifyContent="center"
              fillWidth
              border="neutral-medium"
              borderStyle="solid-1"
              radius="m"
              onBackground="neutral-strong"
              background="accent-medium"
              maxWidth={30}
              marginBottom="24"
            >
              <SmartImage
                src={ipfsGatewayUrl} // Menampilkan gambar dari IPFS Gateway
                alt="Minted NFT"
                aspectRatio="16/9"
                radius="m"
                objectFit="cover"
              />
              <Flex
                direction="column"
                fillWidth
                gap="12"
                alignItems="start"
              >
                <Text variant="heading-strong-m">{mintedNFTData.name}</Text>
                <Text size="s">{mintedNFTData.description}</Text>
              </Flex>
            </Flex>

            <Button size="s" variant="tertiary">
              Back to Home
            </Button>
          </Flex>
        </RevealFx>
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
