import Header from "../Components/Header";
import Footer from "../Components/Footer";

import classNames from "classnames/bind";
import styles from "./HeaderAndFooterOnly.module.scss"
import Path from "../Components/Path";

const cx = classNames.bind(styles);

function HeaderOnly( {children} ) {
    return ( 
        <div className={cx("container")}>
            <Header/>
            <div className={cx("body")}>
                <div className={cx("wrapper")}>
                    <Path name={children.type.name}/>
                    {children}
                </div>
            </div>
            <Footer />
        </div>
     );
}

export default HeaderOnly;