import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';

export default function Layout({ children, title, description }) {
  const defaultTitle = 'Atelier Lunaire | Bijoux artisanaux inspirés par la Lune';
  const defaultDescription = 'Créations artisanales uniques inspirées par les phases de la Lune. Bijoux et accessoires faits main en France.';

  return (
    <>
      <Head>
        <title>{title || defaultTitle}</title>
        <meta name="description" content={description || defaultDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow pt-16">{children}</main>
        <Footer />
      </div>
    </>
  );
}