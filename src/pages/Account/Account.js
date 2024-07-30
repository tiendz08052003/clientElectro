import classNames from "classnames/bind";
import styles from "./Account.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faL } from "@fortawesome/free-solid-svg-icons";
import { useRef, useState } from "react";
import * as AccountServices from "~/services/AccountServices";
import { loginAccount, logoutAccount, registerAccount } from "./accountSlice";
import { useDispatch, useSelector } from "react-redux";
import { parsePath, useNavigate } from "react-router-dom";
import ToastInformation from "~/Components/ToastInfomation/ToastInformation";
import { getUser } from "~/redux/selector";
import { CreateAxios } from "~/Components/CreateInstance/CreateInstance";
import * as MainServices from "~/services/MainServices";
import * as CartServices from "~/services/CartServices";

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
    const [validateName, setValidateName] = useState("");
    const [validateEmail, setValidateEmail] = useState("");
    const [validatePassword, setValidatePassword] = useState("");
    const [validatePasswordAgain, setValidatePasswordAgain] = useState("");
    const [styleValidateName, setStyleValidateName] = useState(false);
    const [styleValidateEmail, setStyleValidateEmail] = useState(false);
    const [styleValidatePassword, setStyleValidatePassword] = useState(false);
    const [styleValidatePasswordAgain, setStyleValidatePasswordAgain] = useState(false);
    const [bool, setBool] = useState(false);
    const user = useSelector(getUser);
    const [checkPasswordOld, setCheckPasswordOld] = useState(false);
    
    const refInput = useRef();
    const refButton = useRef();

    let axiosJWT = CreateAxios(user, dispatch, loginAccount)

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

    const handleOnSubmitRegister = async (e) => {
        e.preventDefault();
        setValidateName("");
        setStyleValidateName(false);

        setValidateEmail("");
        setStyleValidateEmail(false);

        setValidatePassword("");
        setStyleValidatePassword(false);

        setValidatePasswordAgain("");
        setStyleValidatePasswordAgain(false);

        let flag = false;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let test = emailRegex.test(email);

        if(!userName) {
            setValidateName("Vui lòng nhập trường này!");
            setStyleValidateName(true);
            flag = true;
        }

        if(!email) {
            setValidateEmail("Vui lòng nhập trường này!");
            setStyleValidateEmail(true);
            flag = true;
        }

        if(!password) {
            setValidatePassword("Vui lòng nhập trường này!");
            setStyleValidatePassword(true);
            flag = true;
        }

        if(!passwordAgain) {
            setValidatePasswordAgain("Vui lòng nhập trường này!");
            setStyleValidatePasswordAgain(true);
            flag = true;
        }

        if(flag)
            return;


        if(test && (password !== passwordAgain)) {
            setBool(false);

            const res = await AccountServices.createAccount({
                name: userName,
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
        else{
            if(!test)
            {
                    setValidateEmail("Đây không phải email!");
                    setStyleValidateEmail(true);
            }
            if(password !== passwordAgain)
            {
                setValidatePassword("Vui lòng nhập mật khẩu trùng!");
                setStyleValidatePassword(true);
                setValidatePasswordAgain("Vui lòng nhập mật khẩu trùng!");
                setStyleValidatePasswordAgain(true);
            }

        }
    }

    const handleUpdateCartWhenLogin = async (props, id) => {
        let ind = -1;
        const data = await CartServices.getCartNoLogin(id);
        data.data.forEach(element => {
            element.idAccount = props._id;
        });
        const listCartRedis = data.data
        const res = await CartServices.getCart();
        res.map(cart => {
            ind = -1;
            listCartRedis.map(async (element, index) => {
                if(element.idProduct === cart.idProduct && element.idAccount === cart.idAccount) {
                    await CartServices.updateCart(props.accessToken, element.idProduct, element.quality + cart.count); 
                    ind = index;
                    return;
                }
            })
            if(ind !== -1)    
                listCartRedis.splice(ind, 1);
        })
        await CartServices.addManyMultipleCart(props.accessToken, listCartRedis);
    }

    const handleDeleteKeyCartRedis = async (id) => {
        await CartServices.deleteKeyCartNoLogin(id);
    }

    const handleOnSubmitLogin = async (e) => {
        e.preventDefault();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let test = emailRegex.test(email);

        setValidateEmail("");
        setStyleValidateEmail(false);

        setValidatePassword("");
        setStyleValidatePassword(false);

        let flag = false;

        if(!email) {
            setValidateEmail("Vui lòng nhập trường này!");
            setStyleValidateEmail(true);
            flag = true;
        }

        if(!password) {
            setValidatePassword("Vui lòng nhập trường này!");
            setStyleValidatePassword(true);
            flag = true;
        }

        if(flag)
            return;

        if(test)
        {
            const res = await AccountServices.loginAccount({
                email: email,
                password: password,
            })
            if(res !== undefined)
            {
                const { id } = await MainServices.getIDHardware();
                dispatch(loginAccount(res))
                setEmail("");
                setPassword("");
                setContent("Success");
                setTitle("Đăng nhập thành công!");
                setBool(true);
                setTimeout(() => {
                    navigate("/");
                }, 3000)
                handleUpdateCartWhenLogin(res, id);
                handleDeleteKeyCartRedis(id);
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
        else {
            setValidateEmail("Đây không phải email!");
            setStyleValidateEmail(true);
        }
        
    }

    const handleOnClickExit = () => {
        
    }

    const handleOnCheckbox = (e) => {
        if(e.target.checked === true)
        {
            refInput.current.style.display = "block";
            refButton.current.style.display = "block";
        }
        else
        {
            setCheckPasswordOld(false);
            refInput.current.style.display = "none";
            refButton.current.style.display = "none";
        }
    }


    const handleSubmitChangePassword = async () => {

        setValidatePassword("");
        setStyleValidatePassword(false);

        setValidatePasswordAgain("");
        setStyleValidatePasswordAgain(false);
        let flag = false;

        if(!password) {
            setValidatePassword("Vui lòng nhập trường này!");
            setStyleValidatePassword(true);
            flag = true;
        }

        if(!passwordAgain) {
            setValidatePasswordAgain("Vui lòng nhập trường này!");
            setStyleValidatePasswordAgain(true);
            flag = true;
        }

        if(flag)
            return;
        
        if(password === passwordAgain)
        {
            setBool(false);
            const res = await AccountServices.changePassword({
                id: user._id,
                password
            }, user?.accessToken, axiosJWT)
            if(res === "Success")
            {
                setCheckPasswordOld(false);
                setContent("Success");
                setTitle("Đổi mật khẩu thành công!");
                setBool(true);
            }    
            else
            {
                setContent("Error");
                setTitle("Đổi mật khẩu không thành công!");
                setBool(true);
            }
        }
        else {
            setValidatePassword("Vui lòng nhập mật khẩu trùng!");
            setStyleValidatePassword(true);
            setValidatePasswordAgain("Vui lòng nhập mật khẩu trùng!");
            setStyleValidatePasswordAgain(true);
        }
        
    }

    const handleSubmitCheckPassword = async () => {
        setValidatePassword("");
        setStyleValidatePassword(false);
        let flag = false;

        if(!password) {
            setValidatePassword("Vui lòng nhập trường này!");
            setStyleValidatePassword(true);
            flag = true;
        }
        
        if(flag)
            return;
        
        setBool(false);
        const res = await AccountServices.verifyPasswordAccount({
            id: user._id,
            password
        }, user?.accessToken, axiosJWT)
        if(res === "Success")
        {
            setCheckPasswordOld(true);
            setContent("Success");
            setTitle("Mật khẩu đúng!");
            setBool(true);
        }    
        else
        {
            setContent("Error");
            setTitle("Sai mật khẩu!");
            setBool(true);
        }
    }  

    const handleSubmitDeletePassword = async () => {
        const res2 = await AccountServices.deleteAccount(user?.accessToken, axiosJWT);
        if(res2 === "Success")
        {
            await AccountServices.logoutAccount(user?.accessToken, axiosJWT);
            dispatch(logoutAccount(null));
            setContent("Success");
            setTitle("Xóa tài khoản thành công!");
            setBool(true);
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
    
    return ( 
        <div className={cx("account")}>
            {typeAccount === "detailAccount" ? (
                <div className={cx("account__detail")}>
                    <div className={cx("form")}>
                        <h3 className={cx("heading")}>Thông tin tài khoản</h3>
                        <p className={cx("desc")}>Cùng nhau học lập trình miễn phí tại F8 ❤️</p>
                    
                        <div className={cx("form--group")}>
                            <label htmlFor="userName"className={cx("form--label")}>Tên đầy đủ</label>
                            <input value={user && user.name} type="text" placeholder="VD: Tiến Nguyễn"className={cx("form--control")} onChange={handleOnChangeUserName}/>
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
                                            <input style={{"borderColor": styleValidatePassword ? "#f33a58" : null}} value={password} type="password" placeholder="Nhập mật khẩu" className={cx("form--control")} onChange={handleOnChangePassword}/>
                                            <span style={{"color": styleValidatePassword ? "#f33a58" : null}} className={cx("form--message")}>{validatePassword}</span>
                                        </div>

                                        <div className={cx("form--group")}>
                                            <label htmlFor="passwordAgain" className={cx("form--label")}>Nhập lại mật khẩu</label>
                                            <input style={{"borderColor": styleValidatePasswordAgain ? "#f33a58" : null}} value={passwordAgain} type="password" placeholder="Nhập lại mật khẩu" className={cx("form--control")} onChange={handleOnChangePasswordAgain}/>
                                            <span style={{"color": styleValidatePasswordAgain ? "#f33a58" : null}} className={cx("form--message")}>{validatePasswordAgain}</span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <input style={{"borderColor": styleValidatePassword ? "#f33a58" : null, "display": "none"}} value={password} ref={refInput} type="password" placeholder="Nhập mật khẩu cũ để thay đổi mật khẩu" className={cx("form--control")} onChange={handleOnChangePassword}/>
                                        <span style={{"color": styleValidatePassword ? "#f33a58" : null}} className={cx("form--message")}>{validatePassword}</span>
                                    </>    
                                ) 
                            }
                        </div>
                        {checkPasswordOld ? (
                            <button className={cx("form--submit")} onClick={handleSubmitChangePassword}>
                                Thay đổi mật khẩu
                            </button>
                        ) : (
                            <button ref={refButton} style={{"display": "none"}} className={cx("form--submit")} onClick={handleSubmitCheckPassword}>
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
                            <input style={{"borderColor": styleValidateEmail ? "#f33a58" : null}} value={email} type="text" placeholder="VD: email@domain.com" className={cx("form--control")} onChange={handleOnChangeEmail}/>
                            <span style={{"color": styleValidateEmail ? "#f33a58" : null}} className={cx("form--message")}>{validateEmail}</span>
                        </div>
                    
                        <div className={cx("form--group")}>
                            <label htmlFor="password" className={cx("form--label")}>Mật khẩu</label>
                            <input style={{"borderColor": styleValidatePassword ? "#f33a58" : null}} value={password} type="password" placeholder="Nhập mật khẩu" className={cx("form--control")} onChange={handleOnChangePassword}/>
                            <span style={{"color": styleValidatePassword ? "#f33a58" : null}} className={cx("form--message")}>{validatePassword}</span>
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
                                <input style={{"borderColor": styleValidateName ? "#f33a58" : null}} value={userName} type="text" placeholder="VD: Sơn Đặng"className={cx("form--control")} onChange={handleOnChangeUserName}/>
                                <span style={{"color": styleValidateName ? "#f33a58" : null}} className={cx("form--message")}>{validateName}</span>
                            </div>

                            <div className={cx("form--group")}>
                                <label htmlFor="email" className={cx("form--label")}>Email</label>
                                <input style={{"borderColor": styleValidateEmail ? "#f33a58" : null}} value={email} type="text" placeholder="VD: email@domain.com" className={cx("form--control")} onChange={handleOnChangeEmail}/>
                                <span style={{"color": styleValidateEmail ? "#f33a58" : null}} className={cx("form--message")}>{validateEmail}</span>
                            </div>
                        
                            <div className={cx("form--group")}>
                                <label htmlFor="password" className={cx("form--label")}>Mật khẩu</label>
                                <input style={{"borderColor": styleValidatePassword ? "#f33a58" : null}} value={password} type="password" placeholder="Nhập mật khẩu" className={cx("form--control")} onChange={handleOnChangePassword}/>
                                <span style={{"color": styleValidatePassword ? "#f33a58" : null}} className={cx("form--message")}>{validatePassword}</span>
                            </div>

                            <div className={cx("form--group")}>
                                <label htmlFor="passwordAgain" className={cx("form--label")}>Nhập lại mật khẩu</label>
                                <input style={{"borderColor": styleValidatePasswordAgain ? "#f33a58" : null}} value={passwordAgain} type="password" placeholder="Nhập lại mật khẩu" className={cx("form--control")} onChange={handleOnChangePasswordAgain}/>
                                <span style={{"color": styleValidatePasswordAgain ? "#f33a58" : null}} className={cx("form--message")}>{validatePasswordAgain}</span>
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