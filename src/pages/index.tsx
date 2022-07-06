import { GetStaticProps } from 'next';
import Head from 'next/head';
import { PostTile } from '../components/PostTile';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  // const { results, next_page } = postsPagination;

  return (
    <>
      <Head>
        <title>Home | Blog</title>
      </Head>

      <main className={commonStyles.widthContainer}>
        <PostTile />
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});
  const postsResponse = await prismic.getByType('posts');

  const results = '';

  return {
    props: { results },
  };
};
