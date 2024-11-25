"use client";

import React, { useState, useEffect } from 'react';
import { Flex, Text, Button } from '@/once-ui/components';
import { Header } from "@/once-ui/modules/layout/Header";
import { Footer } from "@/once-ui/modules/layout/Footer";
import MasonryGrid from '@/components/MasonryGrid';
// import Link from 'next/link';
import { ThirdwebProvider} from "@thirdweb-dev/react";
import { Sepolia } from "@thirdweb-dev/chains";

export default function Gallery() {

  return (
	<ThirdwebProvider
		activeChain="sepolia"
		supportedChains={[Sepolia]}
		clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}
  	>
		<Flex fillWidth paddingTop="l" paddingX="l" direction="column" alignItems="center" flex={1}>
		<Flex position="relative" as="section" overflow="hidden" fillWidth minHeight="0" direction="column" alignItems="center" flex={1}>
			<Header/>
			<Flex gap="24" padding="24" alignItems="space-between" justifyContent="space-between" fillWidth >
				<Text variant="heading-strong-l" onBackground="neutral-medium" marginTop="16">Gallery</Text>
				{/* <Flex>
				<Input
					id="example"
					label="Username"
					value=""
					hasPrefix={<Icon name="HiMiniMagnifyingGlass" />}
					labelAsPlaceholder
					// onChange={onChange}
				/>
				</Flex> */}
			</Flex>

			<Flex direction="column" gap="24" padding="24" alignItems="center" justifyContent="center" fillWidth radius="m" marginBottom='20'>
				<MasonryGrid limit={59}>
				</MasonryGrid>
			</Flex>
		</Flex>

		<Footer></Footer>
		</Flex>
	</ThirdwebProvider>

  );
}
