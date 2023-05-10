import { Box, Flex, Text, Divider } from "@chakra-ui/react";
import FileBoard from "@/components/DesignToolSideBar/FileBoard";

const DesignToolSideBar = () => {
  return (
    <Box>
      <Box bg="background.secondary" w="198px" h="100vh" position="fixed" top="72px" right="0">
        <Flex
          alignItems="center"
          justifyContent="top"
          flexDirection="column"
          maxW="198px"
          h="calc(100% - 305px)"
        >
          <Text
            m={2}
            as="span"
            fontSize="md"
            fontWeight="bold"
            lineHeight="19px"
            _groupHover={{ color: "fontcolor.primary" }}
          >
            {"Test"}
          </Text>
          <FileBoard />
          <Divider orientation="horizontal" />
          <Text
            m={2}
            as="span"
            fontSize="md"
            fontWeight="bold"
            lineHeight="19px"
            _groupHover={{ color: "fontcolor.primary" }}
          >
            {"Test"}
          </Text>
        </Flex>
      </Box>
    </Box>
  );
};

export default DesignToolSideBar;
