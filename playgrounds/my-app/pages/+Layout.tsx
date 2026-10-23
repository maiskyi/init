import logoUrl from '../assets/logo.svg';
import { Link } from '../components/Link';

import './Layout.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        margin: 'auto',
        maxWidth: 900,
      }}
    >
      <Sidebar>
        <Logo />
        <Link href="/">Welcome</Link>
        <Link href="/todo">Todo</Link>
        <Link href="/star-wars">Data Fetching</Link>
      </Sidebar>
      <Content>{children}</Content>
    </div>
  );
}

function Sidebar({ children }: { children: React.ReactNode }) {
  return (
    <div
      id="sidebar"
      style={{
        borderRight: '2px solid #eee',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        lineHeight: '1.8em',
        padding: 20,
      }}
    >
      {children}
    </div>
  );
}

function Content({ children }: { children: React.ReactNode }) {
  return (
    <div id="page-container">
      <div
        id="page-content"
        style={{
          minHeight: '100vh',
          padding: 20,
          paddingBottom: 50,
        }}
      >
        {children}
      </div>
    </div>
  );
}

function Logo() {
  return (
    <div
      style={{
        marginBottom: 10,
        marginTop: 20,
      }}
    >
      <a href="/">
        <img alt="logo" height={64} src={logoUrl} width={64} />
      </a>
    </div>
  );
}
