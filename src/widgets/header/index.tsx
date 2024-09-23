'use client'
import { Button, Link } from "@/src/shared/ui";
import styles from "@/src/widgets/header/index.module.css";
import { ChevronLeft, ChevronDown } from "lucide-react";
import classNames from "@/src/shared/lib/classnames/classnames";
import Image from "next/image";
import logo from "@/public/Logo.svg"
import {useState} from "react";
const username = "Global_layout";
const Header = ({ className }: { className?: string }) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <div className={classNames(styles.header, {}, [className || ""])}>
      <Link className={styles.logo}>
        <Image src={logo} alt={'logo'}/>
      </Link>
      <div className={styles.groupfst}>
        <div><a className={styles.a} href={"/services"}>Наши услуги</a></div>
        <div><a className={styles.a}  href={"/prices"}>Цены</a></div>
        <div><a className={styles.a} href={"/reviews"}>Отзывы</a></div>
        <div><a className={styles.a} href={"/contacts"}>Контакты</a></div>
        <div onClick={()=> setOpen(!open)}>Ещё <ChevronDown color={"red"} size={10}/></div>
      </div>
      <div className={styles.modal}>
        {open && <>
          <a href={"/sizes-print"}><div className={styles.modalString}>Нестандартные размеры печати</div>
          </a>
          <a href={"/delivery"}><div className={styles.modalString}>Доставка</div></a>
          <a href={"/explotan-cats"}><div className={styles.modalString}>Взрывные котята</div>
          </a>
          <a href={"/photographer"}><div className={styles.modalString}>Фотограф</div>
          </a>
          </>

        }</div>
    </div>
  );
};

export default Header;
