/**
 * Search
 */
import { useSearch } from 'utils/hooks/useSearch';
import { useParams } from 'react-router-dom';

interface RouteParams {
  text: string;
}

export function Search() {
  const { text } = useParams<RouteParams>();
  const [, setSearch] = useSearch();
  setSearch(text);

  return null;
}
