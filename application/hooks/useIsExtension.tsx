import { useReplit } from "@replit/extensions-react";
import { HandshakeStatus } from "@replit/extensions";

export function useIsExtension() {
  const { status } = useReplit();

  return status === HandshakeStatus.Ready;
}
