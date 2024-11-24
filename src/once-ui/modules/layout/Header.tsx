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
import { useActiveAccount, useActiveWallet, useAutoConnect, useConnect, useConnectModal, useDisconnect } from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";
import { client } from "@/app/client";
import { defineChain } from "thirdweb"; 

const Header: React.FC = () => {
  const pathname = usePathname() ?? "";
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Status menu mobile
  
  // Get active account and wallet
  const account = useActiveAccount();
  const connectedWallet = useActiveWallet();

  // Get disconnect functions
  const { disconnect } = useDisconnect();

  // Get Sepolia Chain
  const sepolia = defineChain({
     id: 11155111,
  });

  const wallets = [
    createWallet("io.metamask"),
    createWallet("com.coinbase.wallet"),
    createWallet("com.bitget.web3"),
    createWallet("com.trustwallet.app"),
    createWallet("com.okex.wallet"),
  ];

  // Get connect modal function
  const { connect } = useConnectModal(); 
  const handleConnect = async () => {
    const wallet = await connect({ client: client, theme :'light', chain: sepolia, wallets: wallets });
  };

  // Auto connect wallet on page load
  const { data: autoConnected } = useAutoConnect({
    client: client,
    wallets: wallets,
    onConnect(wallet) {
        console.log("Auto connected wallet:", wallet);
    },
  });

  // const handleDisconnect = async () => {

  // };
  // Fungsi untuk toggle menu mobile
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };


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
          {account && connectedWallet ? (
          <Button
            size="s"
            variant="danger"
            label="Disconnect"
            onClick={() => disconnect(connectedWallet)}
          />
        ) : (
          <Button
            size="s"
            variant="primary"
            label="Connect Wallet"
            onClick={handleConnect} // Gunakan salah satu fungsi sesuai kebutuhan
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
