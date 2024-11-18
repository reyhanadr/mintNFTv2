"use client"
import { useState } from 'react';
import { MediaUpload } from "@/once-ui/modules/media/MediaUpload";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { ethers } from "ethers";


const Page = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const sepoliaChainId = 11155111;

  // Fungsi untuk menangani upload gambar
  const handleImageUpload = async (file: File) => {
    try {
      setLoading(true);

      // Inisialisasi thirdweb SDK
      const sdk = new ThirdwebSDK(new ethers.providers.Web3Provider(window.ethereum), {
        chainId: sepoliaChainId,
        clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
        secretKey: process.env.NEXT_PUBLIC_THIRDWEB_SECRET_KEY,
      });
      const storage = sdk.storage;

      // Upload gambar ke IPFS menggunakan thirdweb SDK
      const uploadedImage = await storage.upload([file]);

      // Mendapatkan URL gambar yang diupload
      const imageUrl = uploadedImage[0];
      setImageUrl(imageUrl); // Menyimpan URL gambar ke state

      console.log('Gambar berhasil diupload ke IPFS:', imageUrl);
    } catch (error) {
      console.error('Gagal mengupload gambar:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Upload Gambar ke IPFS</h1>

      <MediaUpload
        compress
        aspectRatio="16 / 9"
        quality={1}
        initialPreviewImage={imageUrl ?? '/images/socialApp/5.jpg'}
        onFileUpload={handleImageUpload}
      />

      {loading && <p>Loading...</p>}

      {imageUrl && (
        <div>
          <h3>Gambar yang diupload:</h3>
          <img src={imageUrl} alt="Uploaded Image" style={{ maxWidth: '100%' }} />
        </div>
      )}
    </div>
  );
};

export default Page;
