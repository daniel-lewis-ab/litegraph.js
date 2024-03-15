import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Button } from '@/shared/components/button/Button';
import { Input } from '@/shared/components/input/Input';
import { Workflow } from '@/api/types';
import { useNavigate } from 'react-router-dom';
import { routes } from '@/routes/routes';

export type NewWorkflowFormData = {
  name: string;
};

type NewWorkflowPageProps = {
  onSubmit(data: NewWorkflowFormData): Promise<Workflow>;
};

export const NewWorkflowPage = ({ onSubmit }: NewWorkflowPageProps) => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { isValid, isSubmitting },
  } = useForm<NewWorkflowFormData>();

  const handleFormSubmit = async (data: NewWorkflowFormData) => {
    try {
      await onSubmit(data);
      navigate(routes.workflows);
      toast.success('Workflow successfully created');
    } catch (e) {
      console.error(e);
      toast.error('Failed to create workflow');
    }
  };

  return (
    <div className="flex w-full items-center justify-center p-6">
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="flex w-full max-w-[340px] flex-col  items-center justify-center lg:w-[30%]"
      >
        <h1 className="text-xl font-medium">New Workflow</h1>
        <p className="pt-3 text-sm font-light">Enter a name for your workflow</p>
        <Input
          variant="secondary"
          placeholder="Write a name"
          className="my-6 w-full"
          {...register('name', { required: true })}
        />
        <div className="flex w-full flex-row">
          <Button disabled={isSubmitting} variant="glass" className="mr-4 flex-1" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button disabled={!isValid} isLoading={isSubmitting} variant="filled" className="flex-1" type="submit">
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};
