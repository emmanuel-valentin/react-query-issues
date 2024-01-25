import { FiInfo, FiMessageSquare, FiCheckCircle } from 'react-icons/fi';
import { useQueryClient } from '@tanstack/react-query';
import { Issue, State } from '../interfaces';
import { useNavigate } from 'react-router-dom';
import { getIssueComments, getIssueInfo } from '../hooks/useIssue';
import { timeSince } from '../../helpers';

interface Props {
  issue: Issue;
}

export const IssueItem: React.FC<Props> = ({ issue }) => {
  const { title, state, user, number, comments, created_at } = issue;
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  // Hace las peticiones http cuando pasa el mouse por el issue, sin embargo, puede disparar
  // muchas peticiones, por lo que dependiendo del contexto de la aplicación, se puede
  // configurar el staleTime

  // const prefetchData = () => {
  //   queryClient.prefetchQuery({
  //     queryKey: ['issue', issue.number],
  //     queryFn: () => getIssueInfo(issue.number),
  //     staleTime: 1000 * 60 * 10,
  //   });

  //   // TODO: Cargar los comentarios,
  //   queryClient.prefetchQuery({
  //     queryKey: ['issue', issue.number, 'comments'],
  //     queryFn: () => getIssueComments(issue.number),
  //     staleTime: 1000 * 60 * 10,
  //   });
  // };

  // Setea la data al issue antes de entrar a él, pero no dispara una petición http. Esto es posible porque al cargar las issues,
  // la api responde la información suficiente como para verla detalladamente. Sin embargo, la data sí se establece en caché.
  const preSetData = () => {
    queryClient.setQueryData(
      ['issue', issue.number],
      issue,
      // La data se mantiene fresh hasta la hora actual más un minuto
      { updatedAt: new Date().getTime() + 100000 }
    );
  };

  return (
    <div
      className="card mb-2 issue"
      onClick={() => navigate(`/issues/issue/${number}`)}
      // onMouseEnter={prefetchData}
      onMouseEnter={preSetData}
    >
      <div className="card-body d-flex align-items-center">
        <div className="img-fluid">
          {state === State.Open ? (
            <FiInfo size={30} color="red" />
          ) : (
            <FiCheckCircle size={30} color="green" />
          )}
        </div>
        <div className="d-flex flex-column flex-fill px-2">
          <span>{title}</span>
          <span className="issue-subinfo">
            #{number} opened {timeSince(created_at)} ago by{' '}
            <span className="fw-bold">{user.login}</span>
          </span>
          <span>
            {issue.labels.map((label) => (
              <span
                key={label.id}
                className="badge rounded-pill m-1"
                style={{ backgroundColor: `#${label.color}`, color: 'black' }}
              >
                {label.name}
              </span>
            ))}
          </span>
        </div>

        <div className="d-flex align-items-center">
          <img src={user.avatar_url} alt="User Avatar" className="avatar" />
          <span className="px-2">{comments}</span>
          <FiMessageSquare />
        </div>
      </div>
    </div>
  );
};
