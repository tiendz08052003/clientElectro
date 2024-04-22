import classNames from "classnames/bind";
import styles from "./SideBar.module.scss";
import SideBarCate from "./SideBarCate";
import SideBarSelect from "./SideBarSelect/SideBarSelect";
import { useDispatch, useSelector } from "react-redux";
import { detailsType, type} from "./sideBarSlice";
import { NavLink } from "react-router-dom";
import config from "~/config/config";
import { useNavigate } from "react-router-dom";
import {  getSideBarDetailsType, getSideBarType, getType,  } from "~/redux/selector";

const cx = classNames.bind(styles);

function SideBar({handleOnClickFilterOnTabletOrMobile, namePage}) {

    const x = new URLSearchParams(window.location.search);
    const typeHome = x.get("type");
    
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const getSideBarTypeNow = useSelector(getSideBarType);
    const getSideBarDetailsTypeNow = useSelector(getSideBarDetailsType);

    const listType = useSelector(getType);

    const handleOnClickSideBarOnTabletOrMobile = (e) => {
        e.stopPropagation();
    }
    const handleOnclickCaseDetailsType = (e) => {
        const id = e.target.getAttribute("data-id");
        dispatch(type(""));
        dispatch(detailsType(id));
        navigate("/");
    }

    const handleOnclickCaseType = (e) => {
        const id = e.target.getAttribute("data-id");
        if(id === null) {
            dispatch(detailsType(""));
            dispatch(type(""));
        }
        else {
            dispatch(detailsType(""));
            dispatch(type(id));
        }
    }


    return ( 
        <div className={cx("sidebar", "grid__column-2")} onClick={handleOnClickFilterOnTabletOrMobile}>
            <div className={cx("sidebar__wrapper")} onClick={handleOnClickSideBarOnTabletOrMobile}>
                {typeHome === null && (
                    <div className={cx("sidebar__wrapper__child")}>
                        <div className={cx("sidebar__wrapper__child__header")}>
                            Browse Categories
                        </div>
                        <div className={cx("sidebar__wrapper__child__body")}>
                            <ul className={cx("sidebar__wrapper__child__body__list")}>
                                <li className={cx("sidebar__wrapper__child__body__list__select")}>
                                    <NavLink to={config.routes.home} className={cx("link-href")}>
                                        <div className={cx("sidebar__wrapper__child__body__list__select__parent")} data-id="" onClick={handleOnclickCaseType} style={{fontWeight: getSideBarTypeNow === "" &&  getSideBarDetailsTypeNow === "" && "1000"}}>
                                            All Categories
                                        </div>
                                    </NavLink>
                                </li>
                                {listType.map((type, index) => (
                                    <SideBarCate key={index} handleOnclickCaseType={handleOnclickCaseType} handleOnclickCaseDetailsType={handleOnclickCaseDetailsType} sideBarType={type} getSideBarTypeNow = {getSideBarTypeNow} getSideBarDetailsTypeNow = {getSideBarDetailsTypeNow}/>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
                {(namePage === "Home") && (
                    <div className={cx("sidebar__wrapper__filter")}>
                        <span className={cx("sidebar__wrapper__filter__topic")}>
                            <span>Filters</span>
                        </span>
                        <ul className={cx("sidebar__wrapper__filter__all")}>
                            <SideBarSelect name={"Brand"}/>
                            <SideBarSelect name={"Color"}/>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    
     );
}

export default SideBar;