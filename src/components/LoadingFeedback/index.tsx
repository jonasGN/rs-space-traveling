import commonStyles from '../../styles/common.module.scss';
import styles from './loadingfeedback.module.scss';

export function LoadingFeedback(): JSX.Element {
  return (
    <div className={`${commonStyles.widthContainer} ${styles.loading}`}>
      <span>Carregando...</span>
    </div>
  );
}
