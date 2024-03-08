export type Transfer = {
  blockNum: string;
  uniqueId: string;
  hash: string;
  from: string;
  to: string;
  value: null | string;
  erc721TokenId: string;
  erc1155Metadata: null | string;
  tokenId: string;
  asset: string;
  category: string;
  rawContract: {
    value: null | string;
    address: string;
    decimal: null | number;
  };
};
