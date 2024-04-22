import classNames from "classnames/bind";
import style from './HeaderFooterSelectMenuCatalog.module.scss'
import { getIdDetailsCatalog, getPriceCatalog } from "~/layout/Components/Header/HeaderFooter/headerFooterSlice"; 
import { type, detailsType, listBrand, listColor } from "~/layout/Components/SideBar/sideBarSlice";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";

const cx = classNames.bind(style);

function HeaderFooterSelectMenuCatalog({childDetailsCatalog, name, setStatus}) {
    const [min, setMin] = useState(0);
    const [max, setMax] = useState(0);
    const dispatch = useDispatch();

    const handleOnClickCatalog = (e) => {
        console.log(name);
        if(name === "Shop By Brand")
        {
            dispatch(listBrand({
                type: "single",
                name: childDetailsCatalog.name
            }))
            dispatch(getIdDetailsCatalog(""));
            dispatch(getPriceCatalog({
                min: 0,
                max: 0.
            }));
        }
        else if(name === "Shop By Price")
        {
            dispatch(listBrand({
                type: "",
                name: ""
            }));
            dispatch(getPriceCatalog({
                min: e.target.getAttribute("min"),
                max: e.target.getAttribute("max")
            }))
            dispatch(getIdDetailsCatalog(""));
        }
        else
        {
            dispatch(listBrand({
                type: "",
                name: ""
            }));
            dispatch(getPriceCatalog({
                min: 0,
                max: 0.
            }));
            dispatch(getIdDetailsCatalog(e.target.getAttribute("data-id")));
        }
        dispatch(listColor({
            type: "",
            name: ""
        }));
        dispatch(type(""));
        dispatch(detailsType(""));
        setStatus(false);
    }

    useEffect(() => {
        if(name === "Shop By Price")
        {
            let max, min;
            if(childDetailsCatalog.name[0] === ">" || childDetailsCatalog.name[0] === "<")
            {
                if(childDetailsCatalog.name[0] === "<")
                    max = Number(childDetailsCatalog.name.slice(1).trim());
                else
                    min = Number(childDetailsCatalog.name.slice(1).trim());
            } else {
                let count;
                for(let i = 0; i < childDetailsCatalog.name.length; i++)
                {
                    if(childDetailsCatalog.name[i] === "-")
                    {
                        count = i;
                    }
                }
                min = Number(childDetailsCatalog.name.slice(0, count).trim());
                max = Number(childDetailsCatalog.name.slice(count + 1).trim());
            }
            min && setMin(min);
            max && setMax(max);
        }
    }, [])

    return ( 
        <li className={cx("HeaderFooterSelectMenuCatalog")} min={min} max={max} data-id={childDetailsCatalog._id} onClick={handleOnClickCatalog}>{childDetailsCatalog.name}</li>
    );
}

export default HeaderFooterSelectMenuCatalog;