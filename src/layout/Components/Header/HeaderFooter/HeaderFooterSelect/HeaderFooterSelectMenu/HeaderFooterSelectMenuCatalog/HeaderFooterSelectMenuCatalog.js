import classNames from "classnames/bind";
import style from './HeaderFooterSelectMenuCatalog.module.scss'
import { getIdCatalog, getPriceCatalog } from "~/layout/Components/Header/HeaderFooter/headerFooterSlice"; 
import { typeList, selectionList, brandList, colorList } from "~/layout/Components/SideBar/sideBarSlice";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";

const cx = classNames.bind(style);

function HeaderFooterSelectMenuCatalog({childCatalog, name, setStatus}) {
    const [min, setMin] = useState(0);
    const [max, setMax] = useState(0);
    const dispatch = useDispatch();

    const handleOnClickCatalog = (e) => {
        if(name === "Shop By Brand")
        {
            dispatch(brandList({
                type: "single",
                name: childCatalog.name
            }))
            dispatch(getIdCatalog(""));
            dispatch(getPriceCatalog({
                min: 0,
                max: 0.
            }));
        }
        else if(name === "Shop By Price")
        {
            dispatch(brandList({
                type: "",
                name: ""
            }));
            dispatch(getPriceCatalog({
                min: e.target.getAttribute("min"),
                max: e.target.getAttribute("max")
            }))
            dispatch(getIdCatalog(""));
        }
        else
        {
            dispatch(brandList({
                type: "",
                name: ""
            }));
            dispatch(getPriceCatalog({
                min: 0,
                max: 0.
            }));
            dispatch(getIdCatalog(e.target.getAttribute("data-id")));
        }
        dispatch(colorList({
            type: "",
            name: ""
        }));
        dispatch(typeList(""));
        dispatch(selectionList(""));
        setStatus(false);
    }

    useEffect(() => {
        if(name === "Shop By Price")
        {
            let max, min;
            if(childCatalog.name[0] === ">" || childCatalog.name[0] === "<")
            {
                if(childCatalog.name[0] === "<")
                    max = Number(childCatalog.name.slice(1).trim());
                else
                    min = Number(childCatalog.name.slice(1).trim());
            } else {
                let count;
                for(let i = 0; i < childCatalog.name.length; i++)
                {
                    if(childCatalog.name[i] === "-")
                    {
                        count = i;
                    }
                }
                min = Number(childCatalog.name.slice(0, count).trim());
                max = Number(childCatalog.name.slice(count + 1).trim());
            }
            min && setMin(min);
            max && setMax(max);
        }
    }, [])

    return ( 
        <li className={cx("HeaderFooterSelectMenuCatalog")} min={min} max={max} data-id={childCatalog._id} onClick={handleOnClickCatalog}>{childCatalog.name}</li>
    );
}

export default HeaderFooterSelectMenuCatalog;