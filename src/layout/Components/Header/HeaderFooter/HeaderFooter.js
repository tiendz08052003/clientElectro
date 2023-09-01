import classNames from "classnames/bind";
import styles from "./HeaderFooter.module.scss";
import HeaderFooterSelect from "./HeaderFooterSelect";
import { useEffect, useState } from "react";
import * as SelectionServices from "~/services/SelectionServices"

const cx = classNames.bind(styles);

function HeaderFooter({pcWidth, status, setStatus, handleOnClickIconMenu}) {
    const [listChild, setListChild] = useState([]);


    const handleOnClickMenu = (e) => {
        e.stopPropagation();
    }

    const styleMenu = {
        display: pcWidth ? "block" : (status ? "block" : "none")
    }

    useEffect(() => {
        const fetchAPI = async () => {
            const res = await SelectionServices.getSelection();
            setListChild(res);
        }
        fetchAPI();
    }, [])

    return ( 
        <div style={styleMenu} className={cx("header__footer")} onClick={handleOnClickIconMenu}>
            <div className={cx("wrapper")}>
                <div className={cx("header__footer__child")} onClick={handleOnClickMenu}>
                    <ul className={cx("header__footer__child__selec")}>
                        {listChild && listChild.map((child, index) => (
                            <HeaderFooterSelect key={index} child={child} setStatus={setStatus}/>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
     );
}

export default HeaderFooter;