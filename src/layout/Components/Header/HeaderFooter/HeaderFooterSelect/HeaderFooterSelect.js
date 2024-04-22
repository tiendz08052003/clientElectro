import classNames from "classnames/bind";
import styles from "./HeaderFooterSelect.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSortDown } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import HeaderFooterSelectMenu from "./HeaderFooterSelectMenu";
import { useSelector } from "react-redux";
import { getCatalog, getCombineType_Catalog } from "~/redux/selector";

const cx = classNames.bind(styles);

function HeaderFooterSelect({childType, setStatus}) {
    const [catalog, setCatalog] = useState([]);
    const [openMenu, setOpenMenu] = useState(false); // dùng để bật tắt menu
    const [pcWidth, setPcWidth] = useState(true); // kiểm tra xem có đang trên màn pc không
    let styleOpenMenuOnTablet;
    let listCombineType_Catalog = useSelector(getCombineType_Catalog);
    let listCatalog = useSelector(getCatalog);

    //lắng nghe kích thước khi mới khởi động web
    useEffect(() => {
        if(window.innerWidth <= 1230)
        {
            setPcWidth(false);
        }
        else
        {
            setPcWidth(true)
        }
    })

    //lắng nghe khi thay đổi kích thước ngang web
    useEffect(() => {
        const handleOnReSize = () => {
            if(window.innerWidth <= 1230)
            {
                setPcWidth(false);
            }
            else
            {
                setPcWidth(true);
            }
        }
        
        window.addEventListener("resize", handleOnReSize);
        
        return () => {
            window.removeEventListener('resize', handleOnReSize)
        }
    })

    // kiểm tra xem có trong tablet hoặc mobile hông mới xét style    
    if(window.innerWidth <= 1230)
    {
        styleOpenMenuOnTablet = {
            visibility: openMenu ? "visible" : "hidden",
            opacity: openMenu ? "1" : "0",
            display: openMenu ? "block" : "table-column"
        }
    }

    // hàm xử lý ấn vào menu
    const handleOnClickOpenMenuOnTablet = () => {
        if(!pcWidth)
            setOpenMenu(!openMenu);
    }

    useEffect(() => {
        if(listCombineType_Catalog && listCatalog)
        {
            const fetchAPI = async () => {
                let arrayA = [], arrayB = [];
                arrayA = listCombineType_Catalog.filter(x => {
                    return x.idType === childType._id;
                })
                arrayB = listCatalog.filter(x => {
                    const arr = arrayA.filter(y => {
                        return y.idCatalog === x._id;
                    })
                    if(arr.length)
                        return true;
                    return false;
                })
                setCatalog(arrayB);
            }
            fetchAPI();
        }
    }, [listCombineType_Catalog, listCatalog])
    return (
        <li className={cx("headerFooterSelect")} onClick={handleOnClickOpenMenuOnTablet}> 
            <div className={cx("headerFooterSelect__header")}>
                <span className={cx("headerFooterSelect__header--content")}>{childType.name}</span>
                <FontAwesomeIcon icon={faSortDown} className={cx("headerFooterSelect__header--icon")} />
            </div>
            <ul style={styleOpenMenuOnTablet} className={cx("headerFooterSelect__list")}>
                {
                    catalog.map((childCatalog, index) => (
                        <HeaderFooterSelectMenu key={index} listCombineType_Catalog={listCombineType_Catalog} childType={childType} childCatalog={childCatalog} setStatus={setStatus}/>
                    ))
                }
            </ul>
        </li>
     );
}

export default HeaderFooterSelect;