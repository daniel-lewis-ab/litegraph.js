import { Button } from '@/shared/components/button/Button';
import { Dialog } from '@/shared/components/dialog/Dialog';
import { LoaderIcon } from '@/shared/components/loaderIcon/LoaderIcon';
import { WarningDialogContent } from '@/shared/components/warningDialog/WarningDialog';
import { useState } from 'react';

type DeleteAssetConfirmationDialogProps = {
  isOpen: boolean;
  onConfirm: () => Promise<boolean>;
  onClose: () => void;
};

export const DeleteAssetConfirmationDialog = ({ isOpen, onConfirm, onClose }: DeleteAssetConfirmationDialogProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => open === false && onClose()}>
      <Dialog.Content className="w-[38%]">
        <WarningDialogContent
          title="Confirm deletion"
          desc="Are you sure you want to delete this output? This action is irreversible."
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
                onClose();
              } catch (e) {
                setIsDeleting(false);
              }
            }}
            disabled={isDeleting}
          >
            {isDeleting ? <LoaderIcon size={16} /> : 'Delete'}
          </Button>
          <Button disabled={isDeleting} onClick={onClose} color="secondary" variant="ringed">
            Cancel
          </Button>
        </WarningDialogContent>
      </Dialog.Content>
    </Dialog.Root>
  );
};
