import { useState } from 'react';
import { IssueList } from '../components/IssueList';
import { LabelPicker } from '../components/LabelPicker';
import { useIssuesInfinite } from '../hooks';
import LoadingIcon from '../../shared/components/LoadingIcon';
import { State } from '../interfaces';

export const ListViewInfinite = () => {
  const [labels, setLabels] = useState<string[]>([]);
  const [state, setState] = useState<State>();
  const { issueQuery } = useIssuesInfinite({ state, labels });

  const onLabelChange = (labelName: string) => {
    labels.includes(labelName)
      ? setLabels(labels.filter((label) => label !== labelName))
      : setLabels([...labels, labelName]);
  };

  return (
    <div className="row mt-5">
      <div className="col-8">
        {issueQuery.isLoading ? (
          <LoadingIcon />
        ) : (
          <IssueList
            issues={issueQuery.data?.pages.flat() || []}
            state={state}
            onStateChange={(newState?: State) => setState(newState)}
          />
        )}

        {issueQuery.isFetchingNextPage && (
          <div className='my-4 d-flex justify-content-center align-items-center'>
            <LoadingIcon />
          </div>
        )}

        <button
          className="btn btn-outline-primary my-4"
          onClick={() => issueQuery.fetchNextPage()}
          disabled={!issueQuery.hasNextPage || issueQuery.isFetchingNextPage}
        >
          Load more...
        </button>
      </div>

      <div className="col-4">
        <LabelPicker
          selectedLabels={labels}
          onChange={(labelName) => onLabelChange(labelName)}
        />
      </div>
    </div>
  );
};
