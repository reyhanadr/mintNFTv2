'use client';

import { Flex, Icon, ToggleButton, Text } from '@/once-ui/components';
import { usePathname } from 'next/navigation';

const Sidebar: React.FC = () => {
    const pathname = usePathname() ?? '';

    return (
        <Flex
            // data-theme="dark"
            fillWidth
            fillHeight
            paddingX="12"
            paddingY="24"
            gap="2"
            background='surface'
            role='sidebar'
            border="neutral-medium"
            borderStyle="solid-1"
            radius="m-4"
            justifyContent="flex-start"
            alignItems="flex-start"
            direction="column"
            flex={1}
            
        >
            <Flex
                fillWidth
                gap="4"
                direction="column"
            >
                    <Text
                        variant="body-default-xs"
                        onBackground="neutral-strong"
                        marginBottom="8"
                        marginLeft="16"
                    >
                        Menu
                    </Text>
                    <ToggleButton
                        width="fill"
                        align="start"
                        href={`/`}
                        selected={pathname.includes('/home')}
                    >
                        <Flex
                            padding="4"
                            alignItems="center"
                            gap="12"
                            textVariant="label-default-s"
                        >
                            <Icon
                                name="PiHouseDuotone"
                                onBackground="neutral-strong"
                                size="xs"
                            />
                            Home
                        </Flex>
                    </ToggleButton>
                    <ToggleButton
                        width="fill"
                        align="start"
                        href={`/gallery`}
                        selected={pathname.includes('/gallery')}
                    >
                        <Flex
                            padding="4"
                            alignItems="center"
                            gap="12"
                            textVariant="label-default-s"
                        >
                            <Icon
                                name="GrGallery"
                                onBackground="neutral-strong"
                                size="xs"
                            />
                            Gallery
                        </Flex>
                    </ToggleButton>
            </Flex>
        </Flex>
    );
};

Sidebar.displayName = 'Sidebar';
export { Sidebar };
