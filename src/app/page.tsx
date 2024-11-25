"use client";

import React from 'react';

import { Heading, Text, Flex, Button, RevealFx, SmartImage, Grid, Icon, InlineCode, Logo, Background, LetterFx, Arrow } from '@/once-ui/components';
import { Header } from "@/once-ui/modules/layout/Header";
import { Footer } from "@/once-ui/modules/layout/Footer";
import MasonryGrid from '@/components/MasonryGrid';
import { ThirdwebProvider, metamaskWallet } from "@thirdweb-dev/react";

export default function Home() {
	return (
		<ThirdwebProvider
			supportedWallets={[metamaskWallet()]}
			clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}
		>
			<Flex
				fillWidth paddingTop="l" paddingX="l"
				direction="column" alignItems="center">
				<Flex
					position="relative"
					as="section" overflow="hidden"
					fillWidth minHeight="0"
					direction="column" alignItems="center">
					<Header/>
					<Flex
						direction="column"
						gap="24"
						padding="24"
						alignItems="center"
						justifyContent="center"
						fillWidth
						radius="l"
					>
						<RevealFx
							speed="medium"
							delay={0}
							translateY={0}
							>
							<Flex
								direction="column"
								padding="24"
								alignItems="center"
								justifyContent="center"
								gap="8"
								
							>
								<Text onBackground="neutral-medium">
									Create, Explore & Collect Digital Art NFTs
								</Text>
								<Text
									variant="heading-strong-m"
									onBackground="neutral-medium"
									marginBottom="16"
								>
									Crystalized Passion.
								</Text>
								<Button 
									size="m" 
									variant="primary" 
									href={`/gallery`} 
									label="Explore" 
								/>
							</Flex>
						</RevealFx>
						<RevealFx>
						<Flex					
							direction="column"
							gap="24"
							alignItems="center"
							justifyContent="center"
							fillWidth
							radius="l" 
							marginBottom='32'
						>
							<MasonryGrid 
								limit={16}>
							</MasonryGrid>
							<Button 
								size="m" 
								variant="secondary" 
								href={`/gallery`} 
								label="Show All" 
							/>
						</Flex>
						</RevealFx>
					</Flex>
				</Flex>
				<Footer></Footer>
			</Flex>
		</ThirdwebProvider>

	);
}
