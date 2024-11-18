"use client";

import React from 'react';

import { Heading, Text, Flex, Button, RevealFx, SmartImage, Grid, Icon, InlineCode, Logo, Background, LetterFx, Arrow } from '@/once-ui/components';
import { Header } from '@/once-ui/modules/layout/Header';
import MasonryGrid from '@/components/MasonryGrid';
import Link from 'next/link';

export default function Home() {
	const links = [
		{
			href: "https://once-ui.com/docs/theming",
			title: "Themes",
			description: "Style your app in minutes.",
		},
		{
			href: "https://once-ui.com/docs/flexComponent",
			title: "Layout",
			description: "Build responsive layouts.",
		},
		{
			href: "https://once-ui.com/docs/typography",
			title: "Typography",
			description: "Scale text automatically.",
		},
	];

	return (
		<Flex
			fillWidth paddingTop="l" paddingX="l"
			direction="column" alignItems="center" flex={1}>
			<Flex
				position="relative"
				as="section" overflow="hidden"
				fillWidth minHeight="0" maxWidth={68}
				direction="column" alignItems="center" flex={1}>
				<Header/>
				<Flex

					direction="column"
					gap="24"
					padding="24"
					alignItems="center"
					justifyContent="center"
					fillWidth
					radius="m"
					onBackground="brand-strong"
					background="brand-weak"
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
							<Button size="s" variant="tertiary">
								Explore
							</Button>
						</Flex>
					</RevealFx>
					<RevealFx>
					<MasonryGrid/>
					<Flex
						gap="8"
						padding="8"
						alignItems="center"
						justifyContent="center"
						onBackground="brand-strong"
						background="brand-weak"
						>
						<Button size="s" variant="secondary">
							Show All
						</Button>
					</Flex>
					</RevealFx>
				</Flex>
			</Flex>
			<Flex
				as="footer"
				position="relative"
				fillWidth paddingX="l" paddingY="m"
				justifyContent="space-between">
				<Text
					variant="body-default-s" onBackground="neutral-weak">
					© 2024 Once UI, <Link href="https://github.com/once-ui-system/nextjs-starter?tab=MIT-1-ov-file">MIT License</Link>
				</Text>
				<Flex
					gap="12">
					<Button
						href="https://github.com/once-ui-system/nextjs-starter"
						prefixIcon="github" size="s" variant="tertiary">
						GitHub
					</Button>
					<Button
						href="https://discord.com/invite/5EyAQ4eNdS"
						prefixIcon="discord" size="s" variant="tertiary">
						Discord
					</Button>
				</Flex>
			</Flex>
		</Flex>
	);
}
