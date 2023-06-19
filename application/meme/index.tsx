import { useAtom } from "jotai";
import { global } from "application/state";
import {
  View,
  rcss,
  tokens,
  Button,
  Select,
  Text,
  MultiLineInput,
  IconButton,
  interactive,
} from "application/rui";
import { motion, PanInfo, useMotionValue, useTransform } from "framer-motion";
import DownloadIcon from "application/ui/icons/Download";
import CopyIcon from "application/ui/icons/Copy";
import LogoIcon from "application/ui/icons/Logo";
import React, {
  RefObject,
  useRef,
  useState,
  ChangeEvent,
  useCallback,
} from "react";
import PlusIcon from "application/ui/icons/Plus";
import ChevronRightIcon from "application/ui/icons/ChevronRight";
import ChevronDownIcon from "application/ui/icons/ChevronDown";
import PaletteIcon from "application/ui/icons/Palette";
import downloadjs from "downloadjs";
import html2canvas from "html2canvas";
import { messages, fs } from "@replit/extensions";
import ChevronLeftIcon from "application/ui/icons/ChevronLeft";

const fonts = [
  "Impact",
  "sans-serif",
  "Arial",
  "Comic Sans MS",
  "Helvetica",
  "Times New Roman",
  "Times",
  "Courier New",
  "Courier",
  "Verdana",
  "Georgia",
  "Palatino",
  "Trebuchet MS",
  "Arial Black",
];

const textAlignments: Array<"center" | "left" | "right"> = [
  "center",
  "left",
  "right",
];

const textStyles: Array<"regular" | "bold" | "italic"> = [
  "regular",
  "bold",
  "italic",
];

interface TextBox {
  text: string;
  size: number;
  color: string;
  opacity: number;
  outlineColor: string;
  outlineThickness: number;
  font: string;
  textAlign: "left" | "right" | "center";
  textStyle: "regular" | "bold" | "italic";
  width: number;
  initialTop: number | string;
  updating?: boolean;
  rotate: number;
  type: "textbox";
}

interface Image {
  src: string | ArrayBuffer;
  width: number;
  height: number;
  name: string;
  rotate: number;
  type: "image";
  updating?: boolean;
}

