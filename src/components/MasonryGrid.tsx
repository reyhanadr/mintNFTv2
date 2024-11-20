import Masonry from "react-masonry-css";
import { SmartImage, Flex, Text, Button, Spinner } from "@/once-ui/components";
import { useState, useEffect, useRef } from "react";

interface NFTMetadata {
  identifier: string;
  name: string;
  description: string;
  image_url: string;
  display_image_url: string;
  opensea_url: string;
}

export default function MasonryGrid() {
  const breakpointColumnsObj = {
    default: 3,
    768: 2,
    480: 1,
  };

  const apiKey = process.env.NEXT_PUBLIC_OPENSEA_API_KEY;
  const contractAddress = "0xA895a9b5882DBa287CF359b6a722C5be46aCb675"; // Ganti dengan alamat wallet yang diinginkan
  const [nftData, setNftData] = useState<NFTMetadata[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [scrollLoading, setScrollLoading] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement | null>(null); // Menambahkan tipe pada useRef

  const fetchNFTs = async () => {
    try {
      const url = `https://testnets-api.opensea.io/api/v2/chain/sepolia/contract/${contractAddress}/nfts?limit=60`;
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          "X-API-KEY": apiKey as string,
        },
      };

      const response = await fetch(url, options);
      if (!response.ok) throw new Error("Failed to fetch NFT data");

      const result = await response.json();
      console.log("API Response:", result); // Log full response

      if (Array.isArray(result.nfts)) {
        const mappedNFTs = result.nfts.map((item: any) => ({
          identifier: item.identifier,
          name: item.name || "Unknown Name",
          description: item.description || "No description available",
          image_url: item.display_image_url || "/images/no_imagefound.png",
          opensea_url: item.opensea_url,
        }));
        setNftData(mappedNFTs);
      } else {
        console.error("NFTs not found in the response or incorrect structure.");
      }
      setInitialLoading(false); // Set loading selesai
    } catch (error) {
      console.error("Error fetching NFTs:", error);
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchNFTs();
  }, []); // Hanya dijalankan sekali saat komponen dimuat

  return (
    <div style={{ width: '100%' }}>
      {initialLoading ? (
        <Flex
          direction="column"
          gap="24"
          padding="24"
          alignItems="center"
          justifyContent="center"
          fillWidth
          radius="xs"
        >
          <Spinner size="l" />
          <Text>Loading...</Text>
        </Flex>
      ) : (
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {nftData.length > 0 ? (
            nftData.map((nft) => (
              <Flex
                key={`nft-${nft.identifier}`}
                direction="column"
                alignItems="center"
                justifyContent="center"
                border="neutral-medium"
                borderStyle="solid-1"
                radius="m"
                onBackground="neutral-strong"
                background="accent-medium"
                shadow="l"
                fillWidth
              >
                <SmartImage
                  src={nft.image_url}
                  alt={nft.name}
                  aspectRatio="4/3"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  radius="m"
                  objectFit="cover"
                  priority={true}
                />
                <Flex
                  direction="column"
                  fillWidth
                  gap="12"
                  padding="24"
                  alignItems="start"
                >
                  <Text variant="heading-strong-m">{nft.name}</Text>
                  <Text size="s">
                    {nft.description.length > 100
                      ? `${nft.description.slice(0, 100)}...`
                      : nft.description}
                  </Text>
                  <Button size="s" variant="primary" href={nft.opensea_url}>
                    View on OpenSea
                  </Button>
                </Flex>
              </Flex>
            ))
          ) : (
            <Text>No NFTs found</Text>
          )}
        </Masonry>
      )}
      <div ref={loadMoreRef}></div>
      {scrollLoading && (
        <Flex
          direction="column"
          gap="24"
          padding="24"
          alignItems="center"
          justifyContent="center"
          fillWidth
          radius="xs"
        >
          <Spinner size="l" />
          <Text>Loading more NFTs...</Text>
        </Flex>
      )}
    </div>
  );
}
