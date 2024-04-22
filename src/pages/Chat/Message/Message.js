import classNames from "classnames/bind";
import styles from "./Message.module.scss"

const cx = classNames.bind(styles);

function Message({message, right}) {
    return ( 
        <div className={cx("message")} style={right ? {justifyContent: "end"} : {justifyContent: "start"}}>
            <span className={cx("message__content")} style={right ? {backgroundColor: "#0084ff"} : {backgroundColor: "#ddd"}}>{message}</span>
        </div>
     );
}

export default Message;