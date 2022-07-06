import Link, { LinkProps } from 'next/link';
import { FiCalendar, FiUser } from 'react-icons/fi';

import styles from './post.tile.module.scss';

type Post = {
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
};

interface PostTileProps extends LinkProps {
  post: Post;
}

export function PostTile({ post, ...props }: PostTileProps): JSX.Element {
  const { data, first_publication_date } = post;
  const iconSize = 20;

  return (
    <Link {...props}>
      <a className={styles.container}>
        <strong>{data.title}</strong>
        <p>{data.subtitle}</p>

        <div className={styles.infoContainer}>
          <div>
            <FiCalendar size={iconSize} />
            <time>{first_publication_date}</time>
          </div>
          <div>
            <FiUser size={iconSize} />
            <span>{data.author}</span>
          </div>
        </div>
      </a>
    </Link>
  );
}
