import styles from "@/src/shared/ui/Checkbox/input.module.css";
import classNames from "../../lib/classnames/classnames";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  theme?: VariantsTheme;
}
type VariantsTheme = | "primary" | "secondary";

const Checkbox = ({ className,theme = "primary", ...props }: CheckboxProps) => {
  return (
    <input type="checkbox" className={classNames(styles.input, { [styles[theme]]: true }, [className || ""])} {...props} />
  );
};

export default Checkbox;
