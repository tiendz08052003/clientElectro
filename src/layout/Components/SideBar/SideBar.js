import classNames from "classnames/bind";
import styles from "./SideBar.module.scss";
import SideBarCate from "./SideBarCate";
import SideBarSelect from "./SideBarSelect/SideBarSelect";
import { useEffect, useState } from "react";
import * as SelectionServices from "~/services/SelectionServices"
import { useDispatch, useSelector } from "react-redux";
import { selectionList, typeList } from "./sideBarSlice";
import { sideBarSelection, sideBarType } from "~/redux/selector";
import { NavLink } from "react-router-dom";
import config from "~/config/config";
import { useNavigate } from "react-router-dom";

const cx = classNames.bind(styles);

function SideBar({handleOnClickFilterOnTabletOrMobile, typePage}) {

    const x = new URLSearchParams(window.location.search);
    const typeHome = x.get("type");

    const [listSelection, setListSelection] = useState([]);
    
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const sideBarSelect = useSelector(sideBarSelection);
    const sideBarT = useSelector(sideBarType);

    const handleOnClickSideBarOnTabletOrMobile = (e) => {
        e.stopPropagation();
    }

    useEffect(() => {
        const fetchAPI = async () => {
            const res = await SelectionServices.getSelection();
            setListSelection(res);
        }

        fetchAPI();
    }, [])

    const handleOnclickCaseType = (e) => {
        const id  = e.target.getAttribute("data-id");
        dispatch(typeList(id));
        dispatch(selectionList(""));
        navigate("/");
    }

    const handleOnclickCaseSelection = (e) => {
        const id  = e.target.getAttribute("data-id");
        if(id === null)
        {
            dispatch(typeList(""));
            dispatch(selectionList(""));
        }
        else
        {
            dispatch(typeList(""));
            dispatch(selectionList(id));
        }
    }

    console.log(typePage);

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
                                        <div className={cx("sidebar__wrapper__child__body__list__select__parent")} data-id="" onClick={handleOnclickCaseSelection} style={{fontWeight: sideBarSelect==="" && sideBarT === "" && "1000"}}>
                                            All Categories
                                        </div>
                                    </NavLink>
                                </li>
                                {listSelection.map((selection, index) => (
                                    <SideBarCate key={index} selection={selection} handleOnclickCaseSelection={handleOnclickCaseSelection} handleOnclickCaseType={handleOnclickCaseType} sideBarSelect={sideBarSelect} sideBarT={sideBarT}/>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
                {typePage === "Home" && (
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