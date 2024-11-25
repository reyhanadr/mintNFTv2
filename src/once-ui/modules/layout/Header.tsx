"use client";

import React, { useState, useEffect } from "react";
import {
  Button,
  Flex,
  Logo,
  NavIcon,
  ToggleButton,
  UserMenu,
  DropdownOptions,
} from "@/once-ui/components";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/once-ui/modules";
import { useActiveAccount, useActiveWallet, useAutoConnect, useConnect, useConnectModal, useDisconnect } from "thirdweb/react";
import { createWallet, getWalletBalance } from "thirdweb/wallets";
import { client } from "@/app/client";
import { defineChain } from "thirdweb";

const Header: React.FC = () => {
  const pathname = usePathname() ?? "";
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Status menu mobile
  const [address, setAddress] = useState<String | null>(null); // State to store balance
  const [balance, setBalance] = useState<number | null>(null); // State to store balance
  const [symbol, setSymbol] = useState<String | null>(null); // State to store balance
  

  // Get active account, wallet and chain
  const account = useActiveAccount();
  const connectedWallet = useActiveWallet();

  // Get disconnect functions
  const { disconnect } = useDisconnect();

  // Initialize wallet chains (for example, Sepolia)
  const sepolia = defineChain(11155111);

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
    const wallet = await connect({
      client: client,
      theme: "light",
      chain: sepolia, // Use the Sepolia chain for connection
      wallets: wallets,
    });
    console.log("Wallet successfully connected:", wallet);
  };

  // Auto connect wallet on page load
  const { data: autoConnected } = useAutoConnect({
    client: client,
    wallets: wallets,
    onConnect(wallet) {
      console.log("Auto connected wallet:", wallet);
    },
  });

  // Handle Get Wallet Balance
  const fetchBalance = async () => {
    if (account && account.address && connectedWallet && sepolia) {
      const walletAddress = account.address; // Safely get the address
      try {
        const balance = await getWalletBalance({
          address: walletAddress,
          client: client,
          chain: sepolia,  // Pass the active chain here
        });
        setAddress(walletAddress);
        setBalance(Number(balance.displayValue));
        setSymbol(balance.symbol);
        console.log("Balance:", balance);
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    } else {
      // console.error("Account or wallet not connected");
    }
  };

  useEffect(() => {
    fetchBalance(); // Fetch balance on component mount
  }, [account, connectedWallet, sepolia]); // Only fetch when dependencies change

  // Fungsi untuk dropdown disconnect
  const handleOptionSelect = (option: DropdownOptions) => {
    console.log("Selected option:", option);
    if (option.value === "Disconnect" && connectedWallet) {
      disconnect(connectedWallet);
      console.log("Wallet disconnected:", connectedWallet);
    }
  };

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
            <UserMenu
              name={address ? `${address.slice(0, 4)}...${address.slice(-4)}` : "Loading..."}  // Pastikan format interpolasi string benar
              subline={`${symbol}: ${balance !== null ? balance.toFixed(4) : "Loading..."}`}
              avatarProps={{
                empty: true,
                value: "A",
              }}
              dropdownOptions={[
                {
                  label: "Disconnect",
                  value: "Disconnect",
                },
              ]}
              dropdownProps={{
                onOptionSelect: handleOptionSelect,
              }}
            />
          ) : (
            <Button
              size="s"
              variant="primary"
              label="Connect Wallet"
              onClick={handleConnect}
            />
          )}
        </Flex>
      </Flex>
      {isMenuOpen && (
        <Flex
          direction="column"
          gap="8"
          padding="m"
          fillWidth
          maxWidth={20}
          position="absolute"
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
