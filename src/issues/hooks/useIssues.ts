import { useQuery } from '@tanstack/react-query';
import { githubApi } from '../../api/githubApi';
import { Issue, State } from '../interfaces';
import { sleep } from '../../helpers/sleep';
import { useEffect, useState } from 'react';

interface Props {
  state?: State;
  labels: string[];
  page?: number;
}

const getIssues = async ({ labels, state, page = 1 }: Props): Promise<Issue[]> => {
  // await sleep(2);
  const params = new URLSearchParams();

  if (labels.length > 0) {
    const labelsString = labels.join(',');
    params.append('labels', labelsString);
  }

  if (state) params.append('state', state);

  params.append('page', page.toString());
  params.append('per_page', '5');

  const { data } = await githubApi.get<Issue[]>('/issues', { params });
  return data;
};

export const useIssues = ({ state, labels }: Props) => {
  const [page, setPage] = useState(1);

  const issueQuery = useQuery({
    queryKey: ['issues', { state, labels, page }],
    queryFn: () => getIssues({ labels, state, page }),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    setPage(1);
  }, [state, labels]);

  const nextPage = () => {
    if (issueQuery.data?.length === 0) return;
    setPage(page + 1);
  };

  const prevPage = () => {
    if (page <= 1) return;
    setPage(page - 1);
  };

  return {
    // methods
    issueQuery,
    nextPage,
    prevPage,

    // properties
    page: issueQuery.isFetching ? 'Loading...' : page,
  };
};
