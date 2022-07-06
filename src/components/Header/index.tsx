import styles from './header.module.scss';
import commonStyles from '../../styles/common.module.scss';

export default function Header(): JSX.Element {
  return (
    <header className={styles.container}>
      <div className={commonStyles.widthContainer}>
        <img src="/images/logo.svg" alt="logo" />
      </div>
    </header>
  );
}
