import * as React from "react";
import { ExactMatchSubString } from "application/components/Dropdown";
import { css } from "@emotion/react";
import { View, rcss, tokens, interactive, Text } from ".";

interface Props {
  title: string;
  subtitle?: string;
  icon?: React.ReactElement<{ size: number }>;
  filter?: string;
  highlighted?: boolean;
  selected?: boolean;
  taller?: boolean;
}

const menuItemStyles = ({
  highlighted,
  selected,
  taller,
}: {
  highlighted?: boolean;
  selected?: boolean;
  taller?: boolean;
}) =>
  css([
    rcss.rowWithGap(8),
    rcss.align.center,
    rcss.p(8),
    {
      cursor: "pointer",
      height: taller ? "auto" : tokens.space32,
    },
    highlighted && {
      backgroundColor:
        interactive.listItem[":not([disabled])"][":not(textarea):active"]
          .backgroundColor,
    },
    selected && {
      backgroundColor: tokens.accentPrimaryDimmer,
      color: tokens.foregroundDefault,
    },
  ]);

export function MenuItem(props: Props) {
  const title = props.filter ? (
    <ExactMatchSubString source={props.title} match={props.filter} />
  ) : (
    props.title
  );

  const icon = props.icon
    ? React.cloneElement(props.icon, {
        size: props.subtitle ? 24 : 16,
      })
    : null;

  if (props.subtitle) {
    return (
      <View css={menuItemStyles(props)}>
        {icon}
        <View css={[rcss.colWithGap(2), rcss.flex.growAndShrink(1)]}>
          <Text>{title}</Text>
          <Text
            variant="small"
            css={!props.selected && rcss.color("foregroundDimmer")}
          >
            {props.subtitle}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View css={menuItemStyles(props)}>
      {icon}
      <Text css={{ flexShrink: 1 }}>{title}</Text>
    </View>
  );
}