function TextBoxDragComponent({
  parentRef,
  box,
  setTextBoxes,
  index,
}: {
  parentRef: RefObject<HTMLDivElement>;
  box: TextBox;
  setTextBoxes: React.Dispatch<React.SetStateAction<Array<TextBox | Image>>>;
  index: number;
}) {
  const [initialTop] = useState(box.initialTop);
  const dragRef = useRef<HTMLDivElement>(null);
  const textContainer = useRef<HTMLSpanElement>(null);

  const boxWidth = useMotionValue(box.width);
  const width = useTransform(boxWidth, (w) => `${w}%`);
  const boxLeft = useMotionValue(0);

  const dragRight = useCallback(
    (_, info: PanInfo) => {
      const containerBound = parentRef.current?.getBoundingClientRect();
      const dragBound = dragRef.current?.getBoundingClientRect();

      if (containerBound && dragBound) {
        const newWidthPx = dragBound.width + info.delta.x;
        const newWidth = (newWidthPx / containerBound.width) * 100;

        if (newWidth > 0 && newWidth < 100) {
          boxWidth.set(newWidth);
        }
      }
    },
    [dragRef]
  );

  const dragLeft = useCallback(
    (_, info: PanInfo) => {
      const containerBound = parentRef.current?.getBoundingClientRect();
      const dragBound = dragRef.current?.getBoundingClientRect();

      if (containerBound && dragBound) {
        const newWidthPx = dragBound.width - info.delta.x;
        const newWidth = (newWidthPx / containerBound.width) * 100;

        if (newWidth > 0 && newWidth < 100) {
          boxWidth.set(newWidth);
          boxLeft.set(boxLeft.get() + info.delta.x);
        }
      }
    },
    [dragRef]
  );

  return (
    <motion.div
      drag
      style={{
        position: "absolute",
        top: initialTop,
        width,
        height: "auto",
        textAlign: box.textAlign,
        left: boxLeft,
      }}
      onClick={() => {
        setTextBoxes((boxes) =>
          boxes.map((b, i) =>
            i === index ? { ...b, updating: true } : { ...b, updating: false }
          )
        );
      }}
      dragMomentum={false}
      animate={{
        backgroundColor: box.updating ? `rgba(0, 0, 0, 0.1)` : undefined,
        border: box.updating
          ? `dashed 1px ${tokens.foregroundDimmer}`
          : `dashed 1px transparent`,
      }}
      whileHover={{
        border: `dashed 1px ${tokens.foregroundDefault}`,
        backgroundColor: `rgba(0, 0, 0, 0.2)`,
      }}
      whileDrag={{
        backgroundColor: `rgba(0, 0, 0, 0.3)`,
      }}
      ref={dragRef}
    >
      <span
        style={{
          display: "inline-block",
          fontSize: box.size + "px",
          color: box.color,
          opacity: box.opacity,
          textShadow: `0 0 ${box.outlineThickness}px ${box.outlineColor}`,
          fontFamily: box.font,
          wordBreak: "break-word",
          transform: `rotate(${box.rotate}deg)`,
        }}
        ref={textContainer}
      >
        {box.textStyle === "bold" ? (
          <strong
            dangerouslySetInnerHTML={{
              __html: box.text
                .replaceAll("<", "&lt;")
                .replaceAll(">", "&gt;")
                .replaceAll("\n", "<br>"),
            }}
          />
        ) : null}
        {box.textStyle === "italic" ? (
          <em
            dangerouslySetInnerHTML={{
              __html: box.text
                .replaceAll("<", "&lt;")
                .replaceAll(">", "&gt;")
                .replaceAll("\n", "<br>"),
            }}
          />
        ) : null}
        {box.textStyle !== "bold" && box.textStyle !== "italic" ? (
          <span
            dangerouslySetInnerHTML={{
              __html: box.text
                .replaceAll("<", "&lt;")
                .replaceAll(">", "&gt;")
                .replaceAll("\n", "<br>"),
            }}
          />
        ) : null}
      </span>

      {box.updating ? (
        <motion.div
          drag="x"
          dragConstraints={dragRef}
          dragElastic={false}
          dragMomentum={false}
          onDrag={dragLeft}
          css={[
            rcss.position.absolute,
            rcss.top(`50%`),
            rcss.left(0),
            rcss.height("100%"),
            rcss.maxHeight(48),
            rcss.flex.row,
            rcss.py(8),
            rcss.px(4),
            {
              transform: `translateX(0px) translateY(-50%) !important`,
              background: "rgba(0, 0, 0, 0.25)",
              cursor: "col-resize",
            },
          ]}
        >
          <div
            css={[
              {
                borderRight: `solid 2px white`,
              },
            ]}
          />
        </motion.div>
      ) : null}

      {box.updating ? (
        <motion.div
          drag="x"
          dragConstraints={dragRef}
          dragElastic={false}
          dragMomentum={false}
          onDrag={dragRight}
          css={[
            rcss.position.absolute,
            rcss.top("50%"),
            rcss.right(0),
            rcss.height("100%"),
            rcss.maxHeight(48),
            rcss.flex.row,
            rcss.py(8),
            rcss.px(4),
            {
              transform: `translateX(0px) translateY(-50%) !important`,
              background: "rgba(0, 0, 0, 0.25)",
              cursor: "col-resize",
            },
          ]}
        >
          <div
            css={[
              {
                borderRight: `solid 2px white`,
              },
            ]}
          />
        </motion.div>
      ) : null}
    </motion.div>
  );
}

