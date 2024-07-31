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
import { getDetailsType, getType, getUser } from "~/redux/selector";
import { useDispatch } from "react-redux";
import { loginAccount } from "~/pages/Account/accountSlice";
import {CreateAxios} from "~/Components/CreateInstance/CreateInstance";
import ToastInformation from "~/Components/ToastInfomation/ToastInformation";
import * as MainServices from "~/services/MainServices"

const cx = classNames.bind(styles);

function HomeShop({product, reloadCart, setReloadCart}) {
    const dispatch = useDispatch();
    const user = useSelector(getUser);

    let axiosJWT = CreateAxios(user, dispatch, loginAccount)
    const [nameType, setNameType] = useState("");
    const [boolColorHeart, setBoolColorHeart] = useState(false);
    const [boolColorCompare, setBoolColorCompare] = useState(false);
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const [bool, setBool] = useState(false);
    const listType = useSelector(getType);
    const listDetailsType = useSelector(getDetailsType);

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
    
    const handleOnClickCompare = async (e) => {
        e.preventDefault();
        const { id } = await MainServices.getIDHardware();
        setBool(false);
        setBoolColorCompare(!boolColorCompare)
        const fetchAPI = async () => {
            const res = await CompareServices.getCompare();
            let flag = true;
            res.map(compare => {
                if(user?.accessToken) {
                    if(compare.idProduct === e.target.closest(".homeShop__child__interact__compare--icon--handle").getAttribute("data-id") && compare.idProduct === user._id)
                    {
                        flag = false;
                        setContent("Warn");
                        setTitle("Sản phẩm được thêm vào compare!");
                        setBool(true);
                    }
                }
                else {
                    if(compare.idProduct === e.target.closest(".homeShop__child__interact__compare--icon--handle").getAttribute("data-id") && compare.idHardware === id)
                    {
                        flag = false;
                        setContent("Warn");
                        setTitle("Sản phẩm được thêm vào compare!");
                        setBool(true);
                    }
                }
            })
            if(flag)
            {
                let res;
                if(user?.accessToken)
                    res = await CompareServices.addCompare({idAccount: user._id, idProduct: e.target.closest(".homeShop__child__interact__compare--icon--handle").getAttribute("data-id")});
                else
                    res = await CompareServices.addCompare({idHardware: id, idProduct: e.target.closest(".homeShop__child__interact__compare--icon--handle").getAttribute("data-id")});
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

    const handleOnClickAddCart = async (e) => {
        e.preventDefault();
        const idProductDetails = product._id
        setBool(false);
        let flag = false;
        let count;
        const id = e.target.closest('.homeShop__child__price__icon--handle').getAttribute("data-id");
        if(user?.accessToken)
        {
            const res1 = await CartServices.getCart();
            if(res1.length > 0)
            {
                res1.map((data, index) => {
                    if(data.idProduct?.includes(id))
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
                await CartServices.addCart(user?.accessToken, {idAccount: user._id, idProduct: id, count: 1}, axiosJWT);
                setContent("Success");
                setTitle("Thêm vào giỏ hàng thành công!");
                setBool(true);
                setReloadCart(!reloadCart);
            }
        }
        else{
            const { id } = await MainServices.getIDHardware();
            const data = await CartServices.getCartNoLogin(id);
            const listCartRedis = data.data;
            listCartRedis.map(async (cart, index) => {
                if(cart.idProduct === idProductDetails)
                {
                    flag = true;
                    await CartServices.updateCartNoLogin(id, {idProduct: idProductDetails, count: cart.count + 1}, index);
                    setContent("Success");
                    setTitle("Thêm vào giỏ hàng thành công!");
                    setBool(true);
                    setReloadCart(!reloadCart);
                }
            })
            if(!flag)
            {
                await CartServices.addCartNoLogin(id, {
                    idProduct: idProductDetails, 
                    count: 1
                });
                setContent("Success");
                setTitle("Thêm vào giỏ hàng thành công!");
                setBool(true);
                setReloadCart(!reloadCart);
            }
        }
    }

    useEffect(() => {
        const detailsType = listDetailsType?.find(x => x._id === product?.idDetailsType)
        const typeName = listType?.find(x => x._id === detailsType?.idType);
        setNameType(typeName?.name);
    }, [listType, listDetailsType])
    return ( 
        <a href={"/productDetails/" + product?.slug} className={cx("homeShop__link")}>
            <li className={cx("homeShop", "homeShop--handle", "grid__column-10-2", "grid__column-12-3", "grid__column-12-4", "grid__column-12-6", "grid__column-12-12")}>
                <div className={cx("homeShop__child")}>
                    <div className={cx("homeShop__child__type")}>
                        {nameType}
                    </div>
                        <div className={cx("homeShop__child__name")}>
                        {product?.name}
                    </div>
                    <Image alt="Ảnh" src={product?.image} className={cx("homeShop__child__img")}/>
                    <div className={cx("homeShop__child__price")}>
                        <div className={cx("homeShop__child__price__cost")}>
                            {product?.discount ? (
                                <Fragment>
                                    <div className={cx("homeShop__child__price__cost--sale")}>{product?.discount}</div>
                                    <div className={cx("homeShop__child__price__cost--old")}>{product?.price}</div>
                                </Fragment>
                                ) : (
                                    <div className={cx("homeShop__child__price__cost--default")}>{product?.price}</div>
                            )}
                        </div>
                        <div className={cx("homeShop__child__price__icon", "homeShop__child__price__icon--handle")} data-id={product?._id} onClick={handleOnClickAddCart}>
                            <FontAwesomeIcon icon={faCartArrowDown} className={cx("homeShop__child__price__icon--child")} />
                        </div>
                    </div>
                    <div className={cx("homeShop__child__interact")}>
                        <div className={cx("homeShop__child__interact__wishlist")}>
                            <FontAwesomeIcon style={styleHeart} icon={faHeart} className={cx("homeShop__child__interact__wishlist--icon", "homeShop__child__interact__wishlist--icon--handle")}  onClick={handleOnClickHeart} data-id={product?._id}/>
                            <span className={cx("homeShop__child__interact__wishlist--content")}>wishlist</span>
                        </div>
                        <div className={cx("homeShop__child__interact__compare")}>
                            <FontAwesomeIcon style={styleCompare} icon={faRepeat} className={cx("homeShop__child__interact__compare--icon", "homeShop__child__interact__compare--icon--handle")} onClick={handleOnClickCompare} data-id={product?._id}/>
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