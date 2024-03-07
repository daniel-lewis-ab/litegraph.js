import { Button } from '@/shared/components/button/Button';
import { Input } from '@/shared/components/input/Input';

export const NewWorkflowPage = () => (
  <div className="flex w-full items-center justify-center">
    <div className="flex w-[30%] max-w-[340px] flex-col items-center justify-center">
      <h1 className="text-xl font-medium">New Workflow</h1>
      <p className="pt-3 text-sm font-light">Enter a name for your workflow</p>
      <Input variant="secondary" placeholder="Write a name" className="my-6 w-full" />
      <div className="flex w-full flex-row">
        <Button variant="glass" className="mr-4 flex-1">
          Cancel
        </Button>
        <Button variant="filled" className="flex-1">
          Next
        </Button>
      </div>
    </div>
  </div>
);
