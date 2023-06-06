import { useStoreSelector } from "@/store/hooks";
import {
  Box,
  Button,
  Flex,
  IconButton,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
} from "@chakra-ui/react";
import SaveBoard from "@/components/TopBar/SaveBoard";
import { BiDownload, BiSave } from "react-icons/bi";
import {
  switchCreateTemplate,
  switchLoginModal,
  switchSavePopover,
  switchSideBar,
} from "@/store/reducer/buttonToggleSlice";
import { resetAll } from "@/store/reducer/canvasControlSlice";
import { downloadToPDF } from "@/utils/printPDF";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import EditorDesignName from "@/components/NavBar/EditorDesignName";

const FileManagement = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const userId = useStoreSelector((state) => state.user.userId);

  const handleCreateTemplateOpen = () => {
    router.push("/");
    dispatch(switchCreateTemplate(true));
  };

  const handleLoginModalOpen = () => {
    dispatch(switchLoginModal(true));
  };

  const handleDownload = () => {
    dispatch(switchSideBar(false));
    dispatch(resetAll());
    const downloadTimer = setTimeout(() => {
      downloadToPDF();
      clearTimeout(downloadTimer);
    }, 500);
  };

  const handleSaveOpen = () => {
    userId ? dispatch(switchSavePopover(true)) : dispatch(switchLoginModal(true));
  };

  const handleSaveClose = () => {
    dispatch(switchSavePopover(false));
  };
  return (
    <Box>
      <Flex maxW={"md"} paddingLeft={"8px"}>
        <EditorDesignName />
      </Flex>
      <Flex align="center" justify="flex-start" gap="15px">
        <Popover onClose={handleSaveClose}>
          <PopoverTrigger>
            <IconButton
              aria-label="DocSvg"
              icon={<BiSave />}
              colorScheme="white"
              size="md"
              variant="navbarIconBtn"
              onClick={handleSaveOpen}
              data-testid="save-btn"
            />
          </PopoverTrigger>
          <PopoverContent w="140px" h="110px">
            <PopoverBody>
              <SaveBoard />
            </PopoverBody>
          </PopoverContent>
        </Popover>

        <IconButton
          aria-label="Download"
          icon={<BiDownload />}
          colorScheme="white"
          variant="navbarIconBtn"
          size="md"
          onClick={handleDownload}
          data-testid="download-btn"
        />

        <Button
          variant="shareBtn"
          marginLeft="2px"
          size="xs"
          fontSize="sm"
          onClick={userId ? handleCreateTemplateOpen : handleLoginModalOpen}
          data-testid="share-btn"
        >
          Share
        </Button>
      </Flex>
    </Box>
  );
};

export default FileManagement;