function ImageDragComponent({
  parentRef,
  img,
  index,
  setTextBoxes,
}: {
  parentRef: RefObject<HTMLDivElement>;
  img: Image;
  setTextBoxes: React.Dispatch<React.SetStateAction<Array<TextBox | Image>>>;
  index: number;
}) {
  const dragRef = useRef<HTMLDivElement>(null);

  const boxWidth = useMotionValue(img.width);
  const width = useTransform(boxWidth, (w) => `${w}%`);
  const boxHeight = useMotionValue(img.height);
  const height = useTransform(boxHeight, (h) => `${h}%`);
  const boxLeft = useMotionValue(
    (parentRef.current?.clientWidth || 0) / 2 - img.width / 2
  );
  const boxTop = useMotionValue(
    (parentRef.current?.clientHeight || 0) / 2 - img.height / 2
  );

  const dragRight = useCallback(
    (_, info: PanInfo) => {
      const containerBound = parentRef.current?.getBoundingClientRect();
      const dragBound = dragRef.current?.getBoundingClientRect();

      if (containerBound && dragBound) {
        const newWidthPx = dragBound.width + info.delta.x;
        const newWidth = (newWidthPx / containerBound.width) * 100;

        if (newWidth > 5 && newWidth < 100) {
          boxWidth.set(newWidth);
        }
      }
    },
    [dragRef]
  );

  const dragBottom = useCallback(
    (_, info: PanInfo) => {
      const containerBound = parentRef.current?.getBoundingClientRect();
      const dragBound = dragRef.current?.getBoundingClientRect();

      if (containerBound && dragBound) {
        const newHeightPx = dragBound.height + info.delta.y;
        const newHeight = (newHeightPx / containerBound.height) * 100;

        if (newHeight > 5 && newHeight < 100) {
          boxHeight.set(newHeight);
        }
      }
    },
    [dragRef]
  );

  const dragLeft = useCallback(
    (_, info: PanInfo) => {
      const containerBound = parentRef.current?.getBoundingClientRect();
      const dragBound = dragRef.current?.getBoundingClientRect();

      if (containerBound && dragBound) {
        const newWidthPx = dragBound.width - info.delta.x;
        const newWidth = (newWidthPx / containerBound.width) * 100;

        if (newWidth > 5 && newWidth < 100) {
          boxWidth.set(newWidth);
          boxLeft.set(boxLeft.get() + info.delta.x);
        }
      }
    },
    [dragRef]
  );

  const dragTop = useCallback(
    (_, info: PanInfo) => {
      const containerBound = parentRef.current?.getBoundingClientRect();
      const dragBound = dragRef.current?.getBoundingClientRect();

      if (containerBound && dragBound) {
        const newHeightPx = dragBound.height - info.delta.y;
        const newHeight = (newHeightPx / containerBound.height) * 100;

        if (newHeight > 5 && newHeight < 100) {
          boxHeight.set(newHeight);
          boxTop.set(boxTop.get() + info.delta.y);
        }
      }
    },
    [dragRef]
  );

  return (
    <motion.div
      drag
      style={{
        position: "absolute",
        width,
        height,
        top: boxTop,
        left: boxLeft,
      }}
      ref={dragRef}
      dragMomentum={false}
      animate={{
        backgroundColor: img.updating ? `rgba(0, 0, 0, 0.1)` : undefined,
        border: img.updating
          ? `dashed 1px ${tokens.foregroundDimmer}`
          : `dashed 1px transparent`,
      }}
      whileHover={{
        border: `dashed 1px ${tokens.foregroundDefault}`,
        backgroundColor: `rgba(0, 0, 0, 0.2)`,
      }}
      whileDrag={{
        backgroundColor: `rgba(0, 0, 0, 0.3)`,
      }}
      onClick={() => {
        setTextBoxes((boxes) =>
          boxes.map((b, i) =>
            i === index ? { ...b, updating: true } : { ...b, updating: false }
          )
        );
      }}
    >
      <motion.img
        src={String(img.src)}
        style={{
          width: "100%",
          height: "100%",
          rotate: img.rotate,
        }}
        draggable="false"
      />

      {img.updating ? (
        <motion.div
          drag="x"
          dragConstraints={dragRef}
          dragElastic={false}
          dragMomentum={false}
          onDrag={dragLeft}
          css={[
            rcss.position.absolute,
            rcss.top(`50%`),
            rcss.left(0),
            rcss.height("100%"),
            rcss.maxHeight(48),
            rcss.flex.row,
            rcss.py(8),
            rcss.px(4),
            {
              transform: `translateX(0px) translateY(-50%) !important`,
              background: "rgba(0, 0, 0, 0.25)",
              cursor: "col-resize",
            },
          ]}
        >
          <div
            css={[
              {
                borderRight: `solid 2px white`,
              },
            ]}
          />
        </motion.div>
      ) : null}

      {img.updating ? (
        <motion.div
          drag="y"
          dragConstraints={dragRef}
          dragElastic={false}
          dragMomentum={false}
          onDrag={dragTop}
          css={[
            rcss.position.absolute,
            rcss.left(`50%`),
            rcss.top(0),
            rcss.width("100%"),
            rcss.maxWidth(48),
            rcss.flex.column,
            rcss.px(8),
            rcss.py(4),
            {
              transform: `translateY(0px) translateX(-50%) !important`,
              background: "rgba(0, 0, 0, 0.25)",
              cursor: "row-resize",
            },
          ]}
        >
          <div
            css={[
              {
                borderBottom: `solid 2px white`,
              },
            ]}
          />
        </motion.div>
      ) : null}

      {img.updating ? (
        <motion.div
          drag="x"
          dragConstraints={dragRef}
          dragElastic={false}
          dragMomentum={false}
          onDrag={dragRight}
          css={[
            rcss.position.absolute,
            rcss.top("50%"),
            rcss.right(0),
            rcss.height("100%"),
            rcss.maxHeight(48),
            rcss.flex.row,
            rcss.py(8),
            rcss.px(4),
            {
              transform: `translateX(0px) translateY(-50%) !important`,
              background: "rgba(0, 0, 0, 0.25)",
              cursor: "col-resize",
            },
          ]}
        >
          <div
            css={[
              {
                borderRight: `solid 2px white`,
              },
            ]}
          />
        </motion.div>
      ) : null}

      {img.updating ? (
        <motion.div
          drag="y"
          dragConstraints={dragRef}
          dragElastic={false}
          dragMomentum={false}
          onDrag={dragBottom}
          css={[
            rcss.position.absolute,
            rcss.left(`50%`),
            rcss.bottom(0),
            rcss.width("100%"),
            rcss.maxWidth(48),
            rcss.flex.column,
            rcss.px(8),
            rcss.py(4),
            {
              transform: `translateY(0px) translateX(-50%) !important`,
              background: "rgba(0, 0, 0, 0.25)",
              cursor: "row-resize",
            },
          ]}
        >
          <div
            css={[
              {
                borderBottom: `solid 2px white`,
              },
            ]}
          />
        </motion.div>
      ) : null}
    </motion.div>
  );
}

