import classNames from "classnames/bind";
import styles from "./HeaderFooterSelect.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSortDown } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import HeaderFooterSelectMenu from "./HeaderFooterSelectMenu";
import { useSelector } from "react-redux";
import { getMenu } from "~/redux/selector";

const cx = classNames.bind(styles);

function HeaderFooterSelect({child, setStatus}) {
    
    const [listMenu, setListMenu] = useState([]);
    const [openMenu, setOpenMenu] = useState(false); // dùng để bật tắt menu
    const [pcWidth, setPcWidth] = useState(true); // kiểm tra xem có đang trên màn pc không
    let styleOpenMenuOnTablet;
    let listMu = useSelector(getMenu);

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
        if(listMu)
        {
            const fetchAPI = async () => {
                let array = [];
                listMu.map(menu => {
                    menu.idSelection === child._id &&  array.push(menu);
                })
                setListMenu(array);
            }
            fetchAPI();
        }
    }, [listMu])

    return (
        <li className={cx("headerFooterSelect")} onClick={handleOnClickOpenMenuOnTablet}> 
            <div className={cx("headerFooterSelect__header")}>
                <span className={cx("headerFooterSelect__header--content")}>{child.name}</span>
                <FontAwesomeIcon icon={faSortDown} className={cx("headerFooterSelect__header--icon")} />
            </div>
            <ul style={styleOpenMenuOnTablet} className={cx("headerFooterSelect__list")}>
                {
                    listMenu.map((menu, index) => (
                        <HeaderFooterSelectMenu key={index} menu={menu} setStatus={setStatus}/>
                    ))
                }
            </ul>
        </li>
     );
}

export default HeaderFooterSelect;