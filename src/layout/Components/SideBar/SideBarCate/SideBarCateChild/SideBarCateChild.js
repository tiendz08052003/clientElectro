import classNames from "classnames/bind";
import styles from "./SideBarCateChild.module.scss";

const cx = classNames.bind(styles);

function SideBarCateChild({child, handleOnclickCaseType, sideBarT}) {
    return ( 
        <li className={cx("sidebarCateChild")} onClick={handleOnclickCaseType} data-id={child._id} style={{fontWeight: sideBarT === child._id && "1000"}}>
                {child.name}
                <span className={cx("sidebarCateChild__quality")}></span>
        </li>    
     );
}

export default SideBarCateChild;