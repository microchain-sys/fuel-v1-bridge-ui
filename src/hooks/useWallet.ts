export function useWallet() {
  return {
    account: null,
    reset: () => {},
  }
}

export function UseWalletProvider({ children }: { children: React.ReactNode }) {
  return children
}
