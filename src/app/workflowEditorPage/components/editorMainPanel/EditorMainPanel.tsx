import React, { useRef, useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle, ImperativePanelGroupHandle } from 'react-resizable-panels';

import { LogData } from '@/api/types';
import { EditorIframe } from './components/editorIframe/EditorIframe';
import { EditorNotification } from './components/EditorNotification';
import { EditorLogs } from './components/EditorLogs';

type EditorMainPanelProps = {
  logs: LogData[];
  isLogsVisible: boolean;
  setIsLogsVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

export const EditorMainPanel = ({ logs, isLogsVisible, setIsLogsVisible }: EditorMainPanelProps) => {
  const [areLogsExpanded, setAreLogsExpanded] = useState(false);
  const innerPanelRef = useRef<ImperativePanelGroupHandle | null>(null);

  const toggleLogsFullWidth = () => innerPanelRef.current?.setLayout(areLogsExpanded ? [90, 20] : [0, 100]);

  return (
    <PanelGroup direction="vertical" ref={innerPanelRef} autoSaveId="logsAndIframe">
      <Panel defaultSize={75}>
        <div className="relative h-full">
          <EditorIframe />
          <div className="absolute right-4 top-4">
            <EditorNotification onViewLogsClick={() => setIsLogsVisible(true)} />
          </div>
        </div>
      </Panel>
      <PanelResizeHandle />
      {isLogsVisible && (
        <Panel defaultSize={25} minSize={5} onResize={(size) => setAreLogsExpanded(size === 100)}>
          <EditorLogs
            logs={logs}
            isExpanded={areLogsExpanded}
            onToggleExpand={toggleLogsFullWidth}
            onCloseClick={() => setIsLogsVisible(false)}
          />
        </Panel>
      )}
    </PanelGroup>
  );
};
