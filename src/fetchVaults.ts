// import { QueryFunction } from "@tanstack/react-query";
// import { VaultArrayType } from "./ContractResponseTypes.ts";
// import factoryabi from "./abi/factoryabi.json";
// import { useReadContract } from "wagmi";

// const fetchVaults: QueryFunction<VaultArrayType, ["search", string, string]> =
//   async function ({ queryKey }) {
//     //const { animal, location, breed } = queryKey[1];
//     const start = queryKey[1];
//     const end = queryKey[2];
//     try {
//       const data = useReadContract({
//         abi: factoryabi,
//         address: "0x8b48094F9D18557a57986A41124F673673909773",
//         functionName: "getVaults", // Replace with your contract function name
//         args: [start, end], // Pass your parameters here
//       });

//       return data as VaultArrayType;
//     } catch (error) {
//       throw new Error(
//         `Contract call failed for index: ${start} and ${end} with error message ${error}`,
//       );
//     }
//   };

// export default fetchVaults;
