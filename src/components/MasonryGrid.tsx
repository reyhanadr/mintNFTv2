import Masonry from "react-masonry-css";
import { SmartImage, Flex, Text, Button, Spinner } from "@/once-ui/components";
import { useState, useEffect, useRef } from "react";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";

interface NFTMetadata {
    tokenId: number;
    name?: string;
    description?: string;
    image?: string;
}

export default function MasonryGrid() {
    const breakpointColumnsObj = {
        default: 3,
        768: 2,
        480: 1,
    };

    const contractAddress = "0xA895a9b5882DBa287CF359b6a722C5be46aCb675";
    const [nftData, setNftData] = useState<NFTMetadata[]>([]);
    const [totalTokens, setTotalTokens] = useState(0);
    const [initialLoading, setInitialLoading] = useState(true);
    const [scrollLoading, setScrollLoading] = useState(false);

    const sdk = new ThirdwebSDK("sepolia", {
        clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
        secretKey: process.env.NEXT_PUBLIC_THIRDWEB_SECRET_KEY,
    });

    const loadMoreRef = useRef(null);

    useEffect(() => {
        const getTotalTokens = async () => {
            try {
                const contract = await sdk.getContract(contractAddress);
                const tokenIdCounter = await contract.call("_tokenIdCounter", []);
                setTotalTokens(parseInt(tokenIdCounter));
            } catch (error) {
                console.error("Error fetching tokenIdCounter:", error);
            }
        };
        getTotalTokens();
    }, []);

    const shortenDescription = (description: string | undefined, maxLength: number = 100): string => {
        if (!description) return "No description available";
        if (description.length <= maxLength) return description;
        return description.slice(0, maxLength) + "...";
    };

    const fetchNFTMetadata = async (tokenId: number): Promise<NFTMetadata | null> => {
        try {
            const contract = await sdk.getContract(contractAddress);
            const tokenUri = await contract.call("tokenURI", [tokenId]);
            const response = await fetch(tokenUri.replace("ipfs://", "https://ipfs.io/ipfs/"));
            const metadata = await response.json();
            return { tokenId, ...metadata };
        } catch (error) {
            console.error(`Error fetching metadata for tokenId ${tokenId}:`, error);
            return null;
        }
    };

    const loadNFTs = async (startIndex: number, endIndex: number) => {
        if (initialLoading) return; // Tunggu initialLoading selesai
        setScrollLoading(true);
        const tokenIds = Array.from({ length: endIndex - startIndex }, (_, index) => startIndex + index);
        const dataPromises = tokenIds.map((id) => fetchNFTMetadata(id));
        const results = await Promise.all(dataPromises);
        setNftData((prev) => [...prev, ...results.filter((item): item is NFTMetadata => item !== null)]);
        setScrollLoading(false);
    };

    useEffect(() => {
        const options = {
            rootMargin: "200px",
            threshold: 1.0,
        };

        const observer = new IntersectionObserver((entries) => {
            if (
                entries[0].isIntersecting &&
                !scrollLoading &&
                !initialLoading // Tunggu initialLoading selesai
            ) {
                const currentLength = nftData.length;
                if (currentLength < totalTokens) {
                    loadNFTs(currentLength, currentLength + 10);
                }
            }
        }, options);

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        return () => {
            if (loadMoreRef.current) {
                observer.unobserve(loadMoreRef.current);
            }
        };
    }, [nftData, totalTokens, scrollLoading, initialLoading]);

    useEffect(() => {
        if (totalTokens > 0) {
            (async () => {
                await loadNFTs(0, 10);
                setInitialLoading(false); // Initial loading selesai
            })();
        }
    }, [totalTokens]);

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
                            nft && nft.tokenId ? (
                                <Flex
                                    key={nft.tokenId}
                                    direction="column"
                                    alignItems="center"
                                    justifyContent="center"
                                    border="neutral-medium"
                                    borderStyle="solid-1"
                                    radius="m"
                                    onBackground="neutral-strong"
                                    background="accent-medium"
                                    shadow="l"
                                >
                                    <SmartImage
                                        src={nft.image?.replace("ipfs://", "https://ipfs.io/ipfs/") || ''}
                                        alt={nft.name || "NFT Image"}
                                        aspectRatio="4/3"
                                        radius="m"
                                        objectFit="cover"
                                        priority={true}
                                    />
                                    <Flex direction="column" fillWidth gap="12" padding="24" alignItems="start">
                                        <Text variant="heading-strong-m">{nft.name || "Unknown Name"}</Text>
                                        <Text size="s">{shortenDescription(nft.description)}</Text>
                                        <Button
                                            size="s"
                                            variant="primary"
                                            href={`https://testnets.opensea.io/assets/sepolia/${contractAddress}/${nft.tokenId}`}
                                        >
                                            View on OpenSea
                                        </Button>
                                    </Flex>
                                </Flex>
                            ) : null
                        ))
                    ) : (
                        <Text> </Text>
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
