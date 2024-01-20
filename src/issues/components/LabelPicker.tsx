import LoadingIcon from '../../shared/components/LoadingIcon';
import { useLabels } from '../hooks/useLabels';

interface Props {
  selectedLabels: string[];
  onChange: (labelName: string) => void;
}

export const LabelPicker: React.FC<Props> = ({ selectedLabels, onChange }) => {
  const labelsQuery = useLabels();

  if (labelsQuery.isLoading) {
    //! por qué isLoading??? y no isFetching
    /**
     * isLoading:  - cuando carga la data por primera vez (ni en caché).
     *             - si hay data en el caché carga esa data.
     * isFetching: - se dispara siempre que se realiza una petición.
     */
    return <LoadingIcon />;
  }

  return (
    <div>
      {labelsQuery.data?.map(({ id, name, color }) => (
        <span
          key={id}
          className={`badge rounded-pill m-1 label-picker ${
            selectedLabels.includes(name) ? 'label-active' : ''
          }`}
          style={{ border: `1px solid #${color}`, color: `#${color}` }}
          onClick={() => onChange(name)}
        >
          {name}
        </span>
      ))}
    </div>
  );
};
