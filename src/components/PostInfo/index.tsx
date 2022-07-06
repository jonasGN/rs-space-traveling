import { createElement } from 'react';

import styles from './post.info.module.scss';

type InfoElement = 'span' | 'time';

interface PostInfoProps {
  info: string;
  icon: React.ReactElement;
  element?: InfoElement;
}

export function PostInfo(props: PostInfoProps): JSX.Element {
  const { icon, info, element } = props;

  return (
    <div className={styles.container}>
      {icon}
      {createElement(element ?? 'span', null, info)}
    </div>
  );
}

interface PostInfoContainerProps {
  children: React.ReactNode;
}

export function PostInfoContainer({
  children,
}: PostInfoContainerProps): JSX.Element {
  return <div className={styles.infoContainer}>{children}</div>;
}
