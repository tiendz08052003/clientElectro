import classNames from "classnames/bind";
import style from "./ProductDetails.module.scss"
import { faCaretDown, faCaretUp, faCartArrowDown, faHeart, faMagnifyingGlassPlus, faMinus, faRepeat, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { imgs } from "~/assest/imgs";
import Image from "~/Components/Image/Image";
import { IconLink, IconNext } from "~/Components/Icons";
import { Fragment, useEffect, useState } from "react";
import * as ProductServices from '~/services/ProductServices';
import * as TypeServices from '~/services/TypeServices';
import * as CartServices from '~/services/CartServices';
import * as WishlistServices from '~/services/WishlistServices';
import * as CompareServices from '~/services/CompareServices';
import { useSelector, useDispatch } from "react-redux";
import { getUser } from "~/redux/selector";
import {CreateAxios} from "~/Components/CreateInstance/CreateInstance";
import { loginAccount } from "../Account/accountSlice";
import ToastInformation from "~/Components/ToastInfomation/ToastInformation";

const cx = classNames.bind(style);

function ProductDetails() {
    const x = new URLSearchParams(window.location.search);

    const user = useSelector(getUser);
    const dispatch = useDispatch();

    let axiosJWT = CreateAxios(user, dispatch, loginAccount)

    const [quality, setQuality] = useState(1);
    const [boolColorHeart, setBoolColorHeart] = useState(false);
    const [boolColorCompare, setBoolColorCompare] = useState(false);
    const [productDetails, setProductDetails] = useState({});
    const [nameType, setNameType] = useState("");
    const [img, setImg] = useState({});
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const [bool, setBool] = useState(false);

    let styleScreen;

    const styleHeart = {
        color: boolColorHeart ? "var(--red-color)" : "black"
    }

    const styleCompare = {
        color: boolColorCompare ? "var(--red-color)" : "black"
    }

    const handleOnClickHeart = (e) => {
        if(user?.accessToken) {
            setBoolColorHeart(!boolColorHeart);
            const fetchAPI = async () => {
                const res = await WishlistServices.getWishlist();
                let flag = true;
                res.map(wishlist => {
                    if(wishlist.idProduct === e.target.closest(".productdetails__child__right__avancInfo__interact__wishlist--icon--handle").getAttribute("data-id"))
                    {
                        flag = false;
                    }
                })
                if(flag)
                {
                    const fetchAPI2 = async () => {
                        await WishlistServices.addWishlist({idProduct: e.target.closest(".productdetails__child__right__avancInfo__interact__wishlist--icon--handle").getAttribute("data-id")}, user?.accessToken, axiosJWT);
                    }
                    fetchAPI2();
                }
            }   
            fetchAPI();
        }
    }


    const handleOnClickCompare = (e) => {
        setBoolColorCompare(!boolColorCompare);
        const fetchAPI = async () => {
            const res = await CompareServices.getCompare();
            let flag = true;
            res.map(compare => {
                if(compare.idProduct === e.target.closest(".productdetails__child__right__avancInfo__interact__compare--icon--handle").getAttribute("data-id"))
                {
                    flag = false;
                }
            })
            if(flag)
            {
                const fetchAPI2 = async () => {
                    await CompareServices.addCompare({idProduct: e.target.closest(".productdetails__child__right__avancInfo__interact__compare--icon--handle").getAttribute("data-id")});
                }
                fetchAPI2();
            }
        }
        fetchAPI();
    }

    useEffect(() => {
        if(window.innerWidth >= 1230)
            styleScreen = "pc";
        else if(window.innerWidth >= 930 && window.innerWidth < 1230)
            styleScreen = "tablet";
        else if(window.innerWidth >= 630 && window.innerWidth < 930)
            styleScreen = "mobile";
        else if(window.innerWidth >= 430 && window.innerWidth < 630)
            styleScreen = "mobileSmall";
        else
            styleScreen = "maxMobileSmall";
    })

    useEffect(() => {
        const handleOnReSize = () => {
            if(window.innerWidth >= 1230)
                styleScreen = "pc";
            else if(window.innerWidth >= 930 && window.innerWidth < 1230)
                styleScreen = "tablet";
            else if(window.innerWidth >= 630 && window.innerWidth < 930)
                styleScreen = "mobile";
            else if(window.innerWidth >= 430 && window.innerWidth < 630)
                styleScreen = "mobileSmall";
            else
                styleScreen = "maxMobileSmall";
        }
        window.addEventListener("resize", handleOnReSize);
        
        return () => {
            window.removeEventListener('resize', handleOnReSize)
        }
    })

    const handleOnMouseMoveImage = (e) => {
        let x;
        let y;
        if(styleScreen === "pc")
        {
            x = e.clientX - e.target.offsetLeft - 230;
            y = e.clientY - e.target.offsetTop - 230;    
        }
        else
        {
            x = e.clientX - e.target.offsetLeft;
            y = e.clientY - e.target.offsetTop;
        }
        setImg({
            transformOrigin: `${x}px ${y}px`,
            transform: "scale(1.5)"
        })
    }

    const handleOnMouseLeaveImage = () => {
        setImg({
            transformOrigin: "center",
            transform: "scale(1)"
        })
    }

    useEffect(() => {
        const idProductDetails = x.get("id");
        let product = {};
        let type;
        const fetchAPI1 = async () => {
            const res1 = await ProductServices.shop();
            // eslint-disable-next-line react-hooks/exhaustive-deps
            res1.map(x => {
                if(x._id === idProductDetails)
                     product = x
            })
            const fetchAPI2 = async () => {
                const res2 = await TypeServices.getType();
                res2.map(x => {
                    if(x._id === product.idType)
                    {
                        type = x.name;
                    }
                })
                setNameType(type);
                setProductDetails(product)
            }

            fetchAPI2();
        }

        fetchAPI1();
    }, [])


    const handleOnChangeValueQuality = (e) => {
        if(e.target.value > 0 || e.target.value === "")
        {
            setQuality(e.target.value);
        }
    }

    const handleOnClickUpQuality = (e) => {
        setQuality(Number(quality) + 1);
    }

    const handleOnClickDownQuality = (e) => {
        if(quality !== 1)
        {
            setQuality(Number(quality) - 1);
        }
    }

    const handleOnClickAddCart = () => {
        setBool(false);
        let flag = false;
        const idProductDetails = x.get("id");
        const fetchAPI1 = async () => {
            const res = await CartServices.getCart()
            if(user?.accessToken)
            {
                res.map(cart => {
                    if(cart.idProduct === idProductDetails)
                    {
                        flag = true;
                        const fetchAPI2 = async () => { 
                            await CartServices.updateCart(user?.accessToken, cart._id, Number(quality) + cart.count, axiosJWT); 
                            setContent("Success");
                            setTitle("Thêm vào giỏ hàng thành công!");
                            setBool(true);
                        }
                        fetchAPI2();
                    }
                })
                if(flag === false)
                {
                    const fetchAPI2 = async () => {
                        await CartServices.addCart(user?.accessToken, {idProduct: idProductDetails, count: 1}, axiosJWT);
                        setContent("Success");
                        setTitle("Thêm vào giỏ hàng thành công!");
                        setBool(true);
                    } 
                    fetchAPI2();
                }
            }
            else
            {
                setTimeout(() => {
                    setContent("Warn");
                    setTitle("Bạn phải đăng nhập để thêm giỏ hàng!");
                    setBool(true);
                }, 300)
            }
        }
        fetchAPI1();
    }

    return ( 
        <div className={cx("productDetails", "grid__column-10", "grid__column-12")}>
            <div className={cx("productDetails__child", "grid__row")}>
                <div className={cx("productDetails__child__left", "grid__column-10-4", "grid__column-12-12")}>
                    <div className={cx("productDetails__child__left__img")} onMouseMove={handleOnMouseMoveImage} onMouseLeave={handleOnMouseLeaveImage}>
                        <Image style={img} alt="ảnh chi tiết sản phẩm" src={productDetails.image} className={cx("productDetails__child__left__img__child")} />
                        <div className={cx("productDetails__child__left__img__icon")}>
                            <FontAwesomeIcon icon={faMagnifyingGlassPlus} className={cx("productDetails__child__left__img__icon__child")} />
                        </div>
                    </div>
                </div>
                <div className={cx("productDetails__child__right", "grid__column-10-6", "grid__column-12-12")}>
                    <div className={cx("productDetails__child__right__BaseInfo")}>
                        <div className={cx("productDetails__child__right__BaseInfo__type")}>{nameType}</div>
                        <div className={cx("productDetails__child__right__BaseInfo__name")}>{productDetails.name}</div>
                        <div className={cx("productDetails__child__right__BaseInfo__rate")}>
                            <FontAwesomeIcon icon={faStar} style={{color: "#fed700"}}/>
                            <FontAwesomeIcon icon={faStar} style={{color: "#fed700"}}/>
                            <FontAwesomeIcon icon={faStar} style={{color: "#fed700"}}/>
                            <FontAwesomeIcon icon={faStar} style={{color: "#fed700"}}/>
                            <FontAwesomeIcon icon={faStar} style={{color: "#fed700"}}/>
                            <span className={cx("productDetails__child__right__BaseInfo__rate__content")}>(1 customer review)</span>
                        </div>
                        <div className={cx("productDetails__child__right__BaseInfo__bought")}>
                            Availability: 
                            <strong style={{color: "#198754", opacity: 1, marginLeft: "5px"}}>42 in stock</strong>
                        </div>
                    </div>
                    <div className={cx("productDetails__child__right__avancInfo")}>
                        <div className={cx("productDetails__child__right__avancInfo__interact")}>
                            <div className={cx("productDetails__child__right__avancInfo__interact__wishlist")}>
                                <FontAwesomeIcon style={styleHeart} icon={faHeart} className={cx("productDetails__child__right__avancInfo__interact__wishlist--icon", "productDetails__child__right__avancInfo__interact__wishlist--icon--handle")} onClick={handleOnClickHeart} data-id={productDetails._id}/>
                                <span className={cx("productDetails__child__right__avancInfo__interact__wishlist--content")}>wishlist</span>
                            </div>
                            <div className={cx("productDetails__child__right__avancInfo__interact__compare")}>
                                <FontAwesomeIcon style={styleCompare} icon={faRepeat} className={cx("productDetails__child__right__avancInfo__interact__compare--icon", "productDetails__child__right__avancInfo__interact__compare--icon--handle")} onClick={handleOnClickCompare} data-id={productDetails._id}/>
                                <span className={cx("productDetails__child__right__avancInfo__interact__compare--content")}>compare</span>
                            </div>
                        </div>
                        <ul className={cx("productDetails__child__right__avancInfo__info")}>
                            {productDetails.introduce?.map((introduce, index) => (
                                <li key={index} className={cx("productDetails__child__right__avancInfo__info--child")}>{introduce}</li>
                            ))}
                        </ul>
                        <div className={cx("productDetails__child__right__avancInfo__price")}>
                            {
                                productDetails.discount ? (
                                <Fragment>
                                    <div className={cx("productDetails__child__right__avancInfo__price--sale")}>
                                        {productDetails?.discount}
                                    </div>
                                    <div className={cx("productDetails__child__right__avancInfo__price--discount")}>
                                        {productDetails?.price}
                                    </div>
                                </Fragment>
                                ) : (
                                    <div className={cx("productDetails__child__right__avancInfo__price--default")}>
                                        {productDetails?.price}
                                    </div>
                                )
                            }
                        </div>
                        <div className={cx("productDetails__child__right__avancInfo__quality")}>
                            <input type="number" value={quality} className={cx("productDetails__child__right__avancInfo__quality__input")} onChange={handleOnChangeValueQuality}/>
                            <div className={cx("productDetails__child__right__avancInfo__quality__upDown")}>
                                <FontAwesomeIcon icon={faCaretUp} className={cx("productDetails__child__right__avancInfo__quality__upDown__iconUp", "productDetails__child__right__avancInfo__quality__upDown__iconUp--handle")} onClick={handleOnClickUpQuality}/>
                                <FontAwesomeIcon icon={faCaretDown} className={cx("productDetails__child__right__avancInfo__quality__upDown__iconDown", "productDetails__child__right__avancInfo__quality__upDown__iconDown--handle")} onClick={handleOnClickDownQuality}/>
                            </div>
                        </div>
                        <div className={cx("productDetails__child__right__avancInfo__pay")}>
                            <a href="./" className={cx("productDetails__child__right__avancInfo__pay__link--link")}>
                                <div className={cx("productDetails__child__right__avancInfo__pay__link")}>
                                    pay with
                                    <IconLink className={cx("productDetails__child__right__avancInfo__pay__link__letter")} /> 
                                    <IconNext className={cx("productDetails__child__right__avancInfo__pay__link__arrow")} />
                                </div>
                            </a>
                            <div className={cx("productDetails__child__right__avancInfo__pay__or")}>
                                <FontAwesomeIcon icon={faMinus} className={cx("productDetails__child__right__avancInfo__pay__or--icon")} />
                                <span className={cx("productDetails__child__right__avancInfo__pay__or--content")}>OR</span>
                                <FontAwesomeIcon icon={faMinus} className={cx("productDetails__child__right__avancInfo__pay__or--icon")} />
                            </div>
                            <div className={cx("productDetails__child__right__avancInfo__pay__add")} onClick={handleOnClickAddCart}>
                                <FontAwesomeIcon icon={faCartArrowDown} className={cx("productDetails__child__right__avancInfo__pay__add--icon")} style={{color: "white"}}/> 
                                <strong>Add to cart</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {bool && <ToastInformation content={content} title={title} bool={bool} setBool={setBool}/>}
        </div>
     );
}

export default ProductDetails;