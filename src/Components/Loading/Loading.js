import classNames from "classnames/bind";
import styles from "./Loading.module.scss";

const cx = classNames.bind(styles);

function Loading() {
    return ( 
        <div className={cx("loading__container")}>
            <svg viewBox="0 0 100 100">
                <defs>
                    <filter id="shadow">
                        <feDropShadow dx="0" dy="0" stdDeviation="1.5" 
                        floodColor="#fc6767"/>
                    </filter>
                </defs>
                <circle className={cx("loading__spinner")} cx="50" cy="50" r="45"/>
            </svg>
        </div>
    );
}

export default Loading;