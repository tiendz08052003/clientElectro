    import classNames from "classnames/bind";
    import styles from "./SideBarCate.module.scss";
    import { Fragment, memo, useEffect, useState } from "react";
    import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
    import { faAngleRight, faChevronDown } from "@fortawesome/free-solid-svg-icons";
    import SideBarCateChild from "./SideBarCateChild";
    import * as TypeServices from '~/services/TypeServices';
    import { Link, NavLink } from "react-router-dom";
    import config from "~/config/config";
    
    const cx = classNames.bind(styles);

    function SideBarCate({selection, handleOnclickCaseSelection, handleOnclickCaseType, sideBarSelect, sideBarT}) {

        const [styleType, setStyleType] = useState(false);
        const [listChild, setListChild] = useState([]);
        

        const handleOnclickSelection = () => {
            setStyleType(!styleType);
        }

        useEffect(() => {
            const fetchAPI = async () => {
                const res = await TypeServices.getType();
                let list = [];
                res.map((data, index) => {
                    if(data.idSelection === selection._id)
                    {
                        list.push(data)
                    }
                })
                setListChild(list);
            }
            fetchAPI();
        }, [])

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
                                <div style={{marginLeft: "19px", fontWeight: sideBarSelect === selection._id && "1000" }} className={cx("sidebarCate__parent__content")} onClick={handleOnclickCaseSelection} data-id={selection._id}>{selection.name}</div> 
                            ) : (
                                <div style={{marginLeft: "0", fontWeight: sideBarSelect === selection._id && "1000"}} className={cx("sidebarCate__parent__content")} onClick={handleOnclickCaseSelection} data-id={selection._id}>{selection.name}</div> 
                            )}
                            
                            <span className={cx("sidebarCate__parent__quality")}></span>
                        </NavLink>
                    </div>
                    { styleType && listChild && listChild.length > 1 &&
                        <ul className={cx("sidebarCate__parent__list")}>
                        { 
                            listChild.map((child, index) => (
                                <SideBarCateChild key={index} child={child} handleOnclickCaseType={handleOnclickCaseType} sideBarT={sideBarT}/>
                            ))
                        }
                        </ul> 
                    }                 
                </li>
        );
    }

    export default memo(SideBarCate);
