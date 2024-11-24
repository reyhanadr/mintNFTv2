"use client";

import React, { useState, useEffect } from "react";
import {
  Button,
  Flex,
  Logo,
  NavIcon,
  ToggleButton,
} from "@/once-ui/components";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/once-ui/modules";
import {
  useCreateWalletInstance,
  useSetConnectionStatus,
  useSetConnectedWallet,
  metamaskWallet,
  useConnectionStatus,
  useSigner,
} from "@thirdweb-dev/react";

const walletConfig = metamaskWallet();

const Header: React.FC = () => {
  const pathname = usePathname() ?? "";
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Status menu mobile
  const [address, setAddress] = useState<string | null>(null);
  const createWalletInstance = useCreateWalletInstance();
  const setConnectionStatus = useSetConnectionStatus();
  const setConnectedWallet = useSetConnectedWallet();
  const connectionStatus = useConnectionStatus();
  const signer = useSigner();
  const walletInstance = createWalletInstance(walletConfig);
  const connectOptions = {
    chainId: 11155111, // Sepolia testnet chainId
  };
  const handleConnect = async () => {
    setConnectionStatus("connecting");
    try {
      await walletInstance.connect(connectOptions);
      setConnectedWallet(walletInstance);
    } catch {
      setConnectionStatus("disconnected");
    }
  };

  const handleDisconnect = async () => {
    await walletInstance.disconnect();
    setConnectionStatus("disconnected");
    setAddress(null);
  };
  // Fungsi untuk toggle menu mobile
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const fetchAddress = async () => {
      if (signer) {
        try {
          const userAddress = await signer.getAddress();
          setAddress(userAddress);
        } catch {
          setAddress(null);
        }
      }
    };
    fetchAddress();
  }, [signer]);

  return (
    <Flex
      as="header"
      fillWidth
      paddingX="m"
      height="56"
      alignItems="center"
      background="surface"
      style={{ borderBottom: "1px solid var(--neutral-border-medium)" }}
    >
      <Flex hide="s">
        <Logo />
      </Flex>
      <Flex show="s" gap="4" alignItems="center">
        <NavIcon onClick={toggleMenu} />
        <Logo wordmark={false} />
      </Flex>
      <Flex fillWidth alignItems="center" justifyContent="space-between">
        <Flex fillWidth>
          <Flex hide="s" fillWidth gap="4" paddingX="l" alignItems="center">
            <ToggleButton
              selected={pathname === "/"}
              href={`/`}
              label="Dashboard"
            />
            <ToggleButton
              selected={pathname.startsWith("/gallery")}
              href={`/gallery`}
              label="Gallery"
            />
          </Flex>
        </Flex>

        <Flex alignItems="center" gap="8">
          <Button
            size="s"
            variant="secondary"
            label="Mint NFT"
            href={`/mintNFT`}
          />
          {connectionStatus === "connecting" ? (
            <Button size="s" variant="primary" label="Connecting..." disabled />
          ) : connectionStatus === "connected" ? (
            <Button
              size="s"
              variant="primary"
              label={
                address
                  ? `Connected: ${address.slice(0, 6)}...${address.slice(-4)}`
                  : "Disconnect"
              }
              onClick={handleDisconnect}
            />
          ) : (
            <Button
              size="s"
              variant="primary"
              label="Connect"
              onClick={handleConnect}
            />
          )}
        </Flex>
      </Flex>
      {/* Navigasi Mobile */}
      {isMenuOpen && (
        <Flex
          direction="column"
          gap="8"
          padding="m"
          // background="brand-medium"
          fillWidth
          maxWidth={20}
          position="absolute"
          // marginTop='56'
          marginLeft="0"
          marginRight="0"
          zIndex={100}
          style={{
            left: "0px",
            minWidth: "100%",
            position: "absolute",
            top: "50px",
          }}
        >
          <Sidebar></Sidebar>
        </Flex>
      )}
    </Flex>
  );
};

Header.displayName = "Header";
export { Header };
