import styles from './banner.module.scss';

interface BannerProps {
  url: string;
  alt: string;
}

export function Banner({ url, alt }: BannerProps): JSX.Element {
  if (!url) return null;
  return (
    <div className={styles.container}>
      <img src={url} alt={alt} />
    </div>
  );
}
