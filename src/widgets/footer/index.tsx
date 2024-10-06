'use client'
import {Button, Link} from "@/src/shared/ui";
import styles from "@/src/widgets/footer/index.module.css";
import {ChevronLeft, ChevronDown, Mailbox, Mail, MailIcon, MapPin} from "lucide-react";
import classNames from "@/src/shared/lib/classnames/classnames";
import Image from "next/image";
import logo from "@/public/Logo.svg"
import {useState} from "react";
import avito from "@/public/avito.svg";
import tg from "@/public/tg.svg";
import inst from "@/public/VectorInst.svg";
import vk from "@/public/Vk.svg";
import whatsapp from "@/public/Vector.svg";

const username = "Global_layout";
import logosec from "@/public/Logo-white.svg"

const Footer = ({className}: { className?: string }) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <div className={classNames(styles.footer, {}, [className || ""])}>
      <div style={{display: "flex", margin: "0 auto"}}>

        <div style={{marginRight: "149px"}}>
          <Image src={logosec} alt={"logo"}/>
          <div style={{marginTop: "32px", fontSize: "12px"}}>
            <div><MapPin size={13}/>  г. Сочи, ул. Волжская д. 40</div>
            <div><MailIcon size={13}/>  vagang3@mail.ru</div>
          </div>
        </div>
        <div style={{marginRight: "110px"}}>
          <div><a className={styles.mainElements} href={"/about"}>Покупателям</a></div>
          <div><a className={styles.elements} href={"/prices"}>Цены</a></div>
          <div><a className={styles.elements} href={"/reviews"}>Отзывы</a></div>
          <div><a className={styles.elements} href={"/contacts"}>Контакты</a></div>
          <div><a className={styles.elements} href={"/delivers"}>Доставка</a></div>
          <div><a className={styles.elements} href={"/photographer"}>Фотограф</a></div>
        </div>
        <div style={{marginRight: "184px"}}>
          <div><a className={styles.mainElements} href={"/products"}>Продукция</a></div>
          <div><a className={styles.elements} href={"/services"}>Услуги</a></div>
          <div><a className={styles.elements} href={"/sizes-print"}>Нестандартные размеры печати</a></div>
          <div><a className={styles.elements} href={"/games"}>Настольные игры</a></div>
        </div>
        <div>
          <div style={{textAlign: "right"}}>
            <div className={styles.number}>+7 (918) 153 10 81</div>
            <div><h1 style={{borderBottom: "1px dashed white", display: "inline-block"}}>
              Позвонить нам
            </h1></div>
          </div>
          <div style={{marginLeft: "30%", display: "flex", justifyContent: "center", gap: "15px"}}>
            <Image src={avito} alt={'avito'}/>
            <Image src={tg} alt={'tg'}/>
            <Image src={inst} alt={'inst'}/>
            <Image src={vk} alt={'vk'}/>
            <Image src={whatsapp} alt={'whatsapp'}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
