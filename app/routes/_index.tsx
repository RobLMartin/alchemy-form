import { ActionFunctionArgs, json } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { getTransfers, getTokenOwner } from "~/data/nft.functions";
import { Transfer } from "~/types";
import ErrorList from "~/components/error.list";
import supportedChains from "~/utils/supportedChains";
import { invariantResponse } from "~/utils/misc";
type ActionResponse =
  | {
      errors: {
        contractAddress?: string[];
        tokenId?: string[];
        chainId?: string[];
        form?: string[];
      };
      transfers?: null;
      owner?: null;
    }
  | {
      transfers: Transfer[];
      owner: string[];
      errors?: null;
    }
  | undefined;

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const chainId = formData.get("chainId");
  const contractAddress = formData.get("contractAddress");
  const tokenId = formData.get("tokenId");
  invariantResponse(typeof chainId === "string", "Chain id is required");
  invariantResponse(
    typeof contractAddress === "string",
    "Contract Address is required"
  );
  invariantResponse(typeof tokenId === "string", "Token Id is required");

  const errors = {
    contractAddress: [] as Array<string>,
    tokenId: [] as Array<string>,
    chainId: [] as Array<string>,
    form: [] as Array<string>,
  };

  if (!chainId) {
    errors.chainId.push("Chain id is required");
  }
  if (supportedChains[chainId] === undefined) {
    errors.chainId.push("Chain id is not supported");
  }

  if (!contractAddress) {
    errors.contractAddress.push("Contract address is required");
  }
  if (contractAddress && contractAddress.length !== 42) {
    errors.contractAddress.push("Contract address is invalid");
  }
  if (!tokenId) {
    errors.tokenId.push("Token id is required");
  }

  const hasErrors = Object.values(errors).some((error) => error.length > 0);
  if (hasErrors) {
    return json({ errors }, { status: 400 });
  }

  try {
    const transfers = await getTransfers({ contractAddress, tokenId });
    const owner = await getTokenOwner({ contractAddress, tokenId });
    return json({ transfers, owner });
  } catch (error) {
    console.error("Failed to fetch NFT data:", error);
    return json(
      { errors: { form: ["Failed to fetch NFT data"] } },
      { status: 500 }
    );
  }
};

export default function Index() {
  const fetcher = useFetcher<ActionResponse>();
  const { errors, transfers, owner } = fetcher.data ?? {};
  return (
    <div className="container p-4 font-sans text-gray-700">
      <ErrorList errors={errors?.form} />
      <fetcher.Form method="post" className="max-w-md my-10">
        <div className="mb-6">
          <label
            htmlFor="chainId"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Chain Id
          </label>
          <input
            name="chainId"
            type="text"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          />
          <ErrorList errors={errors?.chainId} />
        </div>
        <div className="mb-6">
          <label
            htmlFor="contractAddress"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Contract Address
          </label>
          <input
            name="contractAddress"
            type="text"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
            minLength={42}
            maxLength={42}
          />
          <ErrorList errors={errors?.contractAddress} />
        </div>
        <div className="mb-6">
          <label
            htmlFor="tokenId"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Token Id
          </label>
          <input
            name="tokenId"
            type="text"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          />
          <ErrorList errors={errors?.tokenId} />
        </div>
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
        >
          Submit
        </button>
      </fetcher.Form>
      <div className="container mx-auto my-10">
        {owner && (
          <>
            <h2 className="text-xl font-semibold my-4">Owners</h2>
            <pre className="bg-gray-100 rounded p-4">
              {JSON.stringify(owner, null, 2)}
            </pre>
          </>
        )}
        {transfers && (
          <>
            <h2 className="text-xl font-semibold my-4">Transfers</h2>
            <pre className="bg-gray-100 rounded p-4">
              {JSON.stringify(transfers, null, 2)}
            </pre>
          </>
        )}
      </div>
    </div>
  );
}
