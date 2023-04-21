import { useRoutes } from 'hookrouter';
import Routes from './router';

export default function App() {
  const routeResult = useRoutes(Routes);
  return routeResult;
}