function TextBoxSettingComponent({
  box,
  updateBox,
  setTextBoxes,
  index,
}: {
  box: TextBox;
  updateBox: (b: TextBox) => void;
  setTextBoxes: React.Dispatch<React.SetStateAction<Array<TextBox | Image>>>;
  index: number;
}) {
  const updateAttr = function <T extends keyof TextBox>(
    key: T,
    value: TextBox[T]
  ) {
    updateBox({
      ...box,
      [key]: value,
    });
  };

  return (
    <View
      css={[
        rcss.borderRadius(8),
        rcss.flex.column,
        rcss.border({
          color: "backgroundHigher",
        }),
      ]}
    >
      <View
        css={[rcss.flex.row, rcss.rowWithGap(8), rcss.align.start, rcss.p(8)]}
      >
        <MultiLineInput
          autoSize
          value={box.text}
          onChange={(e) => updateAttr("text", e.target.value)}
          rows={1}
        />
        <IconButton
          onClick={() => updateAttr("updating", !box.updating)}
          alt="Toggle"
          tooltipHidden
        >
          {!box.updating ? <ChevronRightIcon /> : <ChevronDownIcon />}
        </IconButton>
      </View>

      {!box.updating ? null : (
        <View css={[rcss.flex.column, rcss.colWithGap(8)]}>
          <View css={[rcss.flex.column, rcss.colWithGap(8), rcss.p(8)]}>
            <View css={[rcss.rowWithGap(8), rcss.align.center]}>
              <Text variant="small">Size</Text>
              <input
                type="range"
                min={8}
                max={128}
                value={box.size}
                onChange={(e) => updateAttr("size", Number(e.target.value))}
                css={rcss.flex.grow(1)}
              />
            </View>

            <View css={[rcss.rowWithGap(8), rcss.align.center]}>
              <Text variant="small">Color</Text>
              <label
                htmlFor="textColor"
                css={[interactive.filled, rcss.p(4), rcss.pt(0)]}
              >
                <PaletteIcon />
                <input
                  type="color"
                  value={box.color}
                  onChange={(e) => updateAttr("color", e.target.value)}
                  id="textColor"
                  style={{
                    position: "absolute",
                    opacity: 0,
                    width: 0,
                    height: 0,
                  }}
                />
              </label>
              <View
                css={[
                  rcss.border({
                    direction: "right",
                    color: "backgroundHigher",
                  }),
                  rcss.height("calc(100% - 8px)"),
                ]}
              />
              <Text variant="small">Opacity</Text>
              <input
                type="range"
                min={0}
                max={1}
                onChange={(e) => updateAttr("opacity", Number(e.target.value))}
                css={rcss.flex.grow(1)}
                step={0.01}
              />
            </View>

            <View css={[rcss.rowWithGap(8), rcss.align.center]}>
              <Text variant="small">Outline</Text>
              <label
                htmlFor="outlineColor"
                css={[interactive.filled, rcss.p(4), rcss.pt(0)]}
              >
                <PaletteIcon />
                <input
                  type="color"
                  value={box.outlineColor}
                  onChange={(e) => updateAttr("outlineColor", e.target.value)}
                  id="outlineColor"
                  style={{
                    position: "absolute",
                    opacity: 0,
                    width: 0,
                    height: 0,
                  }}
                />
              </label>
              <View
                css={[
                  rcss.border({
                    direction: "right",
                    color: "backgroundHigher",
                  }),
                  rcss.height("calc(100% - 8px)"),
                ]}
              />
              <Text variant="small">Thickness</Text>
              <input
                type="range"
                min={0}
                max={25}
                value={box.outlineThickness}
                onChange={(e) =>
                  updateAttr("outlineThickness", Number(e.target.value))
                }
                css={rcss.flex.grow(1)}
              />
            </View>

            <View css={[rcss.rowWithGap(8)]}>
              <Text variant="small">Rotate</Text>
              <input
                type="range"
                min={0}
                max={360}
                value={box.rotate}
                onChange={(e) => updateAttr("rotate", Number(e.target.value))}
                css={rcss.flex.grow(1)}
              />
            </View>

            <View css={[rcss.rowWithGap(8)]}>
              <View css={[rcss.colWithGap(4), rcss.flex.grow(1)]}>
                <Text variant="small">Font</Text>
                <Select
                  items={fonts.map((f) => ({
                    title: f,
                    value: f,
                  }))}
                  selectedItem={{
                    title: box.font,
                    value: box.font,
                  }}
                  onChange={(item) => {
                    updateAttr("font", item.value);
                  }}
                />
              </View>

              <View css={[rcss.colWithGap(4), rcss.flex.grow(1)]}>
                <Text variant="small">Text Align</Text>
                <Select
                  items={textAlignments.map((f) => ({
                    title: f,
                    value: f,
                  }))}
                  selectedItem={{
                    title: box.textAlign,
                    value: box.textAlign,
                  }}
                  onChange={(item) => {
                    updateAttr(
                      "textAlign",
                      item.value as "center" | "left" | "right"
                    );
                  }}
                />
              </View>

              <View css={[rcss.colWithGap(4), rcss.flex.grow(1)]}>
                <Text variant="small">Text Style</Text>
                <Select
                  items={textStyles.map((f) => ({
                    title: f,
                    value: f,
                  }))}
                  selectedItem={{
                    title: box.textStyle,
                    value: box.textStyle,
                  }}
                  onChange={(item) => {
                    updateAttr(
                      "textStyle",
                      item.value as "regular" | "bold" | "italic"
                    );
                  }}
                />
              </View>
            </View>
          </View>
          <View
            css={[
              rcss.flex.row,
              rcss.rowWithGap(8),
              rcss.p(8),
              rcss.border({
                direction: "top",
                color: "backgroundHigher",
              }),
              rcss.justify.end,
            ]}
          >
            <Button
              text="Apply Styles to all Text"
              onClick={() => {
                setTextBoxes((boxes) =>
                  boxes.map((b) =>
                    b.type === "textbox"
                      ? {
                          ...box,
                          text: b.text,
                          width: b.width,
                          initialTop: b.initialTop,
                          updating: b.updating,
                        }
                      : b
                  )
                );
              }}
            />
            <Button
              text="Delete"
              colorway="negative"
              onClick={() => {
                setTextBoxes((boxes) => boxes.filter((_, i) => index !== i));
              }}
            />
          </View>
        </View>
      )}
    </View>
  );
}

