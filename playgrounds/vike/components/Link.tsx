import { usePageContext } from 'vike-react/usePageContext';

export function Link({ href, children }: { href: string; children: string }) {
  const pageContext = usePageContext();
  const { urlPathname } = pageContext;
  const isActive =
    href === '/' ? urlPathname === href : urlPathname.startsWith(href);
  return (
    <a className={isActive ? 'is-active' : undefined} href={href}>
      {children}
    </a>
  );
}
