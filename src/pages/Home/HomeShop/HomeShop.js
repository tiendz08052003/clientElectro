import classNames from "classnames/bind";
import styles from "./HomeShop.module.scss";
import Image from "~/Components/Image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartArrowDown, faHeart, faRepeat} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState, memo, Fragment } from "react";
import * as CartServices  from "~/services/CartServices";
import * as WishlistServices  from "~/services/WishlistServices";
import * as CompareServices  from "~/services/CompareServices";
import { useSelector } from "react-redux";
import { getSelection, getType, getUser } from "~/redux/selector";
import { useDispatch } from "react-redux";
import { loginAccount } from "~/pages/Account/accountSlice";
import {CreateAxios} from "~/Components/CreateInstance/CreateInstance";
import ToastInformation from "~/Components/ToastInfomation/ToastInformation";

const cx = classNames.bind(styles);

function HomeShop({result, reloadCart, setReloadCart}) {
    const dispatch = useDispatch();
    
    const user = useSelector(getUser);
    let axiosJWT = CreateAxios(user, dispatch, loginAccount)

    const [type, setType] = useState("");
    const [boolColorHeart, setBoolColorHeart] = useState(false);
    const [boolColorCompare, setBoolColorCompare] = useState(false);
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const [bool, setBool] = useState(false);
    const listSelection = useSelector(getSelection);
    const listType = useSelector(getType);

    const styleHeart = {
        color: boolColorHeart ? "var(--red-color)" : "black",
    }

    const styleCompare = {
        color: boolColorCompare ? "var(--red-color)" : "black",
    }

    const handleOnClickHeart = (e) => {
        e.preventDefault();
        setBool(false);
        if(user?.accessToken) {
            setBoolColorHeart(!boolColorHeart);
            const fetchAPI = async () => {
                const res = await WishlistServices.getWishlist();
                let flag = true;
                res.map(wishlist => {
                    if(wishlist.idProduct === e.target.closest(".homeShop__child__interact__wishlist--icon--handle").getAttribute("data-id"))
                    {
                        flag = false;
                        setContent("Warn");
                        setTitle("Sản phẩm đã được thêm vào wishlist!");
                        setBool(true);
                    }
                })
                if(flag)
                {
                    await WishlistServices.addWishlist({idProduct: e.target.closest(".homeShop__child__interact__wishlist--icon--handle").getAttribute("data-id")}, user?.accessToken, axiosJWT);
                    setContent("Success");
                    setTitle("Thêm vào wishlist thành công!");
                    setBool(true);
                }
            }
            fetchAPI();
        }
        else
        {
            setTimeout(() => {
                setContent("Warn");
                setTitle("Bạn phải đăng nhập để thêm vào wishlist!");
                setBool(true);
            }, 300)
        }
    }
    
    const handleOnClickCompare = (e) => {
        e.preventDefault();
        setBool(false);
        setBoolColorCompare(!boolColorCompare)
        const fetchAPI = async () => {
            const res = await CompareServices.getCompare();
            let flag = true;
            res.map(compare => {
                if(compare.idProduct === e.target.closest(".homeShop__child__interact__compare--icon--handle").getAttribute("data-id"))
                {
                    flag = false;
                    setContent("Warn");
                    setTitle("Sản phẩm được thêm vào compare!");
                    setBool(true);
                }
            })
            if(flag)
            {
                const res = await CompareServices.addCompare({idProduct: e.target.closest(".homeShop__child__interact__compare--icon--handle").getAttribute("data-id")});
                if(res === "Success")
                {
                    setContent("Success");
                    setTitle("Thêm vào compare thành công!");
                    setBool(true);
                }
                else
                {
                    setContent("Error");
                    setTitle("Thêm vào compare thất bại!");
                    setBool(true);
                }
            }
        }
        fetchAPI();
    }

    const handleOnClickAddCart = (e) => {
        e.preventDefault();
        setBool(false);
        let flag = false;
        let count;
        const id = e.target.closest('.homeShop__child__price__icon--handle').getAttribute("data-id");
        if(user?.accessToken)
        {
            const fetchAPI = async () => {
                
                const res1 = await CartServices.getCart();
                if(res1.length > 0)
                {
                    res1.map((data, index) => {
                        if(data.idProduct.includes(id))
                        {
                            flag = true;
                            const fetchAPI1 = async () => {
                                count = data.count + 1;
                                await CartServices.updateCart(user?.accessToken, data._id, count, axiosJWT);
                                setContent("Success");
                                setTitle("Thêm vào giỏ hàng thành công!");
                                setBool(true);
                                setReloadCart(!reloadCart);
                            }
                            fetchAPI1();
                        }
                    })
                }
                if(flag === false)
                {
                    await CartServices.addCart(user?.accessToken, {idAuth: user._id, idProduct: id, count: 1}, axiosJWT);
                    setContent("Success");
                    setTitle("Thêm vào giỏ hàng thành công!");
                    setBool(true);
                    setReloadCart(!reloadCart);
                }
            }
            fetchAPI();
        }
        else{
            setTimeout(() => {
                setContent("Warn");
                setTitle("Bạn phải đăng nhập để thêm giỏ hàng!");
                setBool(true);
            }, 300)
        }
    }

    useEffect(() => {
        let typeProduct;
        if(result.idType === "")
        {
            const fetchAPI = async () => {
                listSelection.map(data => {
                    if(data._id === result.idSelection)
                    {
                        typeProduct = data.name;
                    }
                })
                setType(typeProduct);
            }
            fetchAPI();
        }
        else
        {
            if(listType)
            {
                const fetchAPI = async () => {
                    listType.map(data => {
                        if(data._id === result.idType)
                        {
                            typeProduct = data.name;
                        }
                    })
                    setType(typeProduct);
                }
                fetchAPI();
            }
        }
    }, [listType])
    
    return ( 
        <a href={"/productDetails/" + result.slug} className={cx("homeShop__link")}>
            <li className={cx("homeShop", "homeShop--handle", "grid__column-10-2", "grid__column-12-3", "grid__column-12-4", "grid__column-12-6", "grid__column-12-12")}>
                <div className={cx("homeShop__child")}>
                    <div className={cx("homeShop__child__type")}>
                        {type}
                    </div>
                        <div className={cx("homeShop__child__name")}>
                        {result.name}
                    </div>
                    <Image alt="Ảnh" src={result.image} className={cx("homeShop__child__img")}/>
                    <div className={cx("homeShop__child__price")}>
                        <div className={cx("homeShop__child__price__cost")}>
                            {result.discount ? (
                                <Fragment>
                                    <div className={cx("homeShop__child__price__cost--sale")}>{result.discount}</div>
                                    <div className={cx("homeShop__child__price__cost--old")}>{result.price}</div>
                                </Fragment>
                                ) : (
                                    <div className={cx("homeShop__child__price__cost--default")}>{result.price}</div>
                            )}
                        </div>
                        <div className={cx("homeShop__child__price__icon", "homeShop__child__price__icon--handle")} data-id={result._id} onClick={handleOnClickAddCart}>
                            <FontAwesomeIcon icon={faCartArrowDown} className={cx("homeShop__child__price__icon--child")} />
                        </div>
                    </div>
                    <div className={cx("homeShop__child__interact")}>
                        <div className={cx("homeShop__child__interact__wishlist")}>
                            <FontAwesomeIcon style={styleHeart} icon={faHeart} className={cx("homeShop__child__interact__wishlist--icon", "homeShop__child__interact__wishlist--icon--handle")}  onClick={handleOnClickHeart} data-id={result._id}/>
                            <span className={cx("homeShop__child__interact__wishlist--content")}>wishlist</span>
                        </div>
                        <div className={cx("homeShop__child__interact__compare")}>
                            <FontAwesomeIcon style={styleCompare} icon={faRepeat} className={cx("homeShop__child__interact__compare--icon", "homeShop__child__interact__compare--icon--handle")} onClick={handleOnClickCompare} data-id={result._id}/>
                            <span className={cx("homeShop__child__interact__compare--content")}>compare</span>
                        </div>
                    </div>  
                </div>
            </li>
            {bool && <ToastInformation content={content} title={title} bool={bool} setBool={setBool}/>}
        </a>
     );
}

export default memo(HomeShop);