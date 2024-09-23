import React from "react";
import styles from "@/src/shared/ui/Link/ui-link.module.css";
import classNames from "@/src/shared/lib/classnames/classnames";

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  className?: string;
  href?:string;
}

const Link = ({ className,href, children, ...otherProps }: LinkProps) => {
  return (
    <a href={href}
      className={classNames(styles.link, {}, [className || ""])}  // Добавлена пустая конфигурация для Mods
      {...otherProps}
    >
      {children}
    </a>
  );
};

export default Link;
