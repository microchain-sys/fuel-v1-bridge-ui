import React from "react";
import styled from "styled-components";

import Footer from "../Footer";

const Page = ({ children }: { children: React.ReactNode }) => (
  <StyledPage>
    <StyledMain>{children}</StyledMain>
    <Footer />
  </StyledPage>
);

const StyledPage = styled.div``;

const StyledMain = styled.div`
  align-items: center;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 160px);
  padding: ${(props) => props.theme.spacing[6]}px 0;
`;

export default Page;
