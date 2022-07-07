/* eslint-disable react/no-danger */
/* eslint-disable react/jsx-fragments */
import { Fragment } from 'react';
import { asHTML } from '@prismicio/helpers';
import { useRouter } from 'next/router';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';
import { PostInfo, PostInfoContainer } from '../../components/PostInfo';

import { toLocaleDate } from '../../helpers/formatters';
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

  if (router.isFallback) {
    return (
      <div className={`${commonStyles.widthContainer} ${styles.loading}`}>
        <span className={styles.loading}>Carregando...</span>
      </div>
    );
  }

  const articleClasses = `${commonStyles.widthContainer} ${styles.contentContainer}`;
  const { first_publication_date: moment, data } = post;

  const totalWords = data.content.reduce((total, item) => {
    let sum = total;
    const headingSum = item.heading.split(' ').filter(head => head).length;
    item.body.forEach(content => {
      sum += content.text.split(' ').filter(con => con).length;
    });

    sum += headingSum;
    return sum;
  }, 0);

  const readTimeEstimateInMinutes = Math.ceil(totalWords / 200);

  return (
    <>
      <Head>
        <title>{data.title} | Blog</title>
      </Head>

      <main>
        {data.banner.url ? (
          <div className={styles.banner}>
            <img src={data.banner.url} alt={data.title} />
          </div>
        ) : null}

        <article className={articleClasses}>
          <h1>{data.title}</h1>

          <PostInfoContainer>
            <PostInfo
              info={toLocaleDate(moment)}
              element="time"
              icon={<FiCalendar />}
            />
            <PostInfo info={data.author} icon={<FiUser />} />
            <PostInfo
              info={`${readTimeEstimateInMinutes} min`}
              icon={<FiClock />}
            />
          </PostInfoContainer>

          <div className={styles.content}>
            {data.content.map(item => (
              <Fragment key={item.heading}>
                {item.heading ? <h2>{item.heading}</h2> : null}
                <section
                  dangerouslySetInnerHTML={{
                    __html: asHTML(item.body),
                  }}
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
  const posts = await prismic.getByType('post', { pageSize: 2 });

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
