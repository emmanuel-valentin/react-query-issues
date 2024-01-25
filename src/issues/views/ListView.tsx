import { useState } from 'react';
import { IssueList } from '../components/IssueList';
import { LabelPicker } from '../components/LabelPicker';
import { Label } from '../interfaces/label';
import { useIssues } from '../hooks';
import LoadingIcon from '../../shared/components/LoadingIcon';
import { State } from '../interfaces';

export const ListView = () => {
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [state, setState] = useState<State>();
  const { issueQuery, page, nextPage, prevPage } = useIssues({
    state,
    labels: selectedLabels,
  });

  const onLabelChange = (labelName: string) => {
    selectedLabels.includes(labelName)
      ? setSelectedLabels(selectedLabels.filter((label) => label !== labelName))
      : setSelectedLabels([...selectedLabels, labelName]);
  };

  return (
    <div className="row mt-5">
      <div className="col-8">
        {issueQuery.isLoading ? (
          <LoadingIcon />
        ) : (
          <IssueList
            issues={issueQuery?.data || []}
            state={state}
            onStateChange={(newState?: State) => setState(newState)}
          />
        )}

        <div className="d-flex mt-2 justify-content-between align-items-center">
          <button
            className="btn btn-outline-primary"
            onClick={prevPage}
            disabled={issueQuery.isFetching}
          >
            Prev
          </button>
          <span>{page}</span>
          <button
            className="btn btn-outline-primary"
            onClick={nextPage}
            disabled={issueQuery.isFetching}
          >
            Next
          </button>
        </div>
      </div>

      <div className="col-4">
        <LabelPicker
          selectedLabels={selectedLabels}
          onChange={(labelName) => onLabelChange(labelName)}
        />
      </div>
    </div>
  );
};
