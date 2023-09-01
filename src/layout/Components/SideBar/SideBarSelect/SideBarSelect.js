import classNames from "classnames/bind";
import styles from "./SideBarSelect.module.scss";
import SideBarSelectChild from "./SideBarSelectChild";
import { useEffect, useState } from "react";
import * as BrandServices from "~/services/BrandServices"
import * as ColorServices from "~/services/ColorServices"

const cx = classNames.bind(styles);

function SideBarSelect({name}) {
    const [list, setList] = useState([]);


    useEffect(() => {
        switch(name)
        {
            case "Brand":
            {
                const fetchAPI = async () => {
                    const res = await BrandServices.getBrand();
                    setList(res);
                }
                fetchAPI();
                break;
            }
            case "Color":
            {
                const fetchAPI = async () => {
                    const res = await ColorServices.getColor();
                    setList(res);
                }
                fetchAPI();
                break;
            }
            default: 
        }
    }, [])  

    return ( 
        <li className={cx("sidebarSelect")}>
            <div className={cx("sidebarSelect__content")}>
                <strong>{name}</strong>
            </div>
            <ul className={cx("sidebarSelect__list")}>
                {list && list.map((child, index) => (
                    <SideBarSelectChild key={index} child={child} name={name}/>
                ))}
            </ul>
            <div className={cx("sidebarSelect__list__showMore")}>+ Show more</div>
        </li>
     );
}

export default SideBarSelect;