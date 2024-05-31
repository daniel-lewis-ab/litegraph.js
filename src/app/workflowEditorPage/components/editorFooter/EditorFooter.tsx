import { useWorkflowEditor } from '@/hooks/useWorkflowEditor/useWorkflowEditor';
import { LoaderIcon } from 'react-hot-toast';

export const EditorFooter = ({ loadingModelsCount }: { loadingModelsCount: number }) => {
  const { currentWorkflow } = useWorkflowEditor();
  const inputs = currentWorkflow?.content?.nodes?.filter((node) => node.type === 'SaltInput').length ?? 0;
  const outputs = currentWorkflow?.content?.nodes?.filter((node) => node.type === 'SaltOutput').length ?? 0;
  const nodes = currentWorkflow?.content?.nodes?.length ?? 0;

  return (
    <div className="mt-1 flex items-center justify-between rounded-lg bg-surface-2 p-2 *:text-xs">
      {/* <div className="flex gap-1">
        <Button size="xs" color="warning" className="mr-2" leftIcon={faTriangleExclamation} variant="ghost">
          2
        </Button>
        <Button size="xs" color="error" variant="ghost" className="mr-2" leftIcon={faHexagonCheck}>
          12
        </Button>
      </div> */}
      <div className="flex flex-1 justify-start">
        {loadingModelsCount > 0 ? (
          <div className="flex items-center justify-center">
            <LoaderIcon />
            <p className="ml-1 text-text-subtle">
              Importing {loadingModelsCount}/{loadingModelsCount} models
            </p>
          </div>
        ) : null}
      </div>
      <div className="flex flex-1 justify-center">
        <p className="mx-3 text-text-subtle">{nodes} nodes</p>
        <p className="mx-3 text-text-subtle">{inputs} inputs</p>
        <p className="mx-3 text-text-subtle">{outputs} outputs</p>
      </div>
      <div className="flex-1"></div>
    </div>
  );
};
