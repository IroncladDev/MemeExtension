import {
  Tabs as RTabs,
  Tab as RTab,
  TabProps as RTabProps,
  TabList as RTabList,
  TabPanel as RTabPanel,
  TabPanels as RTabPanels,
  useTabsContext,
  TabListProps as RTabListProps,
  TabPanelProps,
  TabPanelsProps,
  TabsProps,
} from "@reach/tabs";
import React from "react";
import { interactive } from "./Interactive";
import { rcss, tokens } from "application/themes";
import { View } from "./View";

import type { Props as IconProps } from "application/ui/icons/Icon";

export interface TabProps extends RTabProps {
  iconLeft?: React.ReactElement<IconProps>;
  iconRight?: React.ReactElement<IconProps>;
}

export const tabStyles = ({
  isFocused,
  isSelected,
}: {
  isFocused: boolean;
  isSelected: boolean;
}) => {
  let borderBottomColor = "transparent";
  if (isFocused) borderBottomColor = tokens.accentPrimaryDefault;
  else if (isSelected) borderBottomColor = tokens.foregroundDefault;

  return [
    rcss.display.flex,
    rcss.reset.button,
    interactive.listItem,
    rcss.rowWithGap(8),
    rcss.p(8),
    rcss.borderRadius(4, 4, 0, 0),
    rcss.align.center,
    {
      // align the bottom border of the tab to the bottom border of the TabList
      marginBottom: -1,
      borderWidth: 0,
      paddingBottom: 7,
      color: isSelected ? tokens.foregroundDefault : tokens.foregroundDimmer,
      borderBottomWidth: "1px",
      borderBottomColor,
    },
  ];
};

/**
 * Tab
 *
 * The interactive element that changes the selected panel.
 *
 * If you want more control over the Tab, import it from @reach/tabs
 *
 * must be a child of a TabList!
 *
 * @see Docs https://reach.tech/tabs#tab
 */
export const Tab = ({ iconLeft, iconRight, ...props }: TabProps) => {
  const { focusedIndex, selectedIndex } = useTabsContext();
  const isSelected = selectedIndex === props.index;
  const isFocused = focusedIndex === props.index;

  return (
    <RTab
      css={tabStyles({ isSelected, isFocused })}
      {...props}
      style={{
        gap: 8,
        padding: "8px 12px",
      }}
    >
      {iconLeft}
      {props.children}
      {iconRight}
    </RTab>
  );
};

export function TabDivider({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <View
      {...props}
      css={{
        borderLeft: "1px solid",
        borderColor: tokens.outlineDimmest,
        height: 16,
        display: "inline-block",
      }}
    />
  );
}

export interface TabListProps extends RTabListProps {
  withDividers?: boolean;
  withUnderline?: boolean;
}
/**
 * TabList.
 * The container for all Tab elements.
 * Has added magic to automatically pass the index prop to each child.
 * Also has styling.
 *
 * Must be a child of a Tabs component.
 *
 * If you want more control over the TabList, import it from @reach/tabs directly
 *
 * @see Docs https://reach.tech/tabs#tablist
 */
export const TabList = React.forwardRef<HTMLDivElement, TabListProps>(
  ({ children, withDividers = true, withUnderline = true, ...props }, ref) => (
    <RTabList
      {...props}
      ref={ref}
      css={[
        rcss.display.flex,
        rcss.flex.growAndShrink(1),
        rcss.flex.row,
        rcss.align.stretch,
        {
          // offset the negative margin on the Tab components, use padding here
          // to not trigger vertical scrollbars on the list.
          paddingBottom: 1,
        },
        withUnderline && {
          boxShadow: `inset 0 -1px 0 ${tokens.outlineDimmest}`,
        },
      ]}
    >
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child))
          return (
            <>
              {index > 0 && withDividers && (
                <TabDivider
                  css={[
                    {
                      alignSelf: "center",
                    },
                  ]}
                />
              )}
              {
                //@ts-expect-error index is not a valid prop on child
                React.cloneElement(child, { index })
              }
            </>
          );

        return child;
      })}
    </RTabList>
  )
);
TabList.displayName = "TabList";

export { RTabs as Tabs, RTabPanel as TabPanel, RTabPanels as TabPanels };

export type { TabPanelProps, TabPanelsProps, TabsProps };
