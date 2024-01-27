import { Link, Navigate, useParams } from 'react-router-dom';
import { IssueComment } from '../components/IssueComment';
import { useIssue } from '../hooks';
import LoadingIcon from '../../shared/components/LoadingIcon';

export const IssueView = () => {
  const params = useParams();
  const { id = '0' } = params;

  const { issueQuery, commentsQuery } = useIssue(Number(id));

  if (issueQuery.isLoading) {
    return <LoadingIcon />;
  }

  if (!issueQuery.data) {
    return <Navigate to="./issues/list" />;
  }

  return (
    <div className="row mb-5">
      <div className="col-12 mb-3">
        <Link to="./issues/list/infinite">Go Back</Link>
      </div>

      {/* Primer comentario */}
      <IssueComment issue={issueQuery.data} />

      {/* Comentario de otros */}
      {commentsQuery.isLoading && (
        <div className="mt-4">
          <LoadingIcon />
        </div>
      )}
      
      {commentsQuery.data?.map((issue) => (
        <IssueComment key={issue.id} issue={issue} />
      ))}
    </div>
  );
};
