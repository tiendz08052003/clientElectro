import classNames from "classnames/bind";
import style from './HeaderFooterSelectMenu.module.scss'
import { useEffect, useState } from "react";
import * as CatalogServices from '~/services/CatalogServices';
import HeaderFooterSelectMenuCatalog from "./HeaderFooterSelectMenuCatalog";

const cx = classNames.bind(style);

function HeaderFooterSelectMenu({menu, setStatus}) {
    const [catalog, setCatalog] = useState([])

    useEffect(() => {
        const fetchAPI = async () => {
            const res = await CatalogServices.getCatalog();
            let array = [];
            res.map(catalog => {
                catalog.idMenu === menu._id && array.push(catalog);
            })
            setCatalog(array);
        }
        fetchAPI();
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