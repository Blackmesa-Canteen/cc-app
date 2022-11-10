import { ITemplateDataDb } from "@/interfaces/template";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { useState } from "react";
import CourtTags from "./CourtTags";
import TemplateDetail from "./TemplateDetail";
import Image from "next/image";
import { startSelectTemplate } from "@/store/reducer/buttonToggleSlice";
import { useStoreSelector } from "@/store/hooks";
import { useDispatch } from "react-redux";
import { FaEllipsisH } from "react-icons/fa";
import { format, parseISO } from "date-fns";
import { AreaTileQty, changeCourtType } from "@/store/reducer/areaTileQtySlice";
import { setActiveCourt, updateBorderLength } from "@/store/reducer/courtSpecDataSlice";
import { changeWholeCourtColor } from "@/store/reducer/tileSlice";
import { mockTileData } from "../MockData/MockTileData";
import { resetAll } from "@/store/reducer/canvasControlSlice";

interface Props {
  template: Omit<ITemplateDataDb, "__v" | "isDeleted">;
}

const TemplateItem = (prop: Props) => {
  const dispatch = useDispatch();
  const { isTemplateSelect } = useStoreSelector((state) => state.buttonToggle);
  const [hoverOn, setHoverOn] = useState<boolean>(false);
  const [enableTempDetail, setEnableTempDetail] = useState<boolean>(false);
  const templateOpacityDrop = isTemplateSelect && !hoverOn;
  const { courtsData } = useStoreSelector((state) => state.courtSpecData);

  const templateItem = {
    userId: prop.template.user_id,
    description: prop.template.description,
    courtImgUrl: prop.template.image,
    createDate: format(parseISO(prop.template.createdAt), "dd/mm/yyyy"),
    tags: prop.template.tags,
    designDetail: prop.template.design,
  };

  const handleCourtSelecting = (courtSizeName: string): void => {
    dispatch(setActiveCourt(courtSizeName));
    dispatch(updateBorderLength(templateItem.designDetail.courtSize.sideBorderWidth));
    const selectedCourt = courtsData.find((item) => item.courtName === courtSizeName);
    const tileQtyOfSelectedCourt = mockTileData.find(
      (item) => item.name === selectedCourt?.courtName
    )?.tileQty as AreaTileQty[];
    dispatch(changeCourtType(tileQtyOfSelectedCourt));
    dispatch(changeWholeCourtColor(templateItem.designDetail.tileColor));
    dispatch(resetAll());
  };

  const selectTemplate = () => {
    setHoverOn(true);
    dispatch(startSelectTemplate(true));
  };

  const applyTemplate = () => {
    handleCourtSelecting(prop.template.design.courtSize.name);
    selectTemplate();
  };

  const resetHeightLight = () => {
    setHoverOn(false);
    dispatch(startSelectTemplate(false));
  };

  const templateDetailOn = () => {
    setEnableTempDetail(true);
  };

  const detailOnClose = () => {
    setEnableTempDetail(false);
    resetHeightLight();
  };

  return (
    <Flex
      position="relative"
      width="300px"
      height="240px"
      marginBottom="16px"
      flexDirection="column"
      alignItems="center"
      padding="5px 10px 10px 10px"
      backgroundColor="white"
      opacity={templateOpacityDrop ? "0.4" : "1"}
      onMouseEnter={selectTemplate}
      onMouseLeave={resetHeightLight}
    >
      <Box width="95%">
        <Box>
          <Text color="black" fontSize="1rem" fontWeight="700">
            {templateItem.designDetail.designName}
          </Text>
          <Text
            color="fontcolor.tealishBlue"
            fontSize="0.8rem"
          >{`Created at ${templateItem.createDate}`}</Text>
        </Box>
        {hoverOn && (
          <Box top="10px" position="absolute" right="1rem">
            <Button
              backgroundColor="gray.400"
              size="sm"
              opacity="0.95"
              _hover={{
                backgroundColor: "gray.500",
              }}
              onClick={templateDetailOn}
            >
              <FaEllipsisH color="white" fontSize="1.1rem" />
            </Button>
          </Box>
        )}
      </Box>

      <Box width="80%" height="full" position="relative" cursor="pointer" onClick={applyTemplate}>
        <Image src={templateItem.courtImgUrl} layout="fill" objectFit="contain" />
      </Box>
      <Flex width="full" wrap="wrap" gap="1rem" justifyContent="space-around">
        <CourtTags tags={templateItem.tags} />
      </Flex>
      <TemplateDetail
        isOpen={enableTempDetail}
        onClose={detailOnClose}
        template={templateItem}
        applyTemplate={() => handleCourtSelecting(prop.template.design.courtSize.name)}
      />
    </Flex>
  );
};
export default TemplateItem;