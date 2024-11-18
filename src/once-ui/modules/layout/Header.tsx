'use client';

import React, { useState, useEffect } from 'react';
import { Button, Flex, Logo, NavIcon, SmartLink, Background, ToggleButton, UserMenu } from '@/once-ui/components';
import { usePathname } from 'next/navigation';
import { Sidebar } from '@/once-ui/modules';

const Header: React.FC = () =>  {
    const pathname = usePathname() ?? '';
    const [connected, setConnected] = useState(false); // Status koneksi MetaMask
    const [account, setAccount] = useState<string | null>(null); // Menyimpan alamat akun yang terhubung
    const [isMenuOpen, setIsMenuOpen] = useState(false); // Status menu mobile

    // Mengambil informasi wallet dari localStorage ketika komponen pertama kali dimuat
    useEffect(() => {
        const storedAccount = localStorage.getItem('metamaskAccount');
        if (storedAccount) {
            setAccount(storedAccount);
            setConnected(true);
        }
    }, []);

    // Fungsi untuk menghubungkan ke MetaMask
    const connectToMetaMask = async () => {
        if (window.ethereum) {
            try {
                const [account] = await window.ethereum.request({
                    method: 'eth_requestAccounts',
                });
                setAccount(account); // Menyimpan alamat akun
                setConnected(true); // Menandakan bahwa koneksi berhasil
                localStorage.setItem('metamaskAccount', account); // Menyimpan akun di localStorage
            } catch (error) {
                console.error('Koneksi MetaMask gagal', error);
                setConnected(false); // Jika terjadi error, set status koneksi menjadi false
            }
        } else {
            alert('MetaMask tidak terdeteksi di browser Anda!');
        }
    };

    // Fungsi untuk memutuskan koneksi MetaMask
    const disconnectFromMetaMask = () => {
        setAccount(null); // Menghapus alamat akun
        setConnected(false); // Menandakan bahwa koneksi terputus
        localStorage.removeItem('metamaskAccount'); // Menghapus akun dari localStorage
    };

    // Fungsi untuk toggle menu mobile
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <Flex
            style={{
                borderBottom: '1px solid var(--neutral-border-medium)',
            }}
            as="header"
            fillWidth
            paddingX="m"
            height="56"
            alignItems="center"
            background="surface"
        >
            {/* Logo */}
            <Flex hide="s">
                <Logo />
            </Flex>
            <Flex show="s" gap="4" alignItems="center">
                <NavIcon onClick={toggleMenu} />
                <Logo wordmark={false} />
            </Flex>

            {/* Navigasi Desktop */}
            <Flex
                    fillWidth
                    alignItems="center" justifyContent="space-between">
                    <Flex
                        fillWidth>
                        <Flex
                            hide="s"
                            fillWidth gap="4" paddingX="l"
                            alignItems="center">
                            <ToggleButton
                                selected={pathname === '/'} // Tambahkan kondisi untuk halaman dashboard
                                href={`/`} // Pastikan href mengarah ke halaman utama
                                label="Dashboard"
                            />
                            <ToggleButton
                                selected={pathname.startsWith('/gallery')} // Cocokkan semua URL di bawah /gallery
                                href={`/gallery`}
                                label="Gallery"
                            />
                            {/* <ToggleButton
                                selected={pathname.startsWith('/mint')} // Cocokkan semua URL di bawah /mint
                                href={`${baseURL}/mintNFT`}
                                label="Mint NFT"
                            /> */}
                        </Flex>
                    </Flex>
                    {/* Tombol Connect */}
                    <Flex alignItems="center" gap="8">
                        <Button
                            size="s"
                            variant="secondary"
                            label="Mint NFT"
                            href={`/mintNFT`}
                        />
                        <Button
                            size="s"
                            variant="primary"
                            label={
                                connected
                                    ? `Connected: ${account?.slice(0, 6)}...${account?.slice(-4)}`
                                    : 'Connect'
                            }
                            onClick={connected ? disconnectFromMetaMask : connectToMetaMask}
                        />
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
                    position='absolute'
                    // marginTop='56'
                    marginLeft='0'
                    marginRight='0'
                    zIndex={100}

                    style={{
                        left:"0px",
                        minWidth: "100%",
                        position: "absolute",
                        top: "50px"
                    }}
                >
                    <Sidebar></Sidebar>
                </Flex>
                
                // <Flex
                //     direction="column"
                //     gap="4"
                //     padding="m"
                //     background="page"
                //     style={{
                //         position: 'absolute',
                //         top: '56px',
                //         left: '0',
                //         right: '0',
                //         zIndex: 1000,
                //     }}
                // >
                //     <Sidebar></Sidebar>
                // </Flex>
            )}
        </Flex>
    );
};

Header.displayName = 'Header';
export { Header };
