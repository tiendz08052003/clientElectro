import classNames from "classnames/bind";
import styles from "./ChatGuest.module.scss";
import Image from "~/Components/Image";
const cx = classNames.bind(styles);

function ChatGuest({ur, User, setNameGuest, setBoolChatting, setIdRoom}) {

    const handleClickUser = () => {
        setIdRoom([ur._id /*Id guest*/, User._id/*Id admin*/]);
        setNameGuest(ur.name /*Name guest*/);
        setBoolChatting(false);
    }

    return (
        <li className={cx("chatGuest")} onClick={handleClickUser}>
            <div className={cx("chatGuest__details")}>
                <div className={cx("chatGuest__details__avatar")}>
                    <Image src="https://cf.shopee.vn/file/792b99e3c472e88995b2e55d341f670e_tn" className={cx("chatGuest__details__avatar__details")}/>
                </div>
                <div className={cx("chatGuest__details__content")}>
                    <div className={cx("chatGuest__details__content__name")}>
                        {ur.name}
                    </div>
                </div>
            </div>
        </li>
    );
}



export default ChatGuest;