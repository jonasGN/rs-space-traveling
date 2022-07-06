import { FiCalendar, FiUser } from 'react-icons/fi';

import styles from './post.tile.module.scss';

export function PostTile(): JSX.Element {
  const iconSize = 20;

  return (
    <a href="/" className={styles.container}>
      <strong>Como utilizar Hooks</strong>
      <p>Pensando em sincronização em vez de ciclos de vida.</p>

      <div className={styles.infoContainer}>
        <div>
          <FiCalendar size={iconSize} />
          <time>15 Mar 2021</time>
        </div>
        <div>
          <FiUser size={iconSize} />
          <span>Joseph Oliveira</span>
        </div>
      </div>
    </a>
  );
}
