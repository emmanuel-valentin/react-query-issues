import { useQuery } from '@tanstack/react-query';
import { githubApi } from '../../api/githubApi';
import { Label } from '../interfaces/label';
import { sleep } from '../../helpers/sleep';

const getLabels = async (): Promise<Label[]> => {
  await sleep(2);
  const { data } = await githubApi.get<Label[]>('/labels?per_page=100');
  return data;
};

export const useLabels = () => {
  const labelsQuery = useQuery({
    queryKey: ['labels'],
    queryFn: getLabels,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60, // 1 hour
    placeholderData: [
    // initialData: [ -> Si el staleTime aún no se cumple, no hará fetching de la data y considerá la initialData como fresh
      {
        id: 717031390,
        node_id: "MDU6TGFiZWw3MTcwMzEzOTA=",
        url: "https://api.github.com/repos/facebook/react/labels/good%20first%20issue",
        name: "good first issue",
        color: "6ce26a",
        default: true,
      },
      {
        id: 69105358,
        node_id: "MDU6TGFiZWw2OTEwNTM1OA==",
        url: "https://api.github.com/repos/facebook/react/labels/Browser:%20Safari",
        name: "Browser: Safari",
        color: "c7def8",
        default: false,
      }
    ]

  });

  return labelsQuery;
};