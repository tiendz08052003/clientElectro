import classNames from "classnames/bind";
import styles from "./Account.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faL } from "@fortawesome/free-solid-svg-icons";
import { useRef, useState } from "react";
import * as AuthServices from "~/services/AuthServices";
import { loginAccount, logoutAccount, registerAccount } from "./accountSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ToastInformation from "~/Components/ToastInfomation/ToastInformation";
import { getUser } from "~/redux/selector";
import { CreateAxios } from "~/Components/CreateInstance/CreateInstance";

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
    const user = useSelector(getUser);
    const [checkPasswordOld, setCheckPasswordOld] = useState(false);
    const refinput = useRef();
    const refbutton = useRef();

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
            if(res !== undefined)
            {
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

    const handleOnCheckbox = (e) => {
        if(e.target.checked === true)
        {
            refinput.current.style.display = "block";
            refbutton.current.style.display = "block";
        }
        else
        {
            setCheckPasswordOld(false);
            refinput.current.style.display = "none";
            refbutton.current.style.display = "none";
        }
    }

    let axiosJWT = CreateAxios(user, dispatch, loginAccount)

    const handleSubmitChangePassword = () => {
        const fetchAPI = async () => {
            const res = await AuthServices.changePassword({
                id: user._id,
                password
            }, user?.accessToken, axiosJWT)
            if(res === "Success")
            {
                setCheckPasswordOld(false);
                setContent("Success");
                setTitle("Đổi mật khẩu thành công!");
                setBool(false);
            }    
            else
            {
                setContent("Error");
                setTitle("Đổi mật khẩu không thành công!");
                setBool(true);
            }
        }
        fetchAPI();
    }

    const handleSubmitCheckPassword = () => {
        const fetchAPI = async () => {
            const res = await AuthServices.verifyPasswordAccount({
                id: user._id,
                password
            }, user?.accessToken, axiosJWT)
            if(res === "Success")
            {
                setCheckPasswordOld(true);
                setContent("Success");
                setTitle("Mật khẩu đúng!");
                setBool(false);
            }    
            else
            {
                setContent("Error");
                setTitle("Sai mật khẩu!");
                setBool(true);
            }
        }
        fetchAPI();
    }  

    const handleSubmitDeletePassword = () => {
        const fetchAPI = async () => {
            const res1 = await AuthServices.logoutAuth(user?.accessToken, axiosJWT);
            dispatch(logoutAccount(null));
            const res2 = await AuthServices.deleteAccount({
                id: user._id,
                admin: user.admin
            }, user?.accessToken, axiosJWT)
            if(res1 === "Success" && res2 === "Success")
            {
                setContent("Success");
                setTitle("Xóa tài khoản thành công!");
                setBool(false);
                setTimeout(() => {
                    navigate("/");
                }, 3000)
            }    
            else
            {
                setContent("Error");
                setTitle("Xóa tài khoản thất bại!");
                setBool(true);
            }
        }

        fetchAPI();
    }
    
    return ( 
        <div className={cx("account")}>
            {typeAccount === "detailAccount" ? (
                <div className={cx("account__detail")}>
                    <div className={cx("form")}>
                        <h3 className={cx("heading")}>Thông tin tài khoản</h3>
                        <p className={cx("desc")}>Cùng nhau học lập trình miễn phí tại F8 ❤️</p>
                    
                        <div className={cx("form--group")}>
                            <label htmlFor="userName"className={cx("form--label")}>Tên đầy đủ</label>
                            <input value={user && user.userName} type="text" placeholder="VD: Sơn Đặng"className={cx("form--control")} onChange={handleOnChangeUserName}/>
                        </div>

                        <div className={cx("form--group")}>
                            <label htmlFor="email" className={cx("form--label")}>Email</label>
                            <input value={user && user.email} type="text" placeholder="VD: email@domain.com" className={cx("form--control")} onChange={handleOnChangeEmail}/>
                        </div>
                        <div className={cx("form--group")}>
                            <label htmlFor="password" className={cx("form--label")} style={{"display": "flex", "alignItems": "center"}}>
                                <span style={{"marginRight": "10px"}}>
                                    Thay đổi mật khẩu
                                </span>
                                {!checkPasswordOld && <input value={undefined} type="checkbox" onChange={handleOnCheckbox}/>}
                            </label>
                            {
                                checkPasswordOld ? 
                                (
                                    <>
                                        <div className={cx("form--group")}>
                                            <label htmlFor="password" className={cx("form--label")}>Mật khẩu</label>
                                            <input value={password} type="password" placeholder="Nhập mật khẩu" className={cx("form--control")} onChange={handleOnChangePassword}/>
                                        </div>

                                        <div className={cx("form--group")}>
                                            <label htmlFor="passwordAgain" className={cx("form--label")}>Nhập lại mật khẩu</label>
                                            <input value={passwordAgain} type="password" placeholder="Nhập lại mật khẩu" className={cx("form--control")} onChange={handleOnChangePasswordAgain}/>
                                        </div>
                                    </>
                                ) : (
                                    <input value={password} ref={refinput} style={{"display": "none"}} type="password" placeholder="Nhập mật khẩu cũ để thay đổi mật khẩu" className={cx("form--control")} onChange={handleOnChangePassword}/>
                                ) 
                            }
                        </div>
                        {checkPasswordOld ? (
                            <button className={cx("form--submit")} onClick={handleSubmitChangePassword}>
                                Thay đổi mật khẩu
                            </button>
                        ) : (
                            <button ref={refbutton} style={{"display": "none"}} className={cx("form--submit")} onClick={handleSubmitCheckPassword}>
                                Xác thực mật khẩu
                            </button>
                        )}
                        <button className={cx("form--delete")} onClick={handleSubmitDeletePassword}>
                            Xóa tài khoản
                        </button>
                    </div>
                </div>
            ) : (
                <>
                <div className={cx("account__selection")}>
                    <a href="/account?type=login" className={cx("link-href")}>
                        <div className={cx("account__selection__logIn")} style={regisOrLogin ? style : null}> 
                            Đăng nhập
                        </div>
                    </a>
                    <a href="/account?type=register" className={cx("link-href")}>
                        <div className={cx("account__selection__register")} style={regisOrLogin ? null : style}> 
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
                            <input value={email} type="text" placeholder="VD: email@domain.com" className={cx("form--control")} onChange={handleOnChangeEmail}/>
                        </div>
                    
                        <div className={cx("form--group")}>
                            <label htmlFor="password" className={cx("form--label")}>Mật khẩu</label>
                            <input value={password} type="password" placeholder="Nhập mật khẩu" className={cx("form--control")} onChange={handleOnChangePassword}/>
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
                                <input value={userName} type="text" placeholder="VD: Sơn Đặng"className={cx("form--control")} onChange={handleOnChangeUserName}/>
                            </div>

                            <div className={cx("form--group")}>
                                <label htmlFor="email" className={cx("form--label")}>Email</label>
                                <input value={email} type="text" placeholder="VD: email@domain.com" className={cx("form--control")} onChange={handleOnChangeEmail}/>
                            </div>
                        
                            <div className={cx("form--group")}>
                                <label htmlFor="password" className={cx("form--label")}>Mật khẩu</label>
                                <input value={password} type="password" placeholder="Nhập mật khẩu" className={cx("form--control")} onChange={handleOnChangePassword}/>
                            </div>

                            <div className={cx("form--group")}>
                                <label htmlFor="passwordAgain" className={cx("form--label")}>Nhập lại mật khẩu</label>
                                <input value={passwordAgain} type="password" placeholder="Nhập lại mật khẩu" className={cx("form--control")} onChange={handleOnChangePasswordAgain}/>
                            </div>
                            <button className={cx("form--submit")}>Đăng ký</button>
                        </form>
                    )}
                </>
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