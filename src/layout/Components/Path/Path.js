
import classNames from "classnames/bind";
import styles from "./Path.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { Fragment, useEffect, useState } from "react";
import * as ProductServices from "~/services/ProductServices"

const cx = classNames.bind(styles);
function Path({name}) {
    const [path, setPath] = useState("");
    const x = new URLSearchParams(window.location.search);
    useEffect(() => {
        if(x.get("id"))
        {
            const fetchAPI = async () => {
                const res = await ProductServices.shop();
                res.map(product => {
                    if(product._id === x.get("id"))
                    {
                        setPath(product.name);
                    }
                })
            }
            fetchAPI();
        }
    }, [])

    return ( 
        <div className={cx("wrapper", "path")}>
            <div className={cx("path__home")}>
                Home
            </div>
            {
                path ? (
                    <Fragment>
                        <FontAwesomeIcon icon={faAngleRight} className={cx("path--icon")} />
                        <div className={cx("path__shop")}>
                            shop
                        </div>
                        <FontAwesomeIcon icon={faAngleRight} className={cx("path--icon")} />
                        <div className={cx("path__shop")}>
                            {path}
                        </div>
                    </Fragment>
                ) : (
                    <Fragment>
                        <FontAwesomeIcon icon={faAngleRight} className={cx("path--icon")} />
                        <div className={cx("path__shop")}>
                            {name === "Home" ? "Shop" : name}
                        </div>
                    </Fragment>
                )
            }
        </div>
     );
}

export default Path;