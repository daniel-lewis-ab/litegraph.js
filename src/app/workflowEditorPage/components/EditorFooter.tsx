import { useWorkflowEditor } from '@/hooks/useWorkflowEditor/useWorkflowEditor';

export const EditorFooter = () => {
  const { currentWorkflow } = useWorkflowEditor();
  const inputs = currentWorkflow?.content?.nodes?.filter((node) => node.type === 'SaltInput').length ?? 0;
  const outputs = currentWorkflow?.content?.nodes?.filter((node) => node.type === 'SaltOutput').length ?? 0;
  const nodes = currentWorkflow?.content?.nodes?.length ?? 0;

  return (
    <div className="mt-1 flex items-center justify-center rounded-lg bg-surface-2 p-2 *:text-xs">
      {/* <div className="flex gap-1">
        <Button size="xs" color="warning" className="mr-2" leftIcon={faTriangleExclamation} variant="ghost">
          2
        </Button>
        <Button size="xs" color="error" variant="ghost" className="mr-2" leftIcon={faHexagonCheck}>
          12
        </Button>
      </div> */}
      <div className="flex">
        <p className="mx-3 font-medium text-text-muted">{nodes} nodes</p>
        <p className="mx-3 font-medium text-text-muted">{inputs} inputs</p>
        <p className="mx-3 font-medium text-text-muted">{outputs} outputs</p>
      </div>
      <div></div>
    </div>
  );
};
