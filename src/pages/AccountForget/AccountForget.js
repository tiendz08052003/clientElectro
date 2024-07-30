import classNames from "classnames/bind";
import style from "./AccountForget.module.scss";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import * as AuthServices from '~/services/AccountServices'
import { useNavigate } from "react-router-dom";

const cx = classNames.bind(style);

function AccountForget() {
    const x = new URLSearchParams(window.location.search);
    const typeAccountForget = x.get("type");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordAgain, setPasswordAgain] = useState("");
    const [accountForget, setAccountForget] = useState(typeAccountForget === "forgetPassword" ? true : false);

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

    const handleOnSubmitSendEmail = (e) => {
        e.preventDefault();
        const fetchAPI = async () => {
            const res = await AuthServices.getEmail(email);
        }
        fetchAPI();
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
                <form className={cx("form")} >
                    <h3 className={cx("heading")}>Nhập vào Email</h3>
                
                    <div className={cx("form--group")}>
                        <label htmlFor="email" className={cx("form--label")} >Email</label>
                        <input value={email} rules="requied|email" type="text" placeholder="VD: email@domain.com" className={cx("form--control")} onChange={handleOnChangeValueEmail}/>
                        <span className={cx("form--message")}></span>
                    </div>
                    <button className={cx("form--submit")}>Gửi</button>
                </form>
            ) : (
                <form className={cx("form")} onSubmit={handleOnSubmitRecoverPassword}>
                    <h3 className={cx("heading")}>Nhập lại mật khẩu</h3>
                
                    <div className={cx("form--group")}>
                        <label htmlFor="password" className={cx("form--label")}>Mật khẩu</label>
                        <input value={password} rules="requied|input:6" type="password" placeholder="Nhập mật khẩu" className={cx("form--control")} onChange={handleOnChangeValuePassword}/>
                        <span className={cx("form--message")}></span>
                    </div>
                    <div className={cx("form--group")}>
                        <label htmlFor="passwordAgain" className={cx("form--label")}>Nhập lại mật khẩu</label>
                        <input value={passwordAgain} rules="requied|input:6" type="passwordAgain" placeholder="Nhập mật khẩu" className={cx("form--control")} onChange={handleOnChangeValuePasswordAgain}/>
                        <span className={cx("form--message")}></span>
                    </div>
                    <button className={cx("form--submit")} >Gửi</button>
                </form>
            )}
            <a  href="/account?type=login" className={cx("link-href")}>
                <div className={cx("exit")}>
                    <FontAwesomeIcon icon={faArrowLeft} />
                </div>
            </a>
        </div>
    );
}

export default AccountForget;