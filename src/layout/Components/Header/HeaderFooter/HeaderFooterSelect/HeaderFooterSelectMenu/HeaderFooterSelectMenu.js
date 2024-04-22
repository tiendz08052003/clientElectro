import classNames from "classnames/bind";
import style from './HeaderFooterSelectMenu.module.scss'
import { useEffect, useState } from "react";
import HeaderFooterSelectMenuCatalog from "./HeaderFooterSelectMenuCatalog";
import { useSelector } from "react-redux";
import { getCombineDetailsCatalog_CombineType_Catalog, getDetailsCatalog } from "~/redux/selector";

const cx = classNames.bind(style);

function HeaderFooterSelectMenu({listCombineType_Catalog, childType, childCatalog, setStatus}) {
    const [detailsCatalog, setDetailsCatalog] = useState([])
    const listDetailsCatalog = useSelector(getDetailsCatalog);
    const listCombineDetailsCatalog_CombineType_Catalog = useSelector(getCombineDetailsCatalog_CombineType_Catalog);

    useEffect(() => {
        if(listDetailsCatalog && listCombineDetailsCatalog_CombineType_Catalog)
        {
            const arrayA = listCombineDetailsCatalog_CombineType_Catalog.filter(x => {
                const arrCombineType_Catalog = listCombineType_Catalog.filter(y => y.idCatalog === childCatalog._id && y.idType === childType._id)
                const arr = arrCombineType_Catalog.filter(y => y._id === x.idCombineType_Catalog)
                if(arr.length)
                    return true;
                return false;
            })
            const arrayB = listDetailsCatalog.filter(x => {
                const arr = arrayA.filter(y => y.idDetailsCatalog === x._id)
                if(arr.length)
                    return true;
                return false;
            })
            setDetailsCatalog(arrayB);
        }
    }, [listDetailsCatalog, listCombineDetailsCatalog_CombineType_Catalog])
    return ( 
        <li className={cx("HeaderFooterSelectMenu")}>
            <div className={cx("HeaderFooterSelectMenu__name")}>
                {childCatalog.name}
            </div>
            <ul className={cx("HeaderFooterSelectMenu__list")}>
                {
                    detailsCatalog.map((childDetailsCatalog, index) => (
                        <HeaderFooterSelectMenuCatalog key={index} childDetailsCatalog={childDetailsCatalog} name={childCatalog.name} setStatus={setStatus}/>
                    ))
                }
            </ul>
        </li>
     );
}

export default HeaderFooterSelectMenu;