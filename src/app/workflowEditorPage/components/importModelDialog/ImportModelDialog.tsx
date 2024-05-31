import { Dialog } from '@/shared/components/dialog/Dialog';
import { useEffect, useState } from 'react';
import toast, { LoaderIcon } from 'react-hot-toast';
import { ImportUrlContent } from './ImportUrlContent';
import { SelectModelContent } from './SelectModelContent';

export type Model = 'HuggingFace' | 'Civitai';

type STEPS = 'SELECT_MODEL' | 'IMPORT_URL';

type ImportModelDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const ImportModelDialog = ({ isOpen, onClose }: ImportModelDialogProps) => {
  const [step, setStep] = useState<STEPS>('SELECT_MODEL');
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);

  useEffect(() => {
    setStep('SELECT_MODEL');
  }, [isOpen]);

  const handleSelectModel = (model: Model) => {
    setSelectedModel(model);
    setStep('IMPORT_URL');
  };

  const handleSuccessModelImport = () => {
    toast.success('Model import in progress', { icon: <LoaderIcon />, position: 'bottom-center' });
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => open === false && onClose()}>
      <Dialog.Content className="w-[38%]">
        {step === 'SELECT_MODEL' && <SelectModelContent onSelectModel={handleSelectModel} />}
        {step === 'IMPORT_URL' && (
          <ImportUrlContent
            selectedModel={selectedModel!}
            onBackClick={() => setStep('SELECT_MODEL')}
            onSuccessfulModelImport={handleSuccessModelImport}
          />
        )}
      </Dialog.Content>
    </Dialog.Root>
  );
};
