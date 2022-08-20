import { Outlet, LiveReload, Link, Links, Meta, useLoaderData } from '@remix-run/react'
import globalStyles from '~/styles/global.css'
import { getUser } from './utils/session.server'

export const links = () => [{ rel: 'stylesheet', href: globalStyles }]

export const meta = () => {
  const desctription = 'a cool remix blog'
  const keyWords = 'remix,react,nestjs, javascript'
  return {
    desctription,
    keyWords
  }
}

export const loader = async ({ request }) => {
  const user = await getUser(request)
  const data = {
    user
  }
  return data
}

export default function App() {
  return (
    <Document>
      <Layout>
        <Outlet />
      </Layout>
    </Document>
  )
}
function Document({ children, title }) {

  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewpoint' content='width=device-width,
        initial-scale=1' />
        <Links />
        <Meta />
        <title>{title ? title : 'Blog-Tottie'}</title>
      </head>
      <body>
        {children}
        {process.env.NODE_ENV === 'development' ? <LiveReload /> : null}
      </body>
    </html >
  )
}
function Layout({ children }) {
  const { user } = useLoaderData()
  return (
    <>
      <nav className="navbar">
        <Link to='/' className='logo'>
          BlogTottie
        </Link>
        <ul className="nav">
          <li>
            <Link to='/posts'>Posts</Link>
          </li>
          {user ? (
            <li>
              <form action="/auth/logout" method='POST'>
                <button className='btn' type='submit'>
                  Logout {user.username}
                </button>
              </form>
            </li>
          ) :
            (<li>
              <Link to='/auth/login'>Login</Link>
            </li>)}
        </ul>
      </nav >
      <div className="container">
        {children}
      </div>

    </>)
}
export function ErrorBoundary({ error }) {
  console.log(error)
  return (
    <Document>
      <Layout>
        <h1>Error</h1>
        <p>{error.message}</p>
      </Layout>
    </Document>
  )
}