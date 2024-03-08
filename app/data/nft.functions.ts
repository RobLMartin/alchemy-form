export const getTransfers = async ({
  contractAddress,
  tokenId,
}: {
  contractAddress: string;
  tokenId: string;
}) => {
  try {
    const response = await fetch(
      `${process.env.ALCHEMY_BASE_URL}${process.env.ALCHEMY_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: tokenId,
          method: "alchemy_getAssetTransfers",
          params: [
            {
              fromBlock: "0x0",
              toBlock: "latest",
              withMetadata: false,
              excludeZeroValue: true,
              maxCount: "0x3e8",
              contractAddresses: [contractAddress],
              category: ["erc721"],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch transfer data");
    }
    return data.result.transfers;
  } catch (error) {
    throw new Error("Failed to fetch transfer data");
  }
};

export const getTokenOwner = async ({
  contractAddress,
  tokenId,
}: {
  contractAddress: string;
  tokenId: string;
}) => {
  try {
    const response = await fetch(
      `${process.env.ALCHEMY_BASE_URL}${process.env.ALCHEMY_API_KEY}/getOwnersForNFT?contractAddress=${contractAddress}&tokenId=${tokenId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Failed to fetch owner data");
    }
    return data.owners;
  } catch (error) {
    throw new Error("Failed to fetch owner data");
  }
};
