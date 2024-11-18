import Masonry from "react-masonry-css";
import { SmartImage, Flex, Text, Button } from "@/once-ui/components";
import { useState, useEffect } from "react";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";

// Definisikan tipe data untuk NFT metadata
interface NFTMetadata {
    tokenId: number;
    name?: string;
    description?: string;
    image?: string;
}

export default function MasonryGrid() {
    const breakpointColumnsObj = {
        default: 3, // 3 columns for desktop
        768: 2,     // 2 columns for tablet
        480: 1      // 1 column for mobile
    };

    const contractAddress = "0xA895a9b5882DBa287CF359b6a722C5be46aCb675";
    const [nftData, setNftData] = useState<NFTMetadata[]>([]); // tipe data NFTMetadata[]
    const [totalTokens, setTotalTokens] = useState(0); // tipe data tokenIdCounter

    // Load API key from environment variables
    const sdk = new ThirdwebSDK("sepolia", {
        clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
        secretKey: process.env.NEXT_PUBLIC_THIRDWEB_SECRET_KEY,
    });

    useEffect(() => {
        const getTotalTokens = async () => {
            try {
                // Instantiate contract
                const contract = await sdk.getContract(contractAddress);

                // Call _tokenIdCounter function
                const tokenIdCounter = await contract.call("_tokenIdCounter", []);

                // Set the total token count from the result
                setTotalTokens(parseInt(tokenIdCounter)); // pastikan mengonversi ke angka
                console.log("tokenIdCounter:", tokenIdCounter);
            } catch (error) {
                console.error("Error fetching tokenIdCounter:", error);
            }
        };

        getTotalTokens();
    }, []);

    // Fungsi untuk mempersingkat deskripsi
    const shortenDescription = (description: string | undefined, maxLength: number = 100): string => {
        if (!description) return "No description available";
        if (description.length <= maxLength) return description;
        return description.slice(0, maxLength) + "..."; // Menambahkan "..." di akhir deskripsi yang panjang
    };

    // Fetch NFT metadata berdasarkan token ID
    const fetchNFTMetadata = async (tokenId: number): Promise<NFTMetadata | null> => {
        try {
            // Instantiate contract
            const contract = await sdk.getContract(contractAddress);

            // Call tokenURI function
            const tokenUri = await contract.call("tokenURI", [tokenId]);

            // Fetch metadata from the token URI
            const response = await fetch(tokenUri.replace("ipfs://", "https://ipfs.io/ipfs/"));
            const metadata = await response.json();

            return { tokenId, ...metadata };
        } catch (error) {
            console.error(`Error fetching metadata for tokenId ${tokenId}:`, error);
            return null;
        }
    };

    useEffect(() => {
        if (totalTokens > 0) {
            const tokenIds = Array.from({ length: totalTokens }, (_, index) => index); // Membuat array dari 0 hingga totalTokens
            const loadNFTs = async () => {
                const dataPromises = tokenIds.map((id) => fetchNFTMetadata(id));
                const results = await Promise.all(dataPromises);
                setNftData(results.filter((item): item is NFTMetadata => item !== null)); // Tambahkan type guard
            };
            loadNFTs();
        }
    }, [totalTokens]);

    return (
        <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
        >
            {nftData.length > 0 ? (
                nftData.map((nft) => (
                    nft && nft.tokenId ? (  // Pastikan nft dan tokenId ada
                        <Flex
                            key={nft.tokenId} // Menggunakan tokenId yang ada
                            direction="column"
                            alignItems="center"
                            justifyContent="center"
                            border="neutral-medium"
                            borderStyle="solid-1"
                            radius="m"
                            onBackground="neutral-strong"
                            background="accent-medium"
					        shadow='l'

                        >
                            <SmartImage
                                src={nft.image?.replace("ipfs://", "https://ipfs.io/ipfs/") || ''}
                                alt={nft.name || "NFT Image"}
                                aspectRatio="16/9"
                                radius="m"
                                objectFit="cover"
                                priority={false} // {false} | {true}
                            />
                            <Flex
                                direction="column"
                                fillWidth
                                gap="12"
                                padding="24"
                                alignItems="start"
                            >
                                <Text variant="heading-strong-m">{nft.name || "Unknown Name"}</Text>
                                <Text size="s">{shortenDescription(nft.description)}</Text> {/* Menggunakan fungsi shortenDescription */}
                                <Button
                                    size="s"
                                    variant="primary"
                                    href={`https://testnets.opensea.io/assets/sepolia/${contractAddress}/${nft.tokenId}`}
                                >
                                    View on OpenSea
                                </Button>
                            </Flex>
                        </Flex>
                    ) : null // Jangan tampilkan jika nft atau tokenId tidak ada
                ))
            ) : (
                <Text>No NFTs found.</Text> // Tampilkan pesan jika tidak ada NFT yang dimuat
            )}
        </Masonry>
    );
}
