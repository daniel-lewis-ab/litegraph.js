import { Dialog } from '@/shared/components/dialog/Dialog';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Icon } from '@/shared/components/icon/Icon';
import { faChevronLeft, faLandmarkFlag } from '@awesome.me/kit-b6cda292ae/icons/sharp/light';
import { faSquareCheck } from '@awesome.me/kit-b6cda292ae/icons/classic/solid';
import { constants } from '@/contants';
import { Input } from '@/shared/components/input/Input';
import { FormField } from '@/shared/components/formField/FormField';
import { Button } from '@/shared/components/button/Button';
import { useForm } from 'react-hook-form';
import { useFetchModelMetadata } from '@/api/hooks/useFetchModelMetadata/useFetchModelMetadata';
import validUrl from 'valid-url';
import { LoadingModelCreateError, MetadataResponse, MetadataResponseError } from '@/api/types';
import { useCreateModelMutation } from '@/api/hooks/useCreateModelMutation/useCreateModelMutation';
import { LoaderIcon } from 'react-hot-toast';
import { Model } from './ImportModelDialog';
import { AxiosError } from 'axios';

type State = {
  isLoading: boolean;
  data: MetadataResponse | null;
  isError: boolean;
};

type FormData = {
  modelUrl: string;
};

const CIVITAI_EXAMPLE_URL = 'https://civitai.com/api/download/models/533362';
const HUGGING_FACE_EXAMPLE_URL =
  'https://huggingface.co/microsoft/Phi-3-vision-128k-instruct/resolve/main/model-00001-of-00002.safetensors?download=true';

const metadataErrorMessages: { [key in MetadataResponseError['error_code']]: string } = {
  INVALID_DOMAIN: 'Invalid domain',
  INVALID_URL: 'Invalid URL',
  INCOMPATIBLE_FILE_TYPE: 'Incompatible file type',
  MODEL_PRIVATE: 'Model is private',
};

const modelCreateErrorMessages: { [key in LoadingModelCreateError['error_code']]: string } = {
  RESTRICTED_LICENSE: 'This model has a restricted license',
  INVALID_DOMAIN: 'Invalid domain',
  INVALID_URL: 'Invalid URL',
  INCOMPATIBLE_FILE_TYPE: 'Incompatible file type',
  MODEL_PRIVATE: 'Model is private',
  MODEL_ALREADY_EXISTS: 'Model already exists',
  MODEL_ALREADY_EXISTS_WITH_INACTIVE: 'Model already exists but is inactive',
};

const DEBOUNCE_TIME = 500;

export const ImportUrlContent = ({
  selectedModel,
  onBackClick,
  onSuccessfulModelImport,
}: {
  selectedModel: Model;
  onBackClick(): void;
  onSuccessfulModelImport(): void;
}) => {
  const modelName = selectedModel === 'HuggingFace' ? 'Hugging Face' : 'Civitai';
  const { fetchModelMetadata: fetchUrlMetadata } = useFetchModelMetadata();
  const { mutateAsync: createModelMutation } = useCreateModelMutation();
  const [state, setState] = useState<State>({ isLoading: false, data: null, isError: false });
  const {
    register,
    watch,
    handleSubmit,
    setError,
    formState: { isValid, isSubmitting, errors },
  } = useForm<FormData>({ mode: 'onChange' });
  const modelUrlValue = watch('modelUrl');
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const fetchMetadata = useCallback(
    async (url: string) => {
      setState({ isLoading: true, data: null, isError: false });
      try {
        const metadata = await fetchUrlMetadata(url);
        setState({ isLoading: false, data: metadata, isError: false });
      } catch (e) {
        const resError = e as AxiosError<MetadataResponseError>;
        setState({ isLoading: false, data: null, isError: true });

        setError('modelUrl', {
          type: 'manual',
          message:
            resError.response?.data?.error_code && metadataErrorMessages[resError.response?.data?.error_code]
              ? metadataErrorMessages[resError.response?.data?.error_code]
              : 'Something went wrong',
        });
      }
    },
    [fetchUrlMetadata, setError],
  );

  useEffect(() => {
    if (modelUrlValue && validUrl.isUri(modelUrlValue)) {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
      debounceTimeout.current = setTimeout(() => {
        fetchMetadata(modelUrlValue);
      }, DEBOUNCE_TIME);
    }
  }, [modelUrlValue, fetchMetadata]);

  const handleFormSubmit = async (data: FormData) => {
    try {
      await createModelMutation(data.modelUrl);

      onSuccessfulModelImport();
    } catch (e) {
      const resError = e as AxiosError<LoadingModelCreateError>;
      const message =
        resError.response?.data?.error_code && modelCreateErrorMessages[resError.response?.data?.error_code]
          ? modelCreateErrorMessages[resError.response?.data?.error_code]
          : 'Something went wrong';
      setError('modelUrl', { type: 'manual', message });
    }
  };

  return (
    <div>
      <Dialog.Header className="!flex-row justify-between">
        <button onClick={onBackClick} className="flex flex-1 items-center">
          <Icon icon={faChevronLeft} />
        </button>
        <Dialog.Title className="flex-4">Import from {modelName}</Dialog.Title>
        <div className="flex-1" />
      </Dialog.Header>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <FormField
          label={`${modelName} model URL`}
          htmlFor="name"
          hint={
            !modelUrlValue
              ? `e.g. ${selectedModel === 'Civitai' ? CIVITAI_EXAMPLE_URL : HUGGING_FACE_EXAMPLE_URL}`
              : undefined
          }
          errorMsg={errors.modelUrl?.message}
        >
          <Input
            variant="secondary"
            id="modelUrl"
            placeholder="Paste URL..."
            maxLength={constants.validation.importModelUrlMaxLength}
            {...register('modelUrl', {
              maxLength: constants.validation.importModelUrlMaxLength,
              validate: {
                validUrl: (value) => (validUrl.isUri(value) ? undefined : 'Invalid URL'),
              },
            })}
          />
        </FormField>
        {(state.isLoading || state.data) && (
          <div className="mt-4 rounded-lg bg-surface-3 p-4">
            {state.isLoading ? (
              <div className="my-1 flex justify-center">
                <LoaderIcon />
              </div>
            ) : (
              <div className="flex w-full flex-row items-center justify-between">
                <div className="flex min-w-0 flex-1 flex-row items-center">
                  <Icon icon={faSquareCheck} className="mr-2 text-success-10" />
                  <p className="mr-4 truncate text-sm font-medium">{state.data?.name ?? 'No Title'}</p>
                </div>
                <div className="flex flex-shrink-0 flex-row items-center">
                  <Icon icon={faLandmarkFlag} className="mr-2 text-text-muted" />
                  <p className="text-sm text-text-muted">{state.data?.license ?? 'No Description'}</p>
                </div>
              </div>
            )}
          </div>
        )}
        <div className="mt-6 flex flex-row justify-between">
          <Button variant="ringed" color="secondary" onClick={onBackClick}>
            Cancel
          </Button>
          <Button
            variant="filled"
            color="primary"
            type="submit"
            disabled={!isValid || isSubmitting || !state.data || state.isLoading}
          >
            Import
          </Button>
        </div>
      </form>
    </div>
  );
};
