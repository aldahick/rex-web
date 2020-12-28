import React, { ReactElement, useEffect } from "react";

import { useStores } from "../../hook/useStores";

export const SocketEvent: React.FC<{
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handle: (data: any) => void;
  children: ReactElement;
}> = ({ name, handle, children }) => {
  const { socketStore } = useStores();

  useEffect(() => {
    socketStore.socket.on(name, handle);
    return () => {
      socketStore.socket.off(name, handle);
    };
  }, [socketStore, handle, name]);

  return children;
};
