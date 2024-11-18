"use client";

import React, { useState, useEffect } from 'react';
import { ethers } from "ethers";
import { Flex, Text, Button } from '@/once-ui/components';
import { Header } from '@/once-ui/modules/layout/Header';
import MasonryGrid from '@/components/MasonryGrid';
import Link from 'next/link';

const contractAddress = "0xA895a9b5882DBa287CF359b6a722C5be46aCb675";

export default function Gallery() {
  const [nfts, setNfts] = useState([]);
  const userAddress = "0xc65Dc240C8c036472B4C8d35b57329b091C3968F"; // Replace this with the actual user address

  // Function to fetch NFTs
  const fetchNFTs = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, [], provider); // Removed ABI

      const totalSupply = await contract.totalSupply();
      const nftData = [];

      for (let i = 0; i < totalSupply; i++) {
        const tokenId = await contract.tokenByIndex(i);
        const owner = await contract.ownerOf(tokenId);

        if (owner.toLowerCase() === userAddress.toLowerCase()) {
          const tokenURI = await contract.tokenURI(tokenId);
          const metadata = await fetch(tokenURI).then((res) => res.json());
          nftData.push({ tokenId, ...metadata });
        }
      }

      setNfts(nftData);
    } catch (error) {
      console.error("Error fetching NFTs:", error);
    }
  };

  useEffect(() => {
    fetchNFTs();
  }, []);

  return (
    <Flex fillWidth paddingTop="l" paddingX="l" direction="column" alignItems="center" flex={1}>
      <Flex position="relative" as="section" overflow="hidden" fillWidth minHeight="0" maxWidth={68} direction="column" alignItems="center" flex={1}>
        <Header name="Scott" subline="Infinite Inc." avatar="/images/demos/avatar_01.png" />
        
        <Flex gap="24" padding="24" alignItems="space-between" justifyContent="space-between" fillWidth background="brand-weak">
          <Text variant="heading-strong-l" onBackground="neutral-medium" marginTop="16">Gallery</Text>
        </Flex>

        <Flex direction="column" gap="24" padding="24" alignItems="center" justifyContent="center" fillWidth radius="m" onBackground="brand-strong" background="brand-weak">
          <MasonryGrid>
            {nfts.map(nft => (
              <div key={nft.tokenId}>
                <img src={nft.image || "/images/cover.png"} alt={nft.name} />
                <Text>{nft.name}</Text>
              </div>
            ))}
          </MasonryGrid>
        </Flex>
      </Flex>

      <Flex as="footer" position="relative" fillWidth paddingX="l" paddingY="m" justifyContent="space-between">
        <Text variant="body-default-s" onBackground="neutral-weak">
          © 2024 Once UI, <Link href="https://github.com/once-ui-system/nextjs-starter?tab=MIT-1-ov-file">MIT License</Link>
        </Text>
        <Flex gap="12">
          <Button href="https://github.com/once-ui-system/nextjs-starter" prefixIcon="github" size="s" variant="tertiary">GitHub</Button>
          <Button href="https://discord.com/invite/5EyAQ4eNdS" prefixIcon="discord" size="s" variant="tertiary">Discord</Button>
        </Flex>
      </Flex>
    </Flex>
  );
}