function ImageSettingComponent({
  img,
  updateImg,
  setTextBoxes,
  index,
}: {
  img: Image;
  updateImg: (img: Image) => void;
  setTextBoxes: React.Dispatch<React.SetStateAction<Array<TextBox | Image>>>;
  index: number;
}) {
  const updateAttr = function <T extends keyof Image>(key: T, value: Image[T]) {
    updateImg({
      ...img,
      [key]: value,
    });
  };

  return (
    <View
      css={[
        rcss.borderRadius(8),
        rcss.flex.column,
        rcss.border({
          color: "backgroundHigher",
        }),
        rcss.p(8),
        rcss.colWithGap(8),
      ]}
    >
      <View css={[rcss.flex.row, rcss.rowWithGap(8), rcss.align.center]}>
        <Text
          css={{
            flex: "1 1 0",
          }}
        >
          {img.name}
        </Text>
        <IconButton
          onClick={() => updateAttr("updating", !img.updating)}
          alt="Toggle"
          tooltipHidden
        >
          {!img.updating ? <ChevronRightIcon /> : <ChevronDownIcon />}
        </IconButton>
      </View>

      {!img.updating ? null : (
        <View css={[rcss.flex.column, rcss.colWithGap(8)]}>
          <View css={[rcss.rowWithGap(8), rcss.align.center]}>
            <Text variant="small">Rotate</Text>
            <input
              type="range"
              min={0}
              max={360}
              value={img.rotate}
              onChange={(e) => updateAttr("rotate", Number(e.target.value))}
              css={rcss.flex.grow(1)}
            />
            <Button
              text="Delete"
              colorway="negative"
              small
              onClick={() => {
                setTextBoxes((boxes) => boxes.filter((_, i) => index !== i));
              }}
            />
          </View>
        </View>
      )}
    </View>
  );
}

