import { useRoutes } from 'hookrouter';
import Routes from './router';
import './assets/css/style.css';

export default function App() {
  const routeResult = useRoutes(Routes);
  return routeResult;
}
