import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const DashboardPage = () => (
  <div>
    <h1 className="text-3xl font-bold italic underline ml-4 text-error">Dashboard</h1>
    <FontAwesomeIcon icon={faCoffee} />
  </div>
);
