import Link, { LinkProps } from 'next/link';
import { FiCalendar, FiUser } from 'react-icons/fi';
import { PostInfo, PostInfoContainer } from '../PostInfo';

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
  const { data, first_publication_date: moment } = post;

  return (
    <Link {...props}>
      <a className={styles.container}>
        <strong>{data.title}</strong>
        <p>{data.subtitle}</p>

        <PostInfoContainer>
          <PostInfo info={moment} element="time" icon={<FiCalendar />} />
          <PostInfo info={data.author} icon={<FiUser />} />
        </PostInfoContainer>
      </a>
    </Link>
  );
}
