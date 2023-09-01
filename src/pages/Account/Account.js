import classNames from "classnames/bind";
import styles from "./Account.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import * as AuthServices from "~/services/AuthServices";
import { loginAccount, registerAccount } from "./accountSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ToastInformation from "~/Components/ToastInfomation/ToastInformation";

const cx = classNames.bind(styles);

function Account() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const x = new URLSearchParams(window.location.search);
    const typeAccount = x.get("type");
    const emailAccount = x.get("email");
    const [regisOrLogin, setRegisOrLogin] = useState(typeAccount === "login" ? true : false);
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState(emailAccount? emailAccount : "");
    const [password, setPassword] = useState("");
    const [passwordAgain, setPassWordAgain] = useState("");
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const [bool, setBool] = useState(false);

    const style = {
        backgroundColor: "var(--primary-color)" 
    }

    const handleOnChangeUserName = (e) => {
        setUserName(e.target.value);
    }

    const handleOnChangeEmail = (e) => {
        setEmail(e.target.value);
    }

    const handleOnChangePassword = (e) => {
        setPassword(e.target.value);
    }

    const handleOnChangePasswordAgain = (e) => {
        setPassWordAgain(e.target.value);
    }

    const handleOnSubmitRegister = (e) => {
        setBool(false);
        e.preventDefault();
        const fetchAPI = async () => {
            const res = await AuthServices.createAuth({
                userName: userName,
                email: email,
                password: password,
                passwordAgain: passwordAgain
            })
            if(res === "Success")
            {
                dispatch(registerAccount())
                setUserName("");
                setEmail("");
                setPassword("");
                setPassWordAgain("");
                setContent("Success");
                setTitle("Đăng ký tài khoản thành công!");
                setBool(true);
                setTimeout(() => {
                    setRegisOrLogin(true);
                    navigate("/account?type=login");
                }, 3000)
            }
            else
            {
                setUserName("");
                setEmail("");
                setPassword("");
                setPassWordAgain("");
                setContent("Error");
                setTitle("Đăng ký thất bại!");
                setBool(true);
            }
        }
        fetchAPI();
    }

    const handleOnSubmitLogin = (e) => {
        e.preventDefault();
        const fetchAPI = async () => {
            const res = await AuthServices.loginAuth({
                email: email,
                password: password,
            })
            console.log(res);
            if(res !== undefined)
            {
                console.log(res)
                dispatch(loginAccount(res))
                setEmail("");
                setPassword("");
                setContent("Success");
                setTitle("Đăng nhập thành công!");
                setBool(true);
                setTimeout(() => {
                    navigate("/");
                }, 3000)
            }
            else
            {
                setEmail("");
                setPassword("");
                setContent("Error");
                setTitle("Đăng nhập thất bại!");
                setBool(true);
            }
        }
        fetchAPI();
    }

    const handleOnClickExit = () => {
        
    }

    
    return ( 
        <div className={cx("account")}>
            <div className={cx("selection")}>
                <a href="/account?type=login" className={cx("link-href")}>
                    <div className={cx("selection__logIn")} style={regisOrLogin ? style : null}> 
                        Đăng nhập
                    </div>
                </a>
                <a href="/account?type=register" className={cx("link-href")}>
                    <div className={cx("selection__register")} style={regisOrLogin ? null : style}> 
                        Đăng ký
                    </div>
                </a>
            </div>

            {regisOrLogin ? (
                <form className={cx("form")} onSubmit={handleOnSubmitLogin}>
                    <h3 className={cx("heading")}>Đăng nhập thành viên</h3>
                    <p className={cx("desc")}>Cùng nhau học lập trình miễn phí tại F8 ❤️</p>
                
                    <div className={cx("form--group")}>
                        <label htmlFor="email" className={cx("form--label")}>Email</label>
                        <input value={email} rules="requied|email" type="text" placeholder="VD: email@domain.com" className={cx("form--control")} onChange={handleOnChangeEmail}/>
                        <span className={cx("form--message")}></span>
                    </div>
                
                    <div className={cx("form--group")}>
                        <label htmlFor="password" className={cx("form--label")}>Mật khẩu</label>
                        <input value={password} rules="requied|input:6" type="password" placeholder="Nhập mật khẩu" className={cx("form--control")} onChange={handleOnChangePassword}/>
                        <span className={cx("form--message")}></span>
                    </div>
                    <button className={cx("form--submit")}>Đăng nhập</button>
                    <a href="/account/accountForget?type=forgetPassword" style={{textDecoration: "none"}}>
                        <div className={cx("forgot")}>
                            Quên mật khẩu
                        </div>
                    </a>
                </form>
            ) : (
                <form className={cx("form")} onSubmit={handleOnSubmitRegister}>
                    <h3 className={cx("heading")}>Đăng ký thành viên</h3>
                    <p className={cx("desc")}>Cùng nhau học lập trình miễn phí tại F8 ❤️</p>
                
                    <div className={cx("form--group")}>
                        <label htmlFor="userName"className={cx("form--label")}>Tên đầy đủ</label>
                        <input value={userName} rules="requied" type="text" placeholder="VD: Sơn Đặng"className={cx("form--control")} onChange={handleOnChangeUserName}/>
                        <span className={cx("form--message")}></span>
                    </div>

                    <div className={cx("form--group")}>
                        <label htmlFor="email" className={cx("form--label")}>Email</label>
                        <input value={email} rules="requied|email" type="text" placeholder="VD: email@domain.com" className={cx("form--control")} onChange={handleOnChangeEmail}/>
                        <span className={cx("form--message")}></span>
                    </div>
                
                    <div className={cx("form--group")}>
                        <label htmlFor="password" className={cx("form--label")}>Mật khẩu</label>
                        <input value={password} rules="requied|input:6" type="password" placeholder="Nhập mật khẩu" className={cx("form--control")} onChange={handleOnChangePassword}/>
                        <span className={cx("form--message")}></span>
                    </div>

                    <div className={cx("form--group")}>
                        <label htmlFor="passwordAgain" className={cx("form--label")}>Nhập lại mật khẩu</label>
                        <input value={passwordAgain} rules="requied|input:6" type="password" placeholder="Nhập lại mật khẩu" className={cx("form--control")} onChange={handleOnChangePasswordAgain}/>
                        <span className={cx("form--message")}></span>
                    </div>
                    <button className={cx("form--submit")}>Đăng ký</button>
                </form>
            )}
            
            <a  href="/" className={cx("link-href")}>
                <div className={cx("exit")} onClick={handleOnClickExit}>
                    <FontAwesomeIcon icon={faArrowLeft} />
                </div>
            </a>
            {bool && <ToastInformation content={content} title={title} bool={bool} setBool={setBool}/>}
        </div>
     );
}

export default Account;