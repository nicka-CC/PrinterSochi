import React from "react";
import styles from "@/src/shared/ui/Link/ui-link.module.css";
import classNames from "@/src/shared/lib/classnames/classnames";

export interface LinkProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const Link = ({ className, children, ...otherProps }: LinkProps) => {
  return (
    <div
      className={classNames(styles.link, {}, [className || ""])}  // Добавлена пустая конфигурация для Mods
      {...otherProps}
    >
      {children}
    </div>
  );
};

export default Link;
