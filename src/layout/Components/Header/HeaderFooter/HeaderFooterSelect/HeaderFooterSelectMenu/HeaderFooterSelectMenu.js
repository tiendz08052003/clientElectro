import classNames from "classnames/bind";
import style from './HeaderFooterSelectMenu.module.scss'
import { useEffect, useState } from "react";
import HeaderFooterSelectMenuCatalog from "./HeaderFooterSelectMenuCatalog";
import { useSelector } from "react-redux";
import { getCatalog } from "~/redux/selector";

const cx = classNames.bind(style);

function HeaderFooterSelectMenu({menu, setStatus}) {
    const [catalog, setCatalog] = useState([])
    const listCatalog = useSelector(getCatalog);

    useEffect(() => {
        if(listCatalog)
        {
            const fetchAPI = async () => {
                let array = [];
                listCatalog.map(catalog => {
                    catalog.idMenu === menu._id && array.push(catalog);
                })
                setCatalog(array);
            }
            fetchAPI();
        }
    }, [])

    return ( 
        <li className={cx("HeaderFooterSelectMenu")}>
            <div className={cx("HeaderFooterSelectMenu__name")}>
                {menu.name}
            </div>
            <ul className={cx("HeaderFooterSelectMenu__list")}>
                {
                    catalog.map((childCatalog, index) => (
                        <HeaderFooterSelectMenuCatalog key={index} childCatalog={childCatalog} name={menu.name} setStatus={setStatus}/>
                    ))
                }
            </ul>
        </li>
     );
}

export default HeaderFooterSelectMenu;