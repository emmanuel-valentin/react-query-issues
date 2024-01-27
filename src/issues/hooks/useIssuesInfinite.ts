import { useInfiniteQuery } from '@tanstack/react-query';
import { Issue, State } from '../interfaces';
import { githubApi } from '../../api/githubApi';
import { sleep } from '../../helpers';

interface Props {
  state?: State;
  labels: string[];
  page?: number;
}

interface QueryProps {
  pageParam: number;
  queryKey: (string | Props)[];
}

const RESULTS_PER_PAGE = 5;

const getIssues = async ({ pageParam, queryKey }: QueryProps): Promise<Issue[]> => {
  const [, , args] = queryKey;
  const { state, labels } = args as Props;

  // await sleep(2);
  const params = new URLSearchParams();

  if (labels.length > 0) {
    const labelsString = labels.join(',');
    params.append('labels', labelsString);
  }

  if (state) params.append('state', state);

  params.append('page', pageParam.toString());
  params.append('per_page', RESULTS_PER_PAGE.toString());

  const { data } = await githubApi.get<Issue[]>('/issues', { params });
  return data;
};

export const useIssuesInfinite = ({ state, labels }: Props) => {
  const issueQuery = useInfiniteQuery({
    queryKey: ['issues', 'infinite', { state, labels }],
    queryFn: getIssues,
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length <= RESULTS_PER_PAGE) return;
      return pages.length + 1;
    },
  });

  return {
    issueQuery,
  };
};