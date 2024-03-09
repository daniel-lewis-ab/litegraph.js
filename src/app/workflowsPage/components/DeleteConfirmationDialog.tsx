import { Button } from '@/shared/components/button/Button';
import { Dialog } from '@/shared/components/dialog/Dialog';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

type DeleteConfirmationDialogProps = {
  isOpen: boolean;
  onConfirm: () => Promise<void>;
  onClose: () => void;
};

export const DeleteConfirmationDialog = ({ isOpen, onConfirm, onClose }: DeleteConfirmationDialogProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => open === false && onClose()}>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Delete Workflow</Dialog.Title>
        </Dialog.Header>
        <p className="mb-6 text-sm">Are you sure you want to delete this workflow?</p>
        <Button
          color="error"
          className="mb-3"
          onClick={async () => {
            setIsDeleting(true);
            try {
              await onConfirm();
              setIsDeleting(false);
              toast.success('Workflow successfully deleted');
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
        <Button disabled={isDeleting} onClick={onClose} color="secondary" variant="glass">
          Cancel
        </Button>
      </Dialog.Content>
    </Dialog.Root>
  );
};