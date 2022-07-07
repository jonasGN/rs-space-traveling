/* eslint-disable react/no-danger */
/* eslint-disable react/jsx-fragments */
import { Fragment } from 'react';
import { asHTML, asText } from '@prismicio/helpers';
import { useRouter } from 'next/router';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';
import { PostInfo, PostInfoContainer } from '../../components/PostInfo';
import { LoadingFeedback } from '../../components/LoadingFeedback';
import { Banner } from '../../components/Banner';

import { toEstimateReadingTime, toLocaleDate } from '../../helpers/formatters';
import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps): JSX.Element {
  const router = useRouter();
  if (router.isFallback) return <LoadingFeedback />;

  const { first_publication_date, data } = post;

  const totalWords = data.content.reduce((total, item) => {
    let sum = total;
    const headingSum = item.heading.split(' ').length;
    const bodySum = asText(item.body as []).split(' ').length;

    sum += headingSum + bodySum;
    return sum;
  }, 0);

  const publicatedAt = toLocaleDate(first_publication_date);
  const readingTime = toEstimateReadingTime(totalWords);

  const articleClasses = `${commonStyles.widthContainer} ${styles.contentContainer}`;
  return (
    <>
      <Head>
        <title>{data.title} | Blog</title>
      </Head>

      <main>
        <Banner url={data.banner.url} alt={data.title} />
        <article className={articleClasses}>
          <h1>{data.title}</h1>

          <PostInfoContainer>
            <PostInfo
              info={publicatedAt}
              element="time"
              icon={<FiCalendar />}
            />
            <PostInfo info={data.author} icon={<FiUser />} />
            <PostInfo info={readingTime} icon={<FiClock />} />
          </PostInfoContainer>

          <div className={styles.content}>
            {data.content.map(item => (
              <Fragment key={item.heading}>
                {item.heading ? <h2>{item.heading}</h2> : null}
                <section
                  dangerouslySetInnerHTML={{ __html: asHTML(item.body as []) }}
                />
              </Fragment>
            ))}
          </div>
        </article>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient({});
  const posts = await prismic.getByType('post', { pageSize: 4 });

  const paths = posts.results.map(post => ({
    params: { slug: post.uid },
  }));

  return { paths, fallback: true };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const prismic = getPrismicClient({});
  const response = await prismic.getByUID('post', String(params.slug));

  const { first_publication_date, data, uid } = response;

  const post = {
    uid,
    first_publication_date,
    data: {
      title: data.title,
      subtitle: data.subtitle,
      banner: { url: data.banner.url },
      author: data.author,
      content: data.content.map(con => ({
        heading: con.heading ?? '',
        body: [...con.body],
      })),
    },
  };

  return {
    props: { post },
    revalidate: 60 * 60, // 1 minute
  };
};
