import { Button } from '@/shared/components/button/Button';
import { Dialog } from '@/shared/components/dialog/Dialog';
import { WarningDialogContent } from '@/shared/components/warningDialog/WarningDialog';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

type DeleteDeploymentConfirmationDialogProps = {
  isOpen: boolean;
  onConfirm: () => Promise<boolean>;
  onClose: () => void;
};

export const DeleteDeploymentConfirmationDialog = ({
  isOpen,
  onConfirm,
  onClose,
}: DeleteDeploymentConfirmationDialogProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => open === false && onClose()}>
      <Dialog.Content className="w-[38%]">
        <WarningDialogContent
          title="Confirm deletion"
          desc="Are you sure you want to delete the deployed workflow? This action is irreversible."
        >
          <Button
            color="error"
            variant="filled"
            className="mb-3"
            onClick={async () => {
              setIsDeleting(true);
              try {
                await onConfirm();
                setIsDeleting(false);
                toast.success('Deployment successfully deleted');
                onClose();
              } catch (e) {
                setIsDeleting(false);
                toast.error('Failed to delete workflow');
              }
            }}
            isLoading={isDeleting}
          >
            Delete
          </Button>
          <Button disabled={isDeleting} onClick={onClose} color="secondary" variant="filled">
            Cancel
          </Button>
        </WarningDialogContent>
      </Dialog.Content>
    </Dialog.Root>
  );
};
