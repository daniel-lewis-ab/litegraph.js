import { useWorkflowEditor } from '@/hooks/useWorkflowEditor/useWorkflowEditor';

export const EditorFooter = () => {
  const { currentWorkflow } = useWorkflowEditor();
  const inputs = currentWorkflow?.content?.nodes?.filter((node) => node.type === 'SaltInput').length ?? 0;
  const outputs = currentWorkflow?.content?.nodes?.filter((node) => node.type === 'SaltOutput').length ?? 0;
  const nodes = currentWorkflow?.content?.nodes?.length ?? 0;

  return (
    <div className="mt-2 flex flex-row justify-center rounded-lg bg-surface-2 py-2 *:text-xs">
      <p className="mx-3 font-medium text-text-muted">{nodes} nodes</p>
      <p className="mx-3 font-medium text-text-muted">{inputs} inputs</p>
      <p className="mx-3 font-medium text-text-muted">{outputs} outputs</p>
    </div>
  );
};
