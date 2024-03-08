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
    return data.result.transfers;
  } catch (error) {
    console.error(error);
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
    return data;
  } catch (error) {
    console.error(error);
  }
};
