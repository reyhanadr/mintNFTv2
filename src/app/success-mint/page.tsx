"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Text,
  Flex,
  Button,
  RevealFx,
  SmartImage,
} from "@/once-ui/components";
import { Header } from "@/once-ui/modules/layout/Header";
import { Footer } from "@/once-ui/modules/layout/Footer";
import { ThirdwebProvider, metamaskWallet } from "@thirdweb-dev/react";
import { Sepolia } from "@thirdweb-dev/chains";

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
    <ThirdwebProvider
      supportedWallets={[metamaskWallet()]}
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
              Loading
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
                src="/images/upload_image.png"
                isLoading
                alt="Minted NFT"
                aspectRatio="4/3"
                radius="m"
                objectFit="cover"
                priority={true}

              />
              <Flex
                direction="column"
                fillWidth
                gap="12"
                alignItems="start"
              >
              </Flex>
            </Flex>

            <Button size="s" variant="tertiary" href={`/`}>
              Back to Home
            </Button>
          </Flex>
        </RevealFx>
      </Flex>
      <Footer></Footer>
      </Flex>
    </ThirdwebProvider>

    );
  }

  // Mengekstrak hash dan path file dari IPFS URL
  const ipfsUrl = mintedNFTData.image; // "ipfs://QmRw59D9GwuCFDKuieyg1umBgdF3FpZmTjN6pb1wBffdWe/lesson%20on%20fine-tuning%20BERT%20models.png"
  const ipfsHash = ipfsUrl.replace("ipfs://", ""); // Hapus prefix "ipfs://"

  // Menyusun URL untuk IPFS Gateway
  const ipfsGatewayUrl = `https://ipfs.io/ipfs/${ipfsHash}`;


  return (
  <ThirdwebProvider
    supportedWallets={[metamaskWallet()]}
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
        maxWidth={68}
        direction="column"
        alignItems="center"
        flex={1}
      >
        <Header/>
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
                aspectRatio="4/3"
                radius="m"
                objectFit="contain"
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

            <Button size="s" variant="tertiary" href={`/`}>
              Back to Home
            </Button>
          </Flex>
        </RevealFx>
      </Flex>
      <Footer></Footer>
    </Flex>
  </ThirdwebProvider>

  );
}
