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
    default: 3,  // Default number of columns for large screens (desktop)
    1200: 3,     // 3 columns for screens 1200px and above
    768: 2,      // 2 columns for screens 768px and above (tablets)
    480: 1,      // 1 column for screens 480px and below (mobile)
  };

  const apiKey = process.env.NEXT_PUBLIC_OPENSEA_API_KEY;
  const contractAddress = "0xA895a9b5882DBa287CF359b6a722C5be46aCb675"; // Change with desired wallet address
  const [nftData, setNftData] = useState<NFTMetadata[]>([]); // Rendered NFTs state
  const [initialLoading, setInitialLoading] = useState(true);
  const [scrollLoading, setScrollLoading] = useState(false);
  const [limit, setLimit] = useState(16); // Render 16 items initially
  const [allNFTs, setAllNFTs] = useState<NFTMetadata[]>([]); // Store all fetched NFTs
  const loadMoreRef = useRef<HTMLDivElement | null>(null); // Adding type to useRef
  const [allLoaded, setAllLoaded] = useState(false);

  const fetchNFTs = async (limit: number) => {
    try {
      const url = `https://testnets-api.opensea.io/api/v2/chain/sepolia/contract/${contractAddress}/nfts?limit=59`;
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

        setAllNFTs(mappedNFTs); // Store all NFTs
        setNftData(mappedNFTs.slice(0, limit)); // Show only the first 'limit' NFTs
      } else {
        console.error("NFTs not found in the response or incorrect structure.");
      }
      setInitialLoading(false); // Set loading finished
      setScrollLoading(false);  // End loading when done
    } catch (error) {
      console.error("Error fetching NFTs:", error);
      setInitialLoading(false);
      setScrollLoading(false);
    }
  };

    // Load more NFTs when the user scrolls near the bottom
    const handleScroll = () => {
        if (
        loadMoreRef.current &&
        loadMoreRef.current.getBoundingClientRect().top < window.innerHeight
        ) {
        setScrollLoading(true);
        setLimit((prevLimit) => {
            const newLimit = prevLimit + 10; // Add 10 more NFTs on each scroll
            if (newLimit <= 59) {
            setNftData(allNFTs.slice(0, newLimit)); // Update rendered NFTs incrementally
            if (newLimit === 59) {
                setScrollLoading(false);  // Stop loading once we hit 59 NFTs
                setAllLoaded(true);        // Indicate that all NFTs are loaded
            }
            return newLimit;
            }else {
                setScrollLoading(false);  // Stop loading once we hit 59 NFTs
                setAllLoaded(true);        // Indicate that all NFTs are loaded
                return prevLimit; // Don't increase limit beyond 59
              }
        });
        }
    };
  

  useEffect(() => {
    fetchNFTs(limit); // Fetch the full set of 59 NFTs initially
  }, []); // Run this effect once when component mounts

  useEffect(() => {
    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll); // Clean up the event listener
  }, [allNFTs]); // Depend on 'allNFTs' to avoid resetting scroll behavior

  return (
    <div>
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
                style={{ width: "100%" }}  // Ensure full width in mobile view
              >
                <SmartImage
                  src={nft.image_url}
                  alt={nft.name}
                  aspectRatio="4/3"
                  radius="m"
                  objectFit="contain"
                  priority={false}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ width: "100%", height: "auto" }}  // Ensure image is responsive
                  
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
    {allLoaded && (
        <Flex
          direction="column"
          gap="24"
          padding="24"
          alignItems="center"
          justifyContent="center"
          fillWidth
          radius="xs"
        >
          <Text>All NFTs are loaded</Text>
        </Flex>
      )}
    </div>
  );
}
