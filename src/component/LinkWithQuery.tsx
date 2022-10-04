import { Link, LinkProps, useLocation } from 'react-router-dom';

export const LinkWithQuery = ({ children, to, ...props }: LinkProps) => {
  const { search } = useLocation();

  return (
    <Link to={to + search} {...props}>
      {children}
    </Link>
  );
};
