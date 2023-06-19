import * as React from "react";
import { useSelect } from "downshift";
// eslint-disable-next-line import/no-restricted-paths
import { useLatest } from "application/hooks";
import { View, rcss, Menu, MenuItem } from ".";
import ChevronIcon from "application/ui/icons/Chevron";
import { interactive } from "application/rui/Interactive";
import { Text } from "application/rui/Text";
import { cssRecord } from "application/rui/cssRecord";
import { VisuallyHidden } from "@react-aria/visually-hidden";

export interface Option {
  icon?: React.ReactElement<{ size: number }>;
  title: string;
  /** Allows selection of the menu item */
  dataCy?: string;
  subtitle?: string;
  taller?: boolean;
}

interface SelectProps<OptionType> {
  /** TODO(@Talor-A): this is the only way to properly label the select component. this should be made required. */
  "aria-label"?: string;
  /** Useful in combination with `<Label for={id]} ... />` for a11y */
  id?: string;
  /** List of items to render when the user activates the `<Select>` */
  items: Array<OptionType>;
  /** Allows customizing button look via `css` prop */
  className?: string;
  /** Initially selected item, use this if you just want to control the starting
   * state of the Select. If you Select to be a controlled component, use
   * selectedItem instead. */
  initialSelectedItem?: OptionType;
  /** Use this to fully control the state of the Select.
   * Use null (not undefined) to represent an empty selection
   * See https://www.downshift-js.com/use-select/#controlling-state example
   */
  selectedItem?: OptionType | null;
  /** Called when user makes their selection */
  onChange(item: OptionType): void;
  /** Shows when no selection has been made */
  placeholder?: string;
  /** Disables the selection menu */
  disabled?: boolean;
  /** Allows selection of the menu container */
  dataCy?: string;
}

const style = cssRecord({
  button: [
    interactive.filled,
    rcss.p(8),
    rcss.color("foregroundDefault"),
    rcss.height(32),
    rcss.display.flex,
    rcss.align.center,
    rcss.font.default,
  ],
  fieldWrapper: [
    rcss.align.center,
    rcss.rowWithGap(8),
    // need flex: 1; so that the inner content fills the parent container
    { flex: 1 },
  ],
  activeText: [
    rcss.flex.growAndShrink(1),
    { textAlign: "left" },
    rcss.font.default,
    rcss.color("foregroundDefault"),
  ],
  placeholderText: [
    rcss.flex.growAndShrink(1),
    { textAlign: "left" },
    rcss.font.default,
    rcss.color("foregroundDimmer"),
  ],
  menuWrapper: { position: "relative" },
});

/**
 * It's like a `<select>` but starts with a capital letter
 */
export function Select<T extends Option>({
  id,
  items,
  ["aria-label"]: ariaLabel,
  initialSelectedItem,
  selectedItem,
  onChange,
  placeholder,
  dataCy,
  ...props
}: SelectProps<T>) {
  const onChangeRef = useLatest(onChange);

  const select = useSelect({
    id,
    items,
    initialSelectedItem,
    onSelectedItemChange({ selectedItem: newSelectedItem }) {
      if (newSelectedItem) {
        onChangeRef.current(newSelectedItem);
      }
    },
    // Downshift appears to the existence of key to detect whether to shift to
    // controlled mode, so only provide this if defined.
    ...(selectedItem !== undefined && { selectedItem }),
  });

  return (
    <View dataCy={dataCy}>
      <VisuallyHidden>
        <label {...select.getLabelProps()}>{ariaLabel}</label>
      </VisuallyHidden>
      <button
        type="button"
        css={style.button}
        {...props}
        {...select.getToggleButtonProps()}
      >
        <View css={style.fieldWrapper}>
          {select.selectedItem ? (
            <>
              {select.selectedItem.icon
                ? React.cloneElement(select.selectedItem.icon, { size: 16 })
                : null}
              <Text css={style.activeText}>{select.selectedItem.title}</Text>
            </>
          ) : (
            <Text color="dimmest" css={style.placeholderText}>
              {placeholder}
            </Text>
          )}
          <ChevronIcon rotate={select.isOpen ? 180 : 0} />
        </View>
      </button>
      {/* TODO: use View after adding forwardRef */}
      <div {...select.getMenuProps()} css={style.menuWrapper}>
        {select.isOpen && items.length > 0 ? (
          <Menu>
            {items.map((item, index) => (
              <li
                key={item.title}
                {...select.getItemProps({ item, index })}
                data-cy={item.dataCy}
              >
                <MenuItem
                  highlighted={index === select.highlightedIndex}
                  selected={item === select.selectedItem}
                  icon={item.icon}
                  title={item.title}
                  subtitle={item.subtitle}
                  taller={item.taller}
                />
              </li>
            ))}
          </Menu>
        ) : null}
      </div>
    </View>
  );
}
