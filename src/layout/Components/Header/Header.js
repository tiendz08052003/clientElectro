import HeaderTop from "./HeaderTop";
import HeaderBody from "./HeaderBody";

import classNames from "classnames/bind";
import styles from "./Header.module.scss";
import HeaderFooter from "./HeaderFooter";
import { useEffect, useState } from "react";

const cx = classNames.bind(styles);

function Header(reloadCart) {
    const [pcWidth, setPcWidth] = useState(true);
    const [status, setStatus] = useState(false);

    //Kiểm tra lần lóa đầu tiên
    useEffect(() => {
        if(window.innerWidth <= 1230)
        {
            setPcWidth(false)
        }
        else
        {
            setPcWidth(true)
        }
    })

    useEffect(() => {
        const handleOnReSize = () => {
            if(window.innerWidth <= 1230)
            {
                setPcWidth(false)
            }
            else
            {
                setPcWidth(true)
            }
        }
        
        window.addEventListener("resize", handleOnReSize);
        
        return () => {
            window.removeEventListener('resize', handleOnReSize)
        }
    })
    

    const handleOnClickIconMenu = () => {
        setStatus(!status)
    }

    return (    
        <div className={cx("header")}>
            {pcWidth ? <HeaderTop/> : ''}
            <HeaderBody handleOnClickIconMenu={handleOnClickIconMenu} reloadCart={reloadCart}/>
            <HeaderFooter pcWidth={pcWidth} status={status} setStatus={setStatus} handleOnClickIconMenu={handleOnClickIconMenu}/>
        </div>
     );
}

export default Header;