import { useEffect, ComponentProps } from "react";
import format from "date-fns/format";
import formatDistanceStrict from "date-fns/formatDistanceStrict";
import { atom, useAtom } from "jotai";
import { Tooltip } from "./Tooltip";
import { rcss } from ".";
import { interactive } from "./Interactive";
import { SpecializedView } from "./View";
import { Text } from "./Text";

// dates at or before this are considered "a long time ago" for relative dates (for now, just unix epoch or missing dates.
export const A_LONG_TIME_AGO_DATE = new Date(0);

const SpanView = SpecializedView.span;

// TODO: persist this option and add a way to toggle from the account
const showAbsoluteDatesAtom = atom(false);

// Timezone on server is different than on client
// upon the first render we want to make sure we
// don't use absolute time until after we hydrate.
// The following atom makes sure allows us to render
// the absolute date directly on the first render
// after we hydrate.
const didHydrateAtom = atom(false);

/**
 * Accepts a date that's wrapped into the standard date constructor
 * and returns a string representing the date in a format based on
 * the `dateFormat` prop.
 */
export function Timestamp({
  date,
  className,
  textColor = "default",
  textVariant = "text",
  dateFormat = "relative",
}: {
  date: string | number | Date;
  className?: string;
  textColor?: ComponentProps<typeof Text>["color"];
  textVariant?: ComponentProps<typeof Text>["variant"];
  /**
   * By default (`'relative'`), the timestamp will show a relative
   * date and an absolute date on hover.
   *
   * Passing `'absolute'` will show the absolute date instead. During server
   * side rendering, this option is not respected, it will use relative date/time
   * instead to avoid hydration issues.
   *
   * This value can also be set to `'switch'` which will show the relative
   * date but allow the user to switch to absolute by clicking on the component
   * by clicking on the timestamp, all "switch" timestamps are synchronized
   * with a global boolean.
   */
  dateFormat?: "relative" | "absolute" | "switch";
}) {
  const [showAbsoluteDatesGlobal, setShowAbsoluteDatesGlobal] = useAtom(
    showAbsoluteDatesAtom
  );
  const [didHydrate, setDidHydrate] = useAtom(didHydrateAtom);

  const relativeDate = toRelativeDate(date);
  const absoluteDate = didHydrate ? toAbsoluteDate(date) : relativeDate;
  useEffect(() => {
    if (didHydrate) {
      return;
    }

    setDidHydrate(true);
  }, [setDidHydrate, didHydrate]);

  const isSwitchable = dateFormat === "switch";
  const showAbsolute =
    didHydrate &&
    (dateFormat === "absolute" || (isSwitchable && showAbsoluteDatesGlobal));

  const mainDate = showAbsolute ? absoluteDate : relativeDate;
  const tooltipDate = showAbsolute ? relativeDate : absoluteDate;

  const switchableProps = isSwitchable
    ? ({
        onClick: () => setShowAbsoluteDatesGlobal((s) => !s),
        role: "switch",
        tabIndex: 0,
        "aria-checked": showAbsolute,
        onKeyDown: (e) => {
          if (e.code === "Space" || e.code === "Enter") {
            e.preventDefault();
            setShowAbsoluteDatesGlobal((s) => !s);
          }
        },
      } as ComponentProps<typeof SpanView>)
    : {};

  return (
    <Tooltip tooltip={tooltipDate}>
      {(props, ref) => (
        <SpanView
          ref={ref}
          {...props}
          {...switchableProps}
          css={[
            { width: "max-content" },
            isSwitchable ? [rcss.px(2), interactive.nofill] : [],
          ]}
        >
          <Text className={className} color={textColor} variant={textVariant}>
            {mainDate}
          </Text>
        </SpanView>
      )}
    </Tooltip>
  );
}

function toAbsoluteDate(date: string | number | Date) {
  // https://replit.com/ui/Guidelines/Writing
  return format(new Date(date), "h:mm bbb, MMM dd, yyyy");
}

function toRelativeDate(date: string | number | Date) {
  const asDate = new Date(date);
  if (asDate <= A_LONG_TIME_AGO_DATE) {
    return "a long time ago";
  }

  return formatDistanceStrict(asDate, new Date(), { addSuffix: true });
}
