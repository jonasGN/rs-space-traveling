import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';
import { PostInfo, PostInfoContainer } from '../../components/PostInfo';

import { toLocaleDate } from '../../helpers/formatters';
import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

type PostContent = {
  heading: string;
  body: {
    text: string;
  }[];
};

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: PostContent[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps): JSX.Element {
  const { first_publication_date: moment, data } = post;

  const articleClasses = `${commonStyles.widthContainer} ${styles.contentContainer}`;
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
            <PostInfo info={moment} element="time" icon={<FiCalendar />} />
            <PostInfo info={data.author} icon={<FiUser />} />
            <PostInfo info="4min" icon={<FiClock />} />
          </PostInfoContainer>
        </article>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient({});
  // const posts = await prismic.getByType(TODO);

  return { paths: [], fallback: 'blocking' };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const prismic = getPrismicClient({});
  const response = await prismic.getByUID('post', String(params.slug));

  const content = response.data.content as PostContent[];
  const postContent = content.map(post => ({
    heading: post.heading,
    body: post.body.map(item => ({
      text: item.text,
    })),
  }));

  const post: Post = {
    first_publication_date: toLocaleDate(response.first_publication_date),
    data: {
      title: response.data.title,
      author: response.data.author,
      banner: { url: response.data.banner.url ?? '' },
      content: postContent,
    },
  };

  return {
    props: { post },
  };
};
