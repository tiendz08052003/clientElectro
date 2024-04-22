    import classNames from "classnames/bind";
    import styles from "./SideBarCate.module.scss";
    import { Fragment, memo, useEffect, useState } from "react";
    import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
    import { faAngleRight, faChevronDown } from "@fortawesome/free-solid-svg-icons";
    import SideBarCateChild from "./SideBarCateChild";
    import { getDetailsType } from "~/redux/selector"; 
    import { NavLink } from "react-router-dom";
    import config from "~/config/config";
    import { useSelector } from "react-redux";
    
    const cx = classNames.bind(styles);

    function SideBarCate({handleOnclickCaseType, handleOnclickCaseDetailsType, sideBarType, getSideBarTypeNow, getSideBarDetailsTypeNow}) {

        const [styleType, setStyleType] = useState(false);
        const [listChild, setListChild] = useState([]);

        const listDetailsType = useSelector(getDetailsType);
        
        const handleOnclickSelection = () => {
            setStyleType(!styleType);
        }

        useEffect(() => {
            let list = [];
            listDetailsType.map((detailsType, index) => {
                if(detailsType.idType === sideBarType._id)
                {
                    list.push(detailsType)
                }
            })
            setListChild(list);
        }, [listDetailsType])
        return ( 
            <li className={cx("sidebarCate")}>
                    <div className={cx("sidebarCate__parent")}>
                        { listChild && listChild.length > 1 &&
                            (
                                <Fragment>
                                    {styleType ? (
                                        <span className={cx("sidebarCate__parent__iconDown")} onClick={handleOnclickSelection}>
                                            <FontAwesomeIcon icon={faChevronDown} className={cx("sidebarCate__parent__icon--child")}/>    
                                        </span>
                                    ) : (
                                        <span className={cx("sidebarCate__parent__icon")} onClick={handleOnclickSelection}>
                                            <FontAwesomeIcon icon={faAngleRight} className={cx("sidebarCate__parent__icon--child")} />
                                        </span>
                                    )}
                                </Fragment>
                            )
                        } 
                        <NavLink to={config.routes.home} className={cx("link-href")}>    
                            {listChild && listChild.length === 1 ? (
                                <div style={{marginLeft: "19px", fontWeight: getSideBarTypeNow !== "" &&  getSideBarTypeNow == sideBarType._id && "1000" }} className={cx("sidebarCate__parent__content")} onClick={handleOnclickCaseType} data-id={sideBarType._id}>{sideBarType.name}</div> 
                            ) : (
                                <div style={{marginLeft: "0", fontWeight: getSideBarTypeNow !== "" &&  getSideBarTypeNow == sideBarType._id && "1000"}} className={cx("sidebarCate__parent__content")} onClick={handleOnclickCaseType} data-id={sideBarType._id}>{sideBarType.name}</div> 
                            )}
                            
                            <span className={cx("sidebarCate__parent__quality")}></span>
                        </NavLink>
                    </div>
                    { styleType && listChild && listChild.length > 1 &&
                        <ul className={cx("sidebarCate__parent__list")}>
                        { 
                            listChild.map((child, index) => (
                                <SideBarCateChild key={index} child={child} handleOnclickCaseDetailsType={handleOnclickCaseDetailsType} getSideBarDetailsTypeNow = {getSideBarDetailsTypeNow}/>
                            ))
                        }
                        </ul> 
                    }                 
                </li>
        );
    }

    export default memo(SideBarCate);
