import React, { useCallback, useEffect, useState, useMemo } from "react";

import Countdown, { CountdownRenderProps } from "react-countdown";
import { Box, Button, Card, CardContent, CardIcon, Modal, ModalTitle, ModalContent, ModalActions, Spacer } from "react-neu";
import styled from "styled-components";
import { useWallet } from "hooks/useWallet";

import Dial from "components/Dial";
import Label from "components/Label";

import useYam from "hooks/useYam";

import { getNextRebaseTimestamp } from "yam-sdk/utils";
import Bar from "components/Bar";

interface RebaseProps {
  type?: "bar" | "circle";
}

const Rebase: React.FC<RebaseProps> = ({ type }) => {
  const yam = useYam();

  const [nextRebase, setNextRebase] = useState(0);
  const [rebaseWarningModal, setRebaseWarningModal] = useState(false);

  const { account } = useWallet();
  const fetchNextRebase = useCallback(async () => {
    if (!yam) return;
    const nextRebaseTimestamp = await getNextRebaseTimestamp(yam);
    if (nextRebaseTimestamp) {
      setNextRebase(Date.now() + nextRebaseTimestamp * 1000);
    } else {
      setNextRebase(0);
    }
  }, [setNextRebase, yam]);

  useEffect(() => {
    if (yam) {
      fetchNextRebase();
    }
  }, [fetchNextRebase, yam]);

  const handleRebaseClick = useCallback(async () => {
    if (!yam) return;
    await yam.contracts.eth_rebaser.methods.rebase().send({ from: account, gas: 700000 });
  }, [account, yam]);

  const renderer = (countdownProps: CountdownRenderProps) => {
    const { hours, minutes, seconds } = countdownProps;
    const paddedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const paddedHours = hours < 10 ? `0${hours}` : hours;
    return (
      <span>
        {paddedHours}:{paddedMinutes}:{paddedSeconds}
      </span>
    );
  };

  const dialValue = ((nextRebase - Date.now()) / (1000 * 60 * 60 * 12)) * 100;

  const DisplayRebaseProgress = useMemo(() => {
    if (type === "bar") {
      return (
        <Box alignItems="center" justifyContent="center">
          <Bar value={dialValue}></Bar>
          <StyledCountdown>
            <StyledCountdownTextBar>{!nextRebase ? "--" : <Countdown date={new Date(nextRebase)} renderer={renderer} />}</StyledCountdownTextBar>
            <Label text="Next rebase" />
          </StyledCountdown>
        </Box>
      );
    } else {
      return (
        <Box alignItems="center" justifyContent="center" row>
          <Dial size={196} value={dialValue}>
            <StyledCountdown>
              <StyledCountdownText>{!nextRebase ? "--" : <Countdown date={new Date(nextRebase)} renderer={renderer} />}</StyledCountdownText>
              <Label text="Next rebase" />
            </StyledCountdown>
          </Dial>
        </Box>
      );
    }
  }, [dialValue]);

  return (
    <>
      <Card>
        <CardContent>
          {DisplayRebaseProgress}
          <Spacer />
          <Button disabled={!account} onClick={() => setRebaseWarningModal(true)} text="Rebase" variant="secondary" />
        </CardContent>
      </Card>
      <Modal isOpen={rebaseWarningModal} onDismiss={() => setRebaseWarningModal(false)}>
        <CardIcon>⚠️</CardIcon>
        <ModalContent>WARNING: Only 1 rebase transaction succeeds every 12 hours. This transaction will likely fail.</ModalContent>
        <ModalActions>
          <Button onClick={() => setRebaseWarningModal(false)} text="Cancel" variant="secondary" />
          <Button onClick={handleRebaseClick} text="Confirm rebase" />
        </ModalActions>
      </Modal>
    </>
  );
};

const StyledCountdown = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`;

const StyledCountdownText = styled.span`
  color: ${(props) => props.theme.colors.primary.main};
  font-size: 36px;
  font-weight: 700;
`;

const StyledCountdownTextBar = styled.span`
  color: ${(props) => props.theme.colors.primary.main};
  font-size: 36px;
  font-weight: 700;
  height: 41px;
`;

export default Rebase;