function EditorCanvas({
  innerRef,
  imageUrl,
  textBoxes,
  setTextBoxes,
}: {
  innerRef: RefObject<HTMLDivElement>;
  imageUrl: string;
  textBoxes: Array<TextBox | Image>;
  setTextBoxes: React.Dispatch<React.SetStateAction<Array<TextBox | Image>>>;
}) {
  const motionConstraint = useRef<HTMLImageElement>(null);

  return (
    <div
      ref={innerRef}
      css={[
        rcss.position.relative,
        {
          overflow: "hidden",
        },
      ]}
    >
      <motion.img
        src={imageUrl}
        css={[rcss.width("100%"), rcss.height("100%")]}
        ref={motionConstraint}
        onClick={() =>
          setTextBoxes((boxes) => boxes.map((b) => ({ ...b, updating: false })))
        }
        draggable="false"
      />
      {textBoxes.map((box, index) =>
        box.type === "textbox" ? (
          <TextBoxDragComponent
            key={index}
            parentRef={innerRef}
            box={box}
            setTextBoxes={setTextBoxes}
            index={index}
          />
        ) : (
          <ImageDragComponent
            key={index}
            parentRef={innerRef}
            img={box}
            setTextBoxes={setTextBoxes}
            index={index}
          />
        )
      )}
    </div>
  );
}

