import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider, ColorModeScript, extendTheme } from "@chakra-ui/react";
import {
  goerli,
  configureChains,
  createClient,
  WagmiConfig,
  useSigner,
} from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import {
  connectorsForWallets,
  RainbowKitProvider,
  midnightTheme,
} from "@rainbow-me/rainbowkit";
import {
  injectedWallet,
  rainbowWallet,
  walletConnectWallet,
  coinbaseWallet,
  metaMaskWallet,
  argentWallet,
  braveWallet,
  imTokenWallet,
  trustWallet,
  ledgerWallet,
  omniWallet,
} from "@rainbow-me/rainbowkit/wallets";
import "@rainbow-me/rainbowkit/styles.css";
import { ThirdwebSDKProvider, ChainId } from "@thirdweb-dev/react";

const config = {
  initialColorMode: "dark",
  useSystemColorMode: true,
};
const fonts = {
  heading: `"Inter", sans-serif`,
  body: `"Inter", sans-serif`,
};

const theme = extendTheme({ config, fonts });

const { chains, provider } = configureChains(
  [goerli],
  [
    jsonRpcProvider({
      rpc: () => {
        return {
          http: "<https://rpc.ankr.com/eth_goerli>",
        };
      },
    }),
    publicProvider(),
  ]
);

const connectors = connectorsForWallets([
  {
    groupName: "Recommended",
    wallets: [
      metaMaskWallet({ chains, shimDisconnect: true }),
      walletConnectWallet({ chains }),
      coinbaseWallet({ appName: "probably nothing", chains }),
      rainbowWallet({ chains }),
    ],
  },
  {
    groupName: "Others",
    wallets: [
      argentWallet({ chains }),
      braveWallet({
        chains,
        shimDisconnect: true,
      }),
      imTokenWallet({ chains }),
      injectedWallet({
        chains,
        shimDisconnect: true,
      }),
      ledgerWallet({
        chains,
      }),
      omniWallet({ chains }),
      trustWallet({ chains, shimDisconnect: true }),
    ],
  },
]);

const wagmiClient = createClient({
  autoConnect: false,
  connectors,
  provider,
});

const activeChainId = ChainId.Goerli;

function ThirdwebProvider({ wagmiClient, children }: any) {
  const { data: signer } = useSigner();
  return (
    <ThirdwebSDKProvider
      desiredChainId={activeChainId}
      signer={signer as any}
      provider={wagmiClient.provider}
      queryClient={wagmiClient.queryClient as any}
    >
      {children}
    </ThirdwebSDKProvider>
  );
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains} theme={midnightTheme()} coolMode>
          <ThirdwebProvider wagmiClient={wagmiClient}>
            <ColorModeScript initialColorMode={theme.config.initialColorMode} />
            <Component {...pageProps} />
          </ThirdwebProvider>
        </RainbowKitProvider>
      </WagmiConfig>
    </ChakraProvider>
  );
}
export default MyApp;
