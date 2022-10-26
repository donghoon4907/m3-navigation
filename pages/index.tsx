import type { NextPage } from "next";
import Head from "next/head";
import styled from "styled-components";

const MainContainer = styled.div`
  padding-left: 88px;
  width: 100%;
`;

const MainBody = styled.div`
  display: flex;
  height: 100%;
`;

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Feed</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainContainer>
        <MainBody></MainBody>
      </MainContainer>
    </>
  );
};

export default Home;