export default function MemeEditor() {
  const [meme, setMeme] = useAtom(global.meme);
  const [textBoxes, setTextBoxes] = useState<Array<TextBox | Image>>([
    {
      text: "Top Text",
      size: 36,
      color: `rgb(255, 255, 255)`,
      opacity: 1,
      outlineColor: `rgb(0, 0, 0)`,
      outlineThickness: 2,
      font: fonts[0],
      textAlign: textAlignments[0],
      width: 100,
      initialTop: 36,
      textStyle: "regular",
      rotate: 0,
      type: "textbox",
    },
    {
      text: "Bottom Text",
      size: 36,
      color: `rgb(255, 255, 255)`,
      opacity: 1,
      outlineColor: `rgb(0, 0, 0)`,
      outlineThickness: 2,
      font: fonts[0],
      textAlign: textAlignments[0],
      width: 100,
      initialTop: "calc(100% - 72px)",
      textStyle: "regular",
      rotate: 0,
      type: "textbox",
    },
  ]);

  const canvasRef = useRef<HTMLDivElement>(null);
  const fileUploadRef = useRef<HTMLInputElement>(null);

  if (meme) {
    const { title, imageUrl } = meme;

    const addText = () => {
      if (canvasRef.current) {
        setTextBoxes([
          ...textBoxes,
          {
            text: "Text",
            size: 36,
            color: `rgb(255, 255, 255)`,
            opacity: 1,
            outlineColor: `rgb(0, 0, 0)`,
            outlineThickness: 2,
            font: fonts[0],
            textAlign: textAlignments[0],
            width: 100,
            initialTop: "calc(50% - 18px)",
            textStyle: "regular",
            rotate: 0,
            type: "textbox",
            updating: true,
          },
        ]);
      }
    };

    const download = async () => {
      if (canvasRef.current) {
        setTextBoxes(textBoxes.map((b) => ({ ...b, updating: false })));
        const canvas = await html2canvas(canvasRef.current, {
          allowTaint: true,
          useCORS: true,
        });
        const dataURL = canvas.toDataURL("image/png");
        downloadjs(
          dataURL,
          meme.title.replace(/\W+/g, "-") + ".png",
          "image/png"
        );
        await messages.showConfirm("Downloaded image successfully");
      } else {
        await messages.showError("Failed to download image");
      }
    };

    const exportToRepl = async () => {
      if (canvasRef.current) {
        setTextBoxes(textBoxes.map((b) => ({ ...b, updating: false })));
        const canvas = await html2canvas(canvasRef.current, {
          allowTaint: true,
          useCORS: true,
        });
        canvas.toBlob((blob: Blob) => {
          fs.writeFile(meme.title.replace(/\W+/g, "-") + ".png", blob).then(
            () => {
              messages.showConfirm("Exported image successfully");
            }
          );
        });
      }
    };

    const copyImage = async () => {
      if (canvasRef.current) {
        setTextBoxes(textBoxes.map((b) => ({ ...b, updating: false })));
        const canvas = await html2canvas(canvasRef.current, {
          allowTaint: true,
          useCORS: true,
        });
        canvas.toBlob(function (blob) {
          // @ts-ignore
          const item = new ClipboardItem({ "image/png": blob });
          navigator.clipboard.write([item]).then(() => {
            messages.showConfirm("Copied image to clipboard");
          });
        });
      } else {
        messages.showError("Failed to copy image");
      }
    };

    const addImage = (e: ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files || !e.target.files[0]) return;

      const fileReader = new FileReader();

      fileReader.addEventListener("load", function (evt) {
        const res = evt.target?.result;

        if (res && evt.target && e.target.files?.[0]) {
          const img = new Image();
          img.onload = () => {
            const greater = img.width > img.height ? "width" : "height";

            const newImage: Image = {
              type: "image",
              name: e.target.files?.[0].name || "image",
              rotate: 0,
              src: res,
              width: greater === "width" ? 50 : (img.width / img.height) * 50,
              height: greater === "height" ? 50 : (img.height / img.width) * 50,
            };
            setTextBoxes([...textBoxes, newImage]);
            if (fileUploadRef.current?.value) {
              fileUploadRef.current.value = "";
            }
          };
          img.src = evt.target.result as string;
        }
      });

      fileReader.readAsDataURL(e.target.files[0]);
    };

    return (
      <View css={[rcss.flex.column, rcss.flex.grow(1)]}>
        <View
          css={[
            rcss.flex.row,
            rcss.rowWithGap(8),
            rcss.align.center,
            rcss.p(8),
            rcss.border({
              direction: "bottom",
              color: "backgroundHigher",
            }),
          ]}
        >
          <Button
            text="Back"
            iconLeft={<ChevronLeftIcon />}
            onClick={() => setMeme(null)}
          />

          <View
            css={{
              minWidth: 0,
              flex: "1 1 0",
            }}
          >
            <Text variant="subheadDefault">{title}</Text>
          </View>
        </View>

        <View css={[rcss.flex.grow(1), rcss.position.relative]}>
          <View
            css={[
              rcss.position.absolute,
              rcss.top(0),
              rcss.left(0),
              rcss.width("100%"),
              rcss.height("100%"),
              rcss.overflowY("auto"),
              rcss.overflowX("hidden"),
              rcss.flex.column,
              rcss.align.center,
              rcss.p(16),
            ]}
          >
            <View
              css={[
                rcss.maxWidth(480),
                rcss.width("100%"),
                rcss.flex.column,
                rcss.colWithGap(16),
              ]}
            >
              <EditorCanvas
                imageUrl={imageUrl}
                innerRef={canvasRef}
                textBoxes={textBoxes}
                setTextBoxes={setTextBoxes}
              />

              <View css={[rcss.flex.column, rcss.colWithGap(8)]}>
                {textBoxes.map((box, index) =>
                  box.type === "textbox" ? (
                    <TextBoxSettingComponent
                      key={index}
                      box={box}
                      updateBox={(b: TextBox) =>
                        setTextBoxes(
                          textBoxes.map((original, i) =>
                            i === index ? b : original
                          )
                        )
                      }
                      setTextBoxes={setTextBoxes}
                      index={index}
                    />
                  ) : (
                    <ImageSettingComponent
                      key={index}
                      img={box}
                      updateImg={(b: Image) =>
                        setTextBoxes(
                          textBoxes.map((original, i) =>
                            i === index ? b : original
                          )
                        )
                      }
                      setTextBoxes={setTextBoxes}
                      index={index}
                    />
                  )
                )}
                <View css={[rcss.flex.row, rcss.rowWithGap(8)]}>
                  <Button
                    text="Add Text"
                    iconRight={<PlusIcon />}
                    onClick={addText}
                    css={rcss.flex.grow(1)}
                  />
                  <label
                    css={[rcss.flex.grow(1), rcss.flex.row, rcss.align.center]}
                  >
                    <input
                      type="file"
                      accept="image/png, image/jpg, image/jpeg"
                      onChange={addImage}
                      ref={fileUploadRef}
                    />
                  </label>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View
          css={[
            rcss.flex.row,
            rcss.rowWithGap(8),
            rcss.align.center,
            rcss.p(8),
            rcss.border({
              direction: "top",
              color: "backgroundHigher",
            }),
          ]}
        >
          <Button
            text="Download"
            iconRight={<DownloadIcon />}
            onClick={download}
          />
          <Button
            text="Export to Repl"
            iconRight={<LogoIcon />}
            onClick={exportToRepl}
          />
          <Button
            text="Copy Image"
            iconRight={<CopyIcon />}
            onClick={copyImage}
          />
        </View>
      </View>
    );
  } else {
    return null;
  }
}
