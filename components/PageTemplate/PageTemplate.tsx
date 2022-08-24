import NextLink from "next/link";
import { FC, PropsWithChildren } from "react";

export const PageTemplate: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <header>
        <nav>
          <ul>
            <li>
              <NextLink href="/">Recipes</NextLink>
            </li>
            <li>
              <NextLink href="/import">Import recipe</NextLink>
            </li>
          </ul>
        </nav>
      </header>
      <main>{children}</main>
    </>
  );
};
