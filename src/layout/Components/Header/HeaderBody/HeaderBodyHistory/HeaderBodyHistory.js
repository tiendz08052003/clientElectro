import classNames from "classnames/bind";
import styles from "./HeaderBodyHistory.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { Fragment, useEffect } from "react";

const cx = classNames.bind(styles);

function HeaderBodyHistory({result}) {

    return ( 
        <li className={cx("headerBodyHistory", "headerBodyHistory--handle")}>
            {result === undefined ? (
                <div className={cx("headerBodyHistory__content")}>Không có dữ liệu</div>
            ) : (
                <Fragment>
                    <div className={cx("headerBodyHistory__content")}>{result.name}</div>
                </Fragment>
            )}
        </li>
    );
}

export default HeaderBodyHistory;