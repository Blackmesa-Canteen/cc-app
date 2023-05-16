import {
  Box,
  Flex,
  Text,
  Divider,
  Tooltip,
  IconButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Slider,
  SliderMark,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from "@chakra-ui/react";
import FileBoard from "@/components/DesignToolSideBar/FileBoard";
import { RiArrowGoBackLine, RiArrowGoForwardLine } from "react-icons/ri";
import { BsArrowCounterclockwise } from "react-icons/bs";
import { switchPaintBucket, switchSideBar } from "@/store/reducer/buttonToggleSlice";
import { ActionCreators } from "redux-undo";
import { useStoreSelector } from "@/store/hooks";
import { useDispatch } from "react-redux";
import PaintBucketSvg from "@/assets/svg/TopBarSvg/paintBucket.svg";
import ColorBoard from "@/components/TopBar/ColorBoard";
import BorderSvg from "@/assets/svg/TopBarSvg/border.svg";
import { FaCaretUp } from "react-icons/fa";
import { getCourtNameString, updateBorderLength } from "@/store/reducer/courtSpecDataSlice";
import { useState } from "react";
import { resetAll } from "@/store/reducer/canvasControlSlice";
import { updateBorderTileQty } from "@/store/reducer/areaTileQtySlice";

const DesignToolSideBar = () => {
  const dispatch = useDispatch();

  const open = () => dispatch(switchPaintBucket(true));
  const close = () => dispatch(switchPaintBucket(false));
  const userData = useStoreSelector((state) => state.user);
  const { activeCourt: selectedCourt } = useStoreSelector((state) => state.courtSpecData);

  const nameString = getCourtNameString(selectedCourt);
  const borderLength = selectedCourt.borderLength;
  const [sliderValue, setSliderValue] = useState(borderLength / 1000);
  const [useUserId, setUserId] = useState(userData.userId);

  const handleChange = (val: number) => {
    dispatch(resetAll());
    dispatch(switchSideBar(false));
    setSliderValue(val);
    dispatch(updateBorderLength(val * 1000));
    const borderTileQty =
      2 *
        (Math.ceil(selectedCourt.courtAreaXLength / 300) +
          Math.ceil(selectedCourt.courtAreaYLength / 300)) *
        Math.ceil((val * 1000) / 300) +
      4 * Math.pow(Math.ceil((val * 1000) / 300), 2);
    dispatch(updateBorderTileQty(borderTileQty));
  };

  const handleUndo = () => {
    dispatch(switchSideBar(false));
    dispatch(ActionCreators.undo());
  };
  const handleRedo = () => {
    dispatch(switchSideBar(false));
    dispatch(ActionCreators.redo());
  };
  const handleReset = () => {
    dispatch(switchSideBar(false));
    dispatch(ActionCreators.jumpToPast(0));
  };

  const isThingsToUndo = useStoreSelector((state) => state.tile.past).length;
  const isThingsToRedo = useStoreSelector((state) => state.tile.future).length;
  const isThingsToReset = isThingsToUndo;
  const { selectedColor } = useStoreSelector((state) => state.courtColor);
  const { isPaintPopoverOpen, isSavePopoverOpen } = useStoreSelector((state) => state.buttonToggle);

  return (
    <Box>
      <Box bg="background.secondary" w="200px" h="100vh" position="fixed" top="72px" right="0">
        <Flex
          alignItems="center"
          justifyContent="top"
          flexDirection="column"
          maxW="198px"
          h="calc(100% - 305px)"
        >
          <FileBoard />
          <Divider orientation="horizontal" />
          <Box>
            <Flex align="center" justify="flex-start" gap="3px">
              <Tooltip
                hasArrow
                shouldWrapChildren
                label="Paint Bucket"
                fontSize="sm"
                placement="top"
              >
                <Popover
                  isOpen={isPaintPopoverOpen}
                  onOpen={open}
                  onClose={close}
                  returnFocusOnClose={false}
                >
                  <PopoverTrigger>
                    <IconButton
                      aria-label="Rb"
                      icon={<PaintBucketSvg fill={selectedColor} />}
                      display="fixed"
                      variant="editorFooterIconBtn"
                      data-testid="colorSelectBtn"
                    />
                  </PopoverTrigger>
                  <PopoverContent width={300} height={168}>
                    <PopoverBody>
                      <ColorBoard />
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
              </Tooltip>
              <Tooltip hasArrow shouldWrapChildren label="undo color edit" fontSize="sm">
                <IconButton
                  aria-label="Revert edit"
                  icon={<RiArrowGoBackLine />}
                  variant="navbarIconBtn"
                  disabled={!isThingsToUndo}
                  onClick={handleUndo}
                  marginX="5px"
                />
              </Tooltip>
              <Tooltip hasArrow shouldWrapChildren label="redo color edit" fontSize="sm">
                <IconButton
                  aria-label="Forward edit"
                  icon={<RiArrowGoForwardLine />}
                  variant="navbarIconBtn"
                  disabled={!isThingsToRedo}
                  onClick={handleRedo}
                  marginX="5px"
                />
              </Tooltip>
              <Tooltip hasArrow shouldWrapChildren label="reset all color edits" fontSize="sm">
                <IconButton
                  aria-label="Reset edit"
                  icon={<BsArrowCounterclockwise />}
                  variant="navbarIconBtn"
                  disabled={!isThingsToReset}
                  onClick={handleReset}
                  marginX="5px"
                />
              </Tooltip>
            </Flex>
          </Box>
          <Box>
            <Flex align="center" justify="flex-start" gap="3px">
              <Tooltip
                hasArrow
                shouldWrapChildren
                label="Border Slider"
                marginBottom="9px"
                fontSize="sm"
                placement="top"
              >
                <BorderSvg data-testid="borderIcon" />
              </Tooltip>
              <Text fontSize="lg" color="brand.primary">
                0
              </Text>
              <Slider
                aria-label="slider"
                defaultValue={sliderValue}
                value={sliderValue}
                min={0}
                max={2.0}
                step={0.1}
                w="120px"
                isDisabled={selectedCourt.courtName === "Pro Full Court"}
                onChange={(val: number) => handleChange(val)}
              >
                <SliderMark
                  value={sliderValue}
                  textAlign="center"
                  color="brand.primary"
                  marginTop="-6"
                  marginLeft="-5"
                  width="9"
                  fontSize="10px"
                >
                  {sliderValue}m
                </SliderMark>
                <SliderTrack height="9px" borderRadius="5px" background="brand.primary">
                  <SliderFilledTrack background="brand.primary" />
                </SliderTrack>
                <SliderThumb
                  background="transparent"
                  color="brand.primary"
                  border="none"
                  marginTop={3}
                  boxShadow="none"
                >
                  <FaCaretUp size={30} />
                </SliderThumb>
              </Slider>
              <Text fontSize="lg" color="brand.primary">
                2
              </Text>
            </Flex>
          </Box>
          <Divider orientation="horizontal" />
        </Flex>
      </Box>
    </Box>
  );
};

export default DesignToolSideBar;
