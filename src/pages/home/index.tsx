'use client'
import Input from "@/src/shared/ui/Input/ui-input";
import styles from "@/src/pages/home/index.module.css";
import { Checkbox, Button } from "@/src/shared/ui/index";
import Search from "@/src/widgets/search";
import { useEffect, useState } from "react";

/**
 * @page Home
 */

const HomePage = () => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    console.log(!isChecked);
  };
  return (
    <div className={styles.container}>
      <Input
        className={styles.input}
        type="text"
        theme="secondary"
        icon="right"
        placeholder="Primary Input"
      />
      <Checkbox checked={isChecked} onChange={handleCheckboxChange} />
<Button theme={"green"}>Кнопка</Button>
    </div>
  );
};

export default HomePage;
