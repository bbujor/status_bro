import { createGetInitialProps } from '@mantine/next'
import Document, { Head, Html, Main, NextScript } from 'next/document'

const getInitialProps = createGetInitialProps()

const metatTitle = 'StatusBro'
const metaDesc = 'View live status for bookings'
const metaImg = ''
const metaURL = ''

export default class _Document extends Document {
    static getInitialProps = getInitialProps
    render() {
        return (
            <Html>
                <Head>
                    <meta charSet='UTF-8' />
                    <meta name='Description' content={metaDesc} />
                    <meta property='og:description' content={metaDesc} />
                    <meta name='twitter:description' content={metaDesc} />
                    <meta name='robots' content='nofollow' />
                    <meta name='google' content='nositelinkssearchbox' />
                    <meta property='og:title' content={metatTitle} />
                    <meta name='twitter:title' content={metatTitle} />
                    <meta property='og:image' content={metaImg} />
                    <meta name='twitter:image' content={metaImg} />
                    <link rel='canonical' href={metaURL} />
                    <meta property='og:url' content={metaURL} />
                    <meta name='twitter:url' content={metaURL} />
                    <meta
                        httpEquiv='X-UA-Compatible'
                        content='IE=edge,chrome=1'
                    />
                    <meta
                        name='theme-color'
                        content='#1A1B1E'
                        media='(prefers-color-scheme: light)'
                    />

                    <meta
                        name='theme-color'
                        content='#1A1B1E'
                        media='(prefers-color-scheme: dark)'
                    />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}
