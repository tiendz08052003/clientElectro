import classNames from "classnames/bind";
import styles from "./HeaderBody.module.scss";
import { IconLogo } from "~/Components/Icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faCartShopping, faHeart, faMagnifyingGlass, faRepeat, faSort, faSpinner, faUser, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import HeaderBodyHistory from "./HeaderBodyHistory/HeaderBodyHistory";
import * as SearchServices from "~/services/SearchServices";
import * as AuthServices from "~/services/AuthServices";
import * as SelectionServices from "~/services/SelectionServices";
import * as CartServices from "~/services/CartServices";
import * as ProductServices from "~/services/ProductServices";
import { useDebounce } from "@uidotdev/usehooks";
import { getUser, getContentSearch } from "~/redux/selector";
import { useSelector, useDispatch } from "react-redux";
import {CreateAxios} from "~/Components/CreateInstance/CreateInstance";
import { loginAccount, logoutAccount } from "~/pages/Account/accountSlice";
import { getResultSearch, getConditionSearch, getValueSearch } from "../headerSlice";
import { combineAllCaseSearch } from "~/redux/selector";
import ToastInformation from "~/Components/ToastInfomation/ToastInformation";
import { NavLink } from "react-router-dom";



const cx = classNames.bind(styles);

function HeaderBody({handleOnClickIconMenu, reloadCart}) {
    const [pcWidth, setPcWidth] = useState(true);
    const [onSearch, setOnSearch] = useState(true);
    const [selections, setSelections] = useState([]);
    const [styleHistory, setStyleHistory] = useState(false);
    const [subtotal, setSubtotal] = useState(0);
    const [quality, setQuality] = useState(0);
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const [bool, setBool] = useState(false);
    const contentSearch = useSelector(getContentSearch);
    // set thời gian trả về kết quả của input
    const setTimeValueInPut = useDebounce(contentSearch , 500);
    // set loading 
    const [loading, setLoading] = useState(false);
    
    const searchResult = useSelector(combineAllCaseSearch);
    const user = useSelector(getUser);
    const dispatch = useDispatch();

    let axiosJWT = CreateAxios(user, dispatch, loginAccount)

    useEffect(() => {
        if(window.innerWidth <= 1230)
        {
            setPcWidth(false)
        }
        else
        {
            setPcWidth(true)
        }
    })
    
    useEffect(() => {
        const handleOnReSize = () => {
            if(window.innerWidth <= 1230)
            {
                setPcWidth(false)
            }
            else
            {
                setPcWidth(true)
            }
        }
        
        window.addEventListener("resize", handleOnReSize);
        
        return () => {
            window.removeEventListener('resize', handleOnReSize)
        }
    })

    
    const handleOnClickSearchOnTabletOrMobile = () => {
        if(window.innerWidth < 1230)
            setOnSearch(!onSearch)
    }

    const handleOnFocusSearch = () => {
        setStyleHistory(true);
    }

    const handleOnBlurHistory = (e) => {
        const currentTarget = e.currentTarget;
        // Give browser time to focus the next element
        requestAnimationFrame(() => {
          // Check if the new focused element is a child of the original container
            if (!currentTarget.contains(document.activeElement)) {
                setStyleHistory(false);
                setOnSearch(!onSearch)
        }})
    }

    useEffect(() => {
        // Khi mà mới load searchValue chưa có dữ liệu nó sẽ gán cho mảng rỗng
        if(!setTimeValueInPut.trim())
        {
            dispatch(getResultSearch([]));
            return;
        }
        setLoading(true);
        const fetchAPI = async () => {
            const result = await SearchServices.search(setTimeValueInPut);
            dispatch(getResultSearch(result));
            setLoading(false);
        }
        fetchAPI();
    }, [setTimeValueInPut])

    const handleOnChangeValueInput = (e) => {
        dispatch(getValueSearch(e.target.value))
    }

    const handleOnClickLogout = () => {
        setBool(false);
        const fetchAPI = async () => {
            const res = await AuthServices.logoutAuth(user?.accessToken, axiosJWT);
            dispatch(logoutAccount(null));
            if(res === "Success")
            {
                setContent("Success");
                setTitle("Logout thành công!");
                setBool(true);
            }
            else
            {
                setContent("Error");
                setTitle("Logout thất bại!");
                setBool(true);
            }
        }        
        fetchAPI();
    }

    useEffect(() => {
        const fetchAPI = async () => {
            const res = await SelectionServices.getSelection();
            setSelections(res)
        }
        fetchAPI();
    }, [])

    const handleOnChangeValue = (e) => {
        dispatch(getConditionSearch(e.target.value))
    }

    useEffect(() => {
        if (user?.accessToken)
        {
            const fetchAPI1 = async () => {
                const res1 = await ProductServices.shop();
                const fetchAPI2 = async () => {
                    const res2 = await CartServices.getCart();
                    let sum = 0;
                    res2.map(childCart => {
                        res1.map(childProduct => {
                            if(childCart.idProduct === childProduct._id)
                            {
                                sum += childProduct.price * childCart.count - childProduct.discount;
                            }
                        })
                    })
                    setSubtotal(sum);
                    setQuality(res2.length);
                }
                fetchAPI2();
            }
            fetchAPI1();
        }
    }, [reloadCart])


    return ( 
        <div className={cx("header__middle")}>
            <div className={cx("wrapper")}>
                <div className={cx("header__middle__child")}>
                    {!pcWidth ? (
                        <div className={cx("header__middle__child__menu")} onClick={handleOnClickIconMenu}>
                            <FontAwesomeIcon icon={faBars} />
                        </div>
                    ) : ""}
                    <a href="/">
                        <div className={cx("header__middle__child__logo")}>
                            <IconLogo className={cx("header__middle__child__logo__child")}/>
                        </div>
                    </a>
                    <div className={cx("header__middle__child__search", "header__middle__child__search--handle")}>
                        {
                            !pcWidth ? (
                                !onSearch &&
                                    <div className={cx("header__middle__child__search__child")} tabIndex={100} onFocus={handleOnFocusSearch} onBlur={handleOnBlurHistory}>
                                        <input type="text" placeholder="Search for Products" className={cx("header__middle__child__search__child__input", "header__middle__child__search__child__input--handle")} value={contentSearch} onChange={handleOnChangeValueInput}/>
                                        {
                                            searchResult.products?.length !== 0 ? (
                                                <NavLink to="/?type=searchProducts" className={cx("link-href")} onClick={handleOnClickSearchOnTabletOrMobile}>
                                                    <FontAwesomeIcon icon={faMagnifyingGlass} className={cx("header__middle__child__search__child__search")}/>
                                                </NavLink>    
                                            ) : (
                                                <FontAwesomeIcon icon={faMagnifyingGlass} className={cx("header__middle__child__search__child__search")}/>
                                            )
                                        }
                                        {loading && (
                                            <div className={cx("header__middle__child__search__child__icon")}>
                                                <FontAwesomeIcon icon={faSpinner} className={cx("header__middle__child__search__child__icon__child")}/>
                                            </div>
                                        )}
                                        {styleHistory && (
                                            <div className={cx("header__middle__child__search__child__history")}>
                                                <ul className={cx("header__middle__child__search__child__history__haveHis")}>
                                                    {searchResult.products?.length === 0 ? <HeaderBodyHistory result={undefined} /> : searchResult.products.map((result, index) => {
                                                        if(index < 5)
                                                        {
                                                            return (
                                                                <a key={index} href={"/productDetails?id=" + result._id} className={cx("link-href")}>
                                                                    <HeaderBodyHistory key={index} result={result}/>
                                                                </a>
                                                            )
                                                        }
                                                    })}
                                                </ul>
                                                {searchResult.products?.length > 5 && (
                                                    <NavLink to="/?type=searchProduct" className={cx("link-href")}>
                                                        <div className={cx("header__middle__child__search__child__history__result")} >Xem thêm {searchResult.products?.length - 5} kết quả</div>
                                                    </NavLink>
                                                )}
                                            </div>
                                        )}
                                    </div>
                            ) : (
                                <div className={cx("header__middle__child__search__child")} tabIndex={100} onFocus={handleOnFocusSearch} onBlur={handleOnBlurHistory}>
                                    <input type="text" placeholder="Search for Products" className={cx("header__middle__child__search__child__input")} value={contentSearch} onChange={handleOnChangeValueInput}/>
                                    {loading && (
                                        <div className={cx("header__middle__child__search__child__icon")}>
                                            <FontAwesomeIcon icon={faSpinner} className={cx("header__middle__child__search__child__icon__child")}/>
                                        </div>
                                    )}
                                    {styleHistory && (
                                        <div className={cx("header__middle__child__search__child__history")}>
                                            <ul className={cx("header__middle__child__search__child__history__haveHis")}>
                                                {searchResult.products?.length === 0 ? <HeaderBodyHistory result={undefined} /> : searchResult.products.map((result, index) => {
                                                    if(index < 5)
                                                    {
                                                        return (
                                                            <a key={index} href={"/productDetails?id=" + result._id} className={cx("link-href")}>
                                                                <HeaderBodyHistory key={index} result={result}/>
                                                            </a>
                                                        )
                                                    }
                                                })}
                                            </ul>
                                            {searchResult.products?.length > 5 && (
                                                <NavLink to="/?type=searchProduct" className={cx("link-href")}>
                                                    <div className={cx("header__middle__child__search__child__history__result")} >Xem thêm {searchResult.products?.length - 5} kết quả</div>
                                                </NavLink>
                                            )}
                                        </div>
                                    )}
                                </div>                                
                            )
                        }
                        <div className={cx("header__middle__child__search__sort")}>
                            <select name="orderby" className={cx("header__middle__child__search__sort__selec")} aria-label="Shop order" fdprocessedid="rwrbl" onChange={handleOnChangeValue}>
                                <option className={cx("header__middle__child__search__sort__selec--child")} value="" defaultValue>All Categories</option>
                                {selections?.map((selection) => <option key={selection._id} className={cx("header__middle__child__search__sort__selec--child")} value={selection._id}>{selection.name}</option>)}
                            </select>
                        </div>
                        <div className={cx("header__middle__child__search__search")}>
                            {!pcWidth ? (onSearch ? <FontAwesomeIcon icon={faMagnifyingGlass} className={cx("header__middle__child__search__search--iconSearch")} onClick={handleOnClickSearchOnTabletOrMobile}/> : <FontAwesomeIcon icon={faXmark} className={cx("header__middle__child__search__search--iconExit")} onClick={handleOnClickSearchOnTabletOrMobile}/>) : 
                            (
                                searchResult.products?.length !== 0 ? (
                                    <NavLink to="/?type=searchProducts" className={cx("link-href")}>
                                        <FontAwesomeIcon icon={faMagnifyingGlass} className={cx("header__middle__child__search__search--iconSearch")}/>
                                    </NavLink>    
                                ) : (
                                    <FontAwesomeIcon icon={faMagnifyingGlass} className={cx("header__middle__child__search__search--iconSearch")}/>
                                )
                            )}
                        </div>
                    </div>
                    <div className={cx("header__middle__child__selec")}>
                        <a href="/compare" className={cx("link-href")}>
                            <div className={cx("header__middle__child__selec__compare")}>
                                <FontAwesomeIcon icon={faRepeat} className={cx("header__middle__child__selec__icon")}/>
                                <div className={cx("header__middle__child__selec__compare__hover")}>Compare</div>                                          
                            </div>
                        </a>
                        <a href="/wishlist" className={cx("link-href")}>
                            <div className={cx("header__middle__child__selec__heart")}>
                                <FontAwesomeIcon icon={faHeart} className={cx("header__middle__child__selec__icon")}/>
                                <div className={cx("header__middle__child__selec__heart__hover")}>Wishlist</div>                                        
                            </div>
                        </a>
                        {!pcWidth ? (
                            <a href="/account?type=login" className={cx("link-href")}>
                                <div className={cx("header__middle__child__selec__acc")}>
                                    <FontAwesomeIcon icon={faUser} className={cx("header__middle__child__selec__icon")}/>
                                </div>
                            </a>
                        ):(
                            <div className={cx("header__middle__child__selec__acc")}>
                                <FontAwesomeIcon icon={faUser} className={cx("header__middle__child__selec__icon")}/>
                                    { user === null ? (
                                        <div className={cx("header__middle__child__selec__acc__hover")}>
                                            <a href="/account?type=login" className={cx("link-href")}>
                                                <div className={cx("header__middle__child__selec__acc__hover__login")}>
                                                    Đăng nhập
                                                </div>
                                            </a>
                                            <a href="/account?type=register" className={cx("link-href")}>
                                                <div className={cx("header__middle__child__selec__acc__hover__register")}>
                                                    Đăng ký
                                                </div>
                                            </a>
                                        </div>       
                                    ) : (
                                        <div className={cx("header__middle__child__selec__acc__hover")}>
                                            <div className={cx("header__middle__child__selec__acc__hover__userName")}>
                                                {user.userName}
                                            </div>
                                            <div className={cx("header__middle__child__selec__acc__hover__info")}>
                                                Thông tin cá nhân
                                            </div>
                                            <div className={cx("header__middle__child__selec__acc__hover__logout")} onClick={handleOnClickLogout}>
                                                logout
                                            </div>
                                        </div> 
                                    )}
                            </div>
                        )}
                        <a href="/cart" className={cx("link-href")}>
                            <div className={cx("header__middle__child__selec__cart")} >
                                <div className={cx("header__middle__child__selec__cart__icon")}>
                                    <FontAwesomeIcon icon={faCartShopping} className={cx("header__middle__child__selec__icon")}/>
                                    <div className={cx("header__middle__child__selec__cart__icon__quality")}>{quality}</div>
                                </div>
                                <span className={cx("header__middle__child__selec__cart__content")}>{subtotal}</span>
                                <div className={cx("header__middle__child__selec__cart__hover")}>Cart</div>
                            </div>
                        </a>
                    </div>
                    {bool && <ToastInformation content={content} title={title} bool={bool} setBool={setBool}/>}
                </div>
            </div>
        </div>
     );
}

export default HeaderBody;