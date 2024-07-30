import classNames from "classnames/bind";
import style from "./AccountForget.module.scss";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import * as AuthServices from '~/services/AccountServices'
import { useNavigate } from "react-router-dom";
import ToastInformation from "~/Components/ToastInfomation/ToastInformation";

const cx = classNames.bind(style);

function AccountForget() {
    const x = new URLSearchParams(window.location.search);
    const typeAccountForget = x.get("type");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordAgain, setPasswordAgain] = useState("");
    const [bool, setBool] = useState(false);
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    
    let accountForget = typeAccountForget === "forgetPassword" ? true : false;

    const navigate = useNavigate();


    const handleOnChangeValueEmail = (e) => {
        setEmail(e.target.value);
    }

    const handleOnChangeValuePassword = (e) => {
        setPassword(e.target.value);
    }

    const handleOnChangeValuePasswordAgain = (e) => {
        setPasswordAgain(e.target.value);
    }

    const handleOnSubmitSendEmail = async (e) => {
        e.preventDefault();
        setBool(false);
        const res = await AuthServices.getEmail(email);
        if(res === "Success") {
            setContent("Success");
            setTitle("Thành công! Vui lòng vào email lấy lại mật khẩu.");
            setBool(true);
        }
        else {
            setContent("Error");
            setTitle("Email không tồn tại!");
            setBool(true);
        }
    }

    const handleOnSubmitRecoverPassword = (e) => {
        e.preventDefault();
        const email = x.get("email");
        const hashEmail = x.get("hashEmail");
        const fetchAPI = async () => {
            const res = await AuthServices.recoverPassword({ email , hashEmail , password });
            console.log(res);
            navigate("/account?type=login");
        }
        fetchAPI();
    }

    return (
        <div className={cx("accountForget")} onSubmit={handleOnSubmitSendEmail}>
            {accountForget ? (
                <form className={cx("accountForget__form")} >
                    <h3 className={cx("accountForget__form__heading")}>Nhập vào Email</h3>
                
                    <div className={cx("accountForget__form__group")}>
                        <label htmlFor="email" className={cx("accountForget__form__group__label")} >Email</label>
                        <input value={email} rules="requied|email" type="text" placeholder="VD: email@domain.com" className={cx("accountForget__form__group__control")} onChange={handleOnChangeValueEmail}/>
                        <span className={cx("accountForget__form__group__message")}></span>
                    </div>
                    <button className={cx("accountForget__form__submit")}>Gửi</button>
                </form>
            ) : (
                <form className={cx("accountForget__form")} onSubmit={handleOnSubmitRecoverPassword}>
                    <h3 className={cx("accountForget__form__heading")}>Nhập lại mật khẩu</h3>
                
                    <div className={cx("accountForget__form__group")}>
                        <label htmlFor="password" className={cx("accountForget__form__group__label")}>Mật khẩu</label>
                        <input value={password} rules="requied|input:6" type="password" placeholder="Nhập mật khẩu" className={cx("accountForget__form__group__control")} onChange={handleOnChangeValuePassword}/>
                        <span className={cx("accountForget__form__group__message")}></span>
                    </div>
                    <div className={cx("accountForget__form__group")}>
                        <label htmlFor="passwordAgain" className={cx("accountForget__form__group__label")}>Nhập lại mật khẩu</label>
                        <input value={passwordAgain} rules="requied|input:6" type="passwordAgain" placeholder="Nhập mật khẩu" className={cx("accountForget__form__group__control")} onChange={handleOnChangeValuePasswordAgain}/>
                        <span className={cx("accountForget__form__group__message")}></span>
                    </div>
                    <button className={cx("accountForget__form__submit")}>Gửi</button>
                </form>
            )}
            <a  href="/account?type=login" className={cx("link-href")}>
                <div className={cx("exit")}>
                    <FontAwesomeIcon icon={faArrowLeft} />
                </div>
            </a>
            {bool && <ToastInformation content={content} title={title} bool={bool} setBool={setBool}/>}
        </div>
    );
}

export default AccountForget;