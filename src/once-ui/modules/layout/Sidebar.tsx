'use client';

import { Flex, Icon, ToggleButton, Text } from '@/once-ui/components';
import { usePathname } from 'next/navigation';
import config from '@/utils/config'; // Menggunakan konfigurasi base URL

const Sidebar: React.FC = () => {
    const pathname = usePathname() ?? '';

    return (
        <Flex
            data-theme="dark"
            fillWidth
            fillHeight
            paddingX="16"
            paddingY="32"
            gap="m"
            onSolid="neutral-strong"
            solid="neutral-weak"
            border="neutral-weak"
            borderStyle="solid-1"
            radius="l"
            justifyContent="flex-start"
            alignItems="flex-start"
            direction="column"
        >
            <Flex
                fillHeight
                fillWidth
                paddingX="xs"
                gap="m"
                direction="column"
            >
                <Flex
                    fillWidth
                    gap="4"
                    direction="column"
                >
                    <Text
                        variant="body-default-xs"
                        onBackground="neutral-weak"
                        marginBottom="8"
                        marginLeft="16"
                    >
                        Menu
                    </Text>
                    <ToggleButton
                        width="fill"
                        align="start"
                        href={`${config.baseURL}/home`}
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
                                onBackground="neutral-weak"
                                size="xs"
                            />
                            Home
                        </Flex>
                    </ToggleButton>
                    <ToggleButton
                        width="fill"
                        align="start"
                        href={`${config.baseURL}/gallery`}
                        selected={pathname.includes('/gallery')}
                    >
                        <Flex
                            padding="4"
                            alignItems="center"
                            gap="12"
                            textVariant="label-default-s"
                        >
                            <Icon
                                name="PiImageDuotone"
                                onBackground="neutral-weak"
                                size="xs"
                            />
                            Gallery
                        </Flex>
                    </ToggleButton>
                </Flex>
            </Flex>
        </Flex>
    );
};

Sidebar.displayName = 'Sidebar';
export { Sidebar };
