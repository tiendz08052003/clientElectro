import Header from "../Components/Header";
import Footer from "../Components/Footer";
import styles from "./DefaultLayout.module.scss";
import classNames from "classnames/bind";
import SideBar from "../Components/SideBar/SideBar";
import Path from "../Components/Path";
import Chat from "~/pages/Chat";
import { useEffect, useState } from "react";

const cx = classNames.bind(styles);

function DefaultLayout({ onSideBar, handleOnClickFilterOnTabletOrMobile, children, reloadCart, namePage}) {

    const [pcWidth, setPcWidth] = useState(false);

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

    return ( 
        <div className={cx("container")}>
            <Header reloadCart={reloadCart}/>
            <div className={cx("body")}>
                <div className={cx("body__path")}>
                    <Path name={namePage}/>
                </div>  
                <div className={cx("body__content")}>
                    <div className={cx("wrapper")}>
                        <div className={cx("grid__row")}>
                            {pcWidth ? <SideBar namePage={namePage} /> : onSideBar ? <SideBar namePage={namePage} handleOnClickFilterOnTabletOrMobile={handleOnClickFilterOnTabletOrMobile}/> : "" }
                            {children}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
            <Chat />
        </div>
    );
}

export default DefaultLayout;