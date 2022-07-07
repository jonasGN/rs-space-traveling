import Head from 'next/head';
import { GetStaticProps } from 'next';
import { useState } from 'react';
import { PostTile } from '../components/PostTile';

import { toLocaleDate } from '../helpers/formatters';
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
  const [posts, setPosts] = useState<PostPagination>(postsPagination);

  async function handleLoadMorePosts(): Promise<void> {
    const response = await fetch(postsPagination.next_page);
    const data = (await response.json()) as PostPagination;

    const newPosts = data.results.map<Post>(post => ({
      uid: post.uid,
      first_publication_date: toLocaleDate(post.first_publication_date),
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    }));

    setPosts({
      next_page: data.next_page,
      results: [...posts.results, ...newPosts],
    });
  }

  return (
    <>
      <Head>
        <title>Home | Blog</title>
      </Head>

      <main className={`${commonStyles.widthContainer} ${styles.container}`}>
        {posts.results.map(post => (
          <PostTile key={post.uid} href={`/post/${post.uid}`} post={post} />
        ))}
        {posts.next_page ? (
          <button type="button" onClick={handleLoadMorePosts}>
            Carregar mais posts
          </button>
        ) : null}
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});
  const postsResponse = await prismic.getByType('post', { pageSize: 5 });

  const posts = postsResponse.results.map<Post>(post => ({
    uid: post.uid,
    first_publication_date: post.first_publication_date,
    data: {
      title: post.data.title,
      subtitle: post.data.subtitle,
      author: post.data.author,
    },
  }));

  return {
    props: {
      postsPagination: {
        results: posts,
        next_page: postsResponse.next_page,
      },
    },
  };
};
