import { Button } from '@/shared/components/button/Button';

export const Storybook = () => (
  <div className="flex flex-row items-start *:mr-4">
    <Button size="xl" color="primary">
      Primary
    </Button>
    <Button size="xl" color="primary">
      Primary
    </Button>
    <Button size="xl" color="primary">
      Primary
    </Button>
    <Button size="xl" disabled color="primary">
      Primary
    </Button>
  </div>
);
