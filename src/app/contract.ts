import { getContract } from "thirdweb";
import { defineChain } from "thirdweb/chains";
import { client } from "@/app/client";

// connect to your contract
export const contract = getContract({
    client,
    chain: defineChain(11155111),
    address: "0xA895a9b5882DBa287CF359b6a722C5be46aCb675",
});