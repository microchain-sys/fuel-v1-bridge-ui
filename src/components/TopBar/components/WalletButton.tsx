import React, { useCallback, useState, useEffect } from "react";
import styled from "styled-components";

import { Button, Spacer } from "react-neu";
import { useWallet } from "hooks/useWallet";

import UnlockWalletModal from "components/UnlockWalletModal";
import WalletModal from "components/WalletModal";
import useENS from "hooks/useENS";
import Davatar from "@davatar/react";
import { shorten } from "utils";

interface WalletButtonProps {}

const WalletButton: React.FC<WalletButtonProps> = (props) => {
  const [walletModalIsOpen, setWalletModalIsOpen] = useState(false);
  const [unlockModalIsOpen, setUnlockModalIsOpen] = useState(false);
  const [userAccount, setUserAccount] = useState<string | null>();
  const { account, status, connect } = useWallet();
  const { ensName } = useENS(account);

  const handleDismissUnlockModal = useCallback(() => {
    setUnlockModalIsOpen(false);
  }, [setUnlockModalIsOpen]);

  const handleDismissWalletModal = useCallback(() => {
    setWalletModalIsOpen(false);
  }, [setWalletModalIsOpen]);

  const handleWalletClick = useCallback(() => {
    setWalletModalIsOpen(true);
  }, [setWalletModalIsOpen]);

  const handleUnlockWalletClick = useCallback(() => {
    setUnlockModalIsOpen(true);
  }, [setUnlockModalIsOpen]);

  const handleConnectMetamask = useCallback(() => {
    connect("injected");
  }, [connect]);

  const handleConnectWalletConnect = useCallback(() => {
    connect("walletconnect");
  }, [connect]);

  const checkLocalUserAccount = useCallback(async () => {
    if (!localStorage.getItem("account")) {
      setUserAccount(null);
    }
  }, []);

  const fetchConnection = useCallback(async () => {
    if (status === "disconnected") {
      setUserAccount(null);
      localStorage.removeItem("account");
    }
  }, [status, setUserAccount]);

  useEffect(() => {
    checkLocalUserAccount();
    const localAccount: any =
      (account ? account.toString() : false) || localStorage.getItem("account");
    if (account) {
      localStorage.setItem("account", localAccount);
      setUserAccount(localAccount);
    }
  }, [account, userAccount, handleDismissWalletModal]);

  useEffect(() => {
    let checkConnection = setTimeout(() => {
      fetchConnection();
    }, 2000);
    return () => {
      clearTimeout(checkConnection);
    };
  }, [status, fetchConnection]);

  useEffect(() => {
    const localAccount = localStorage.getItem("account");
    const walletProvider = localStorage.getItem("walletProvider");
    if (!account && localAccount) {
      setUserAccount(localAccount);
      if (
        localAccount &&
        (walletProvider === "metamask" || walletProvider === "injected")
      ) {
        handleConnectMetamask();
      }
      if (localAccount && walletProvider === "walletconnect") {
        handleConnectWalletConnect();
      }
    }
  }, []);

  return (
    <>
      <StyledWalletButton>
        {!userAccount ? (
          <Button
            onClick={handleUnlockWalletClick}
            size="sm"
            text="Unlock Wallet"
          />
        ) : (
          <Button onClick={handleWalletClick} size="sm" variant="tertiary">
            <Davatar
              address={userAccount}
              size={20}
              generatedAvatarType="jazzicon"
            />
            <Spacer size="sm" />
            <div>{ensName || shorten(userAccount)}</div>
          </Button>
        )}
      </StyledWalletButton>
      <WalletModal
        isOpen={walletModalIsOpen}
        onDismiss={handleDismissWalletModal}
      />
      <UnlockWalletModal
        isOpen={unlockModalIsOpen}
        onDismiss={handleDismissUnlockModal}
      />
    </>
  );
};

const StyledWalletButton = styled.div``;

export default WalletButton;
