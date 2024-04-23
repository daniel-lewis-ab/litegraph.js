import { WorkflowContent } from '@/api/types';

const removeAPIKeys = (workflowContent: WorkflowContent): WorkflowContent => {
  // Make a list of the Regex Expressions to clear in the workflow.
  const clearList = [/sk-[\w]{22}BlbkFJ[\w]{20}/];
  workflowContent.nodes?.forEach((node) => {
    if (Array.isArray(node.widgets_values)) {
      node.widgets_values?.forEach((item: string, index, theArray) => {
        clearList.forEach((reExpression) => {
          // Check if the current key is in the clearList
          if (reExpression.test(item)) {
            // Set the value of the key to an empty string
            theArray[index] = '';
          }
        });
      });
    }
  });
  return workflowContent;
};

export const saveWorkflowContentToFile = (workflowContent: WorkflowContent | undefined, filename = 'file.json') => {
  if (workflowContent == undefined) {
    throw Error('Missing workflowContent, cannot download at this time.');
  }
  workflowContent = removeAPIKeys(workflowContent);
  const workflowContentString = JSON.stringify(workflowContent);
  saveStringToFile(workflowContentString, filename);
};

export const saveStringToFile = (data: string, filename = 'file.json', fileType = 'application/json') => {
  const blob = new Blob([data], { type: fileType });
  const href = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = href;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
