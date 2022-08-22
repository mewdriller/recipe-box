import Link from "next/link";
import { FC, PropsWithChildren } from "react";

export const PageTemplate: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <header>
        <nav>
          <ul>
            <li>
              <Link href="/">Recipes</Link>
            </li>
            <li>
              <Link href="/import">Import recipe</Link>
            </li>
          </ul>
        </nav>
      </header>
      <main>{children}</main>
    </>
  );
};
