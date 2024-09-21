import React from "react";
import styles from "@/src/shared/ui/Input/ui-input.module.css";


export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  theme?: VariantsType;
  error?: boolean;
}

type VariantsType = "primary" | "secondary";
const Input = ({ className, children, theme, error = false, ...otherProps }: InputProps) => {
  const InputClassName = `${styles.input_global} ${theme === "primary" ? styles.secondary : styles.primary} ${error ? styles.error : ""} ${className}`;
  return (
    <div className={InputClassName}>

      <input className={styles.input} {...otherProps} />

    </div>
  );
};
export default Input;
