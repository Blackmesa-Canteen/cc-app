import React from "react";
import { Box, Button, Flex, IconButton, Text } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { switchMyAccount } from "@/store/reducer/buttonToggleSlice";
import Image from "next/image";
import { useStoreSelector } from "@/store/hooks";
import { MdEdit } from "react-icons/md";
import FlexContainer from "./FlexContainer";

const MyAccountContainer = () => {
  const dispatch = useDispatch();
  const { firstName, lastName, email } = useStoreSelector((state) => state.user);
  const avatarUrl = "";

  const handleReturnToDesign = () => {
    dispatch(switchMyAccount(false));
  };

  return (
    <Flex
      position="fixed"
      backgroundColor="#fff"
      top="72px"
      padding="40px 120px"
      width="100vw"
      height="100vh"
      zIndex={1600}
      gap="50px"
      flexDirection="column"
      color="brand.primary"
      alignItems="center"
    >
      <Text fontSize="32px" fontWeight="700">
        My Account
      </Text>
      <Box width="100%">
        <FlexContainer
          title="Avatar"
          content={
            <Box
              width="68px"
              height="68px"
              borderRadius="50%"
              border="1px solid #B6B6B6"
              position="relative"
              overflow="hidden"
            >
              {avatarUrl && <Image src={avatarUrl} layout="fill" objectFit="cover" />}
            </Box>
          }
        />
        <FlexContainer
          title="Name"
          content={
            <Text fontWeight="700" fontSize="16px">
              {firstName} {lastName}{" "}
              <IconButton
                aria-label="edit name"
                icon={<MdEdit />}
                background="transparent"
                size="lg"
              />
            </Text>
          }
        />
        <FlexContainer
          title="Email Address"
          content={
            <Text fontWeight="700" fontSize="16px">
              {email}
            </Text>
          }
        />
        <FlexContainer
          title="Password"
          content={
            <Button
              padding="10px 24px"
              fontSize="18px"
              fontWeight="700"
              background="#F3F2F7"
              border="1px solid #344C5C"
            >
              Change Password
            </Button>
          }
        />
      </Box>
      <Button variant="shareBtn" padding="10px 24px" onClick={handleReturnToDesign}>
        Return to Design
      </Button>
    </Flex>
  );
};

export default MyAccountContainer;