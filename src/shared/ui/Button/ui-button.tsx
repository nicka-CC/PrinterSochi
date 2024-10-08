import React from "react";
import styles from "@/src/shared/ui/Button/ui-button.module.css";
import classNames from "@/src/shared/lib/classnames/classnames";

export interface Button extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  theme?: VariantsType;
  className?: string;
}
type VariantsType =
  | "red"
  | "gray"
  | "grayv2"
  | "blue"
  | "green";
const Button = (props: Button) => {
  const { className, children, theme = "red", type = "default", ...otherProps } = props;
  return (
    <button
      className={classNames(styles.buttonD, { [styles[theme]]: true }, [className || ""])}
      {...otherProps}
    >
      {children}
    </button>
  );
};
export default Button;
