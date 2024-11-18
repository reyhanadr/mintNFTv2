"use client";

import React from "react";
import { Button, Flex, Text, SmartLink } from "@/once-ui/components";

const Footer: React.FC = () => {
  return (
    <Flex
      as="footer"
      position="relative"
      fillWidth
      paddingX="l"
      paddingY="m"
      justifyContent="space-between"
      style={{
        borderTop: "1px solid var(--neutral-border-medium)",
      }}
    >
      <Text variant="body-default-s" onBackground="neutral-strong">
        <Text onBackground="neutral-weak">© 2024 /</Text>
        <Text paddingX="4">Reyhan Adriana Deris</Text>
        <Text onBackground="neutral-weak">
          {/* Usage of this template requires attribution. Please don't remove the link to Once UI. */}
          / Developed with{" "}
          <SmartLink
            style={{ marginLeft: "-0.125rem" }}
            href="https://github.com/once-ui-system/nextjs-starter"
          >
            Once UI (Next.js)
          </SmartLink>
        </Text>
      </Text>
      <Flex gap="12">
        <Button
          href="https://github.com/reyhanadr"
          prefixIcon="github"
          size="s"
          variant="tertiary"
        >
          GitHub
        </Button>
        <Button
          href="https://testnets.opensea.io/0xc65Dc240C8c036472B4C8d35b57329b091C3968F"
          prefixIcon="opensea"
          size="s"
          variant="tertiary"
        >
          Opensea
        </Button>
      </Flex>
    </Flex>
  );
};

Footer.displayName = "Footer";
export { Footer };
