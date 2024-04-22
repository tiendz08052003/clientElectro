import classNames from "classnames/bind";
import styles from "./Home.module.scss";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight, faArrowRight, faBars, faFilter, faList } from "@fortawesome/free-solid-svg-icons";
import HomeShop from "./HomeShop";
import { Fragment, useEffect, useRef, useState, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { combineAllCaseSearch, combineAllCaseShop, getProduct, getQualities } from "~/redux/selector";
import { getNumberPage, getQuality, getTypeSort } from "./homeSlice";

const cx = classNames.bind(styles);

function Home({ handleOnClickFilterOnTabletOrMobile, reloadCart, setReloadCart}) {
    const $ = document.querySelector.bind(document);

    const x = new URLSearchParams(window.location.search);
    const typeHome = x.get("type");

    const dispatch = useDispatch();
    const products = useSelector(combineAllCaseShop);
    const searchProducts = useSelector(combineAllCaseSearch);
    const quality = useSelector(getQualities);

    const [pcWidth, setPcWidth] = useState(true);
    const [numberPage, setNumberPage] = useState(1);
    const [productDetails, setProductDetails] = useState({});
    const [circleFirst, setCircleFirst] = useState({});
    const [circleSecond, setCircleSecond] = useState({});
    const [circleThird, setCircleThird] = useState({});
    const [listNumberPage, setListNumberPage] = useState([]);
    const listProducts = useSelector(getProduct);

    let styleScreen;
    let cartUl;
    let sum = useRef(0);
    let activeNextBack = useRef(0);

    useEffect(() => {
        // dùng childElementCount để đếm số phần tử cong trong thẻ ul
        cartUl = $(".home__child__product--handle");
    })

    const handleOnChangeNumberPage = (e) => {
        (e.target.value === "" || (e.target.value <= listNumberPage.length && e.target.value >= 1)) && setNumberPage(e.target.value);
    }

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
            sum.current = 0;
            setProductDetails({ 
                transform: `translateX(${sum.current}%) translateX(0px)`
            })

            setCircleFirst( {
                flex: "2",
                backgroundColor: "#fed700",
                borderRadius: "2.2rem"
            })
            setCircleSecond( {
                flex: "1",
                backgroundColor: "#ddd",
                borderRadius: "50%",
            })
            setCircleThird( {
                flex: "1",
                backgroundColor: "#ddd",
                borderRadius: "50%",
            })
        }
        
        window.addEventListener("resize", handleOnReSize);
        
        return () => {
            window.removeEventListener('resize', handleOnReSize)
        }
    })

    const handleOnClickBackItem = () => {
        if(styleScreen === "maxMobileSmall")
        {
            sum.current += 100;
            if(sum.current > 0)
            {
                sum.current = 0;
            }
            if(Math.round(sum.current / -100) !== 0 && Math.round(sum.current / -100) <= activeNextBack.current / 2)
            {
                setCircleFirst( {
                    flex: "1",
                    backgroundColor: "#ddd",
                    borderRadius: "50%",
                })
                setCircleSecond( {
                    flex: "2",
                    backgroundColor: "#fed700",
                    borderRadius: "2.2rem"
                })
                setCircleThird( {
                    flex: "1",
                    backgroundColor: "#ddd",
                    borderRadius: "50%",
                })
            }
            else if(Math.round(sum.current / -100) === 0){
                setCircleFirst( {
                    flex: "2",
                    backgroundColor: "#fed700",
                    borderRadius: "2.2rem"
                })
                setCircleSecond( {
                    flex: "1",
                    backgroundColor: "#ddd",
                    borderRadius: "50%",
                })
                setCircleThird( {
                    flex: "1",
                    backgroundColor: "#ddd",
                    borderRadius: "50%",
                })
            }
        }
        else if(styleScreen === "mobileSmall")
        {
            sum.current += 50;
            if(sum.current > 0)
            {
                sum.current = 0;
            }
            if(Math.round(sum.current / -50) !== 0 && Math.round(sum.current / -50) <= activeNextBack.current / 2)
            {
                setCircleFirst( {
                    flex: "1",
                    backgroundColor: "#ddd",
                    borderRadius: "50%",
                })
                setCircleSecond( {
                    flex: "2",
                    backgroundColor: "#fed700",
                    borderRadius: "2.2rem"
                })
                setCircleThird( {
                    flex: "1",
                    backgroundColor: "#ddd",
                    borderRadius: "50%",
                })
            }
            else if(Math.round(sum.current / -50) === 0){
                setCircleFirst( {
                    flex: "2",
                    backgroundColor: "#fed700",
                    borderRadius: "2.2rem"
                })
                setCircleSecond( {
                    flex: "1",
                    backgroundColor: "#ddd",
                    borderRadius: "50%",
                })
                setCircleThird( {
                    flex: "1",
                    backgroundColor: "#ddd",
                    borderRadius: "50%",
                })
            }
        }
        else if (styleScreen === "mobile")
        {
            sum.current += 33.33334;
            if(sum.current > 0)
            {
                sum.current = 0;
            }
            if(Math.round(sum.current / -33.33334) != 0 && Math.round(sum.current / -33.33334) <= activeNextBack.current / 2)
            {
                setCircleFirst( {
                    flex: "1",
                    backgroundColor: "#ddd",
                    borderRadius: "50%",
                })
                setCircleSecond( {
                    flex: "2",
                    backgroundColor: "#fed700",
                    borderRadius: "2.2rem"
                })
                setCircleThird( {
                    flex: "1",
                    backgroundColor: "#ddd",
                    borderRadius: "50%",
                })
            }
            else if(Math.round(sum.current / -33.33334) == 0){
                setCircleFirst( {
                    flex: "2",
                    backgroundColor: "#fed700",
                    borderRadius: "2.2rem"
                })
                setCircleSecond( {
                    flex: "1",
                    backgroundColor: "#ddd",
                    borderRadius: "50%",
                })
                setCircleThird( {
                    flex: "1",
                    backgroundColor: "#ddd",
                    borderRadius: "50%",
                })
            }
        }
        else if (styleScreen === "tablet")
        {
            sum.current += 25;
            if(sum.current > 0)
            {
                sum.current = 0;
            }
            if(Math.round(sum.current / -25) !== 0 && Math.round(sum.current / -25) <= activeNextBack.current / 2)
            {
                setCircleFirst( {
                    flex: "1",
                    backgroundColor: "#ddd",
                    borderRadius: "50%",
                })
                setCircleSecond( {
                    flex: "2",
                    backgroundColor: "#fed700",
                    borderRadius: "2.2rem"
                })
                setCircleThird( {
                    flex: "1",
                    backgroundColor: "#ddd",
                    borderRadius: "50%",
                })
            }
            else if(Math.round(sum.current / -25) === 0){
                setCircleFirst( {
                    flex: "2",
                    backgroundColor: "#fed700",
                    borderRadius: "2.2rem"
                })
                setCircleSecond( {
                    flex: "1",
                    backgroundColor: "#ddd",
                    borderRadius: "50%",
                })
                setCircleThird( {
                    flex: "1",
                    backgroundColor: "#ddd",
                    borderRadius: "50%",
                })
            }
        }
        else
        {
            sum.current += 20;
            if(sum.current > 0)
            {
                sum.current = 0;
            }
            if(Math.round(sum.current / -20) !== 0 && Math.round(sum.current / -20) <= activeNextBack.current / 2)
            {
                setCircleFirst( {
                    flex: "1",
                    backgroundColor: "#ddd",
                    borderRadius: "50%",
                })
                setCircleSecond( {
                    flex: "2",
                    backgroundColor: "#fed700",
                    borderRadius: "2.2rem"
                })
                setCircleThird( {
                    flex: "1",
                    backgroundColor: "#ddd",
                    borderRadius: "50%",
                })
            }
            else if(Math.round(sum.current / -20) === 0){
                setCircleFirst( {
                    flex: "2",
                    backgroundColor: "#fed700",
                    borderRadius: "2.2rem"
                })
                setCircleSecond( {
                    flex: "1",
                    backgroundColor: "#ddd",
                    borderRadius: "50%",
                })
                setCircleThird( {
                    flex: "1",
                    backgroundColor: "#ddd",
                    borderRadius: "50%",
                })
            }
        }
        setProductDetails( { 
            transform: `translateX(${sum.current}%) translateX(0px)`
        })
    }

    const handleOnClickNextItem = () => {
        if(styleScreen === "maxMobileSmall")
        {
            activeNextBack.current =  cartUl.childElementCount - 1;
            sum.current -= 100;
            if(Math.round(sum.current / -100) === activeNextBack.current + 1)
            {
                sum.current = sum.current += 100;
            }

            if(Math.round(sum.current / -100) !== 0 && Math.round(sum.current / -100) <= activeNextBack.current / 2)
            {
                setCircleFirst( {
                    flex: "1",
                    backgroundColor: "#ddd",
                    borderRadius: "50%",
                })
                setCircleSecond( {
                    flex: "2",
                    backgroundColor: "#fed700",
                    borderRadius: "2.2rem"
                })
                setCircleThird( {
                    flex: "1",
                    backgroundColor: "#ddd",
                    borderRadius: "50%",
                })
            }
            else
            {
                setCircleFirst( {
                    flex: "1",
                    backgroundColor: "#ddd",
                    borderRadius: "50%"
                })
                setCircleSecond( {
                    flex: "1",
                    backgroundColor: "#ddd",
                    borderRadius: "50%",
                })
                setCircleThird( {
                    flex: "2",
                    backgroundColor: "#fed700",
                    borderRadius: "2.2rem"
                })
            }
        }
        else if(styleScreen === "mobileSmall")
        {
            activeNextBack.current =  cartUl.childElementCount - 2;
            sum.current -= 50;
            if(Math.round(sum.current / -50) === activeNextBack.current + 1)
            {
                sum.current = sum.current += 50;
            }
            if(Math.round(sum.current / -50) !== 0 && Math.round(sum.current / -50) <= activeNextBack.current / 2)
            {
                setCircleFirst( {
                    flex: "1",
                    backgroundColor: "#ddd",
                    borderRadius: "50%",
                })
                setCircleSecond( {
                    flex: "2",
                    backgroundColor: "#fed700",
                    borderRadius: "2.2rem"
                })
                setCircleThird( {
                    flex: "1",
                    backgroundColor: "#ddd",
                    borderRadius: "50%",
                })
            }
            else
            {
                setCircleFirst( {
                    flex: "1",
                    backgroundColor: "#ddd",
                    borderRadius: "50%"
                })
                setCircleSecond( {
                    flex: "1",
                    backgroundColor: "#ddd",
                    borderRadius: "50%",
                })
                setCircleThird( {
                    flex: "2",
                    backgroundColor: "#fed700",
                    borderRadius: "2.2rem"
                })
            }
        }
        else if (styleScreen === "mobile")
        {
            activeNextBack.current =  cartUl.childElementCount - 3;
            sum.current -= 33.33334;
            if(Math.round(sum.current / -33.33334) === activeNextBack.current + 1)
            {
                sum.current = sum.current += 33.33334;
            }
            if(Math.round(sum.current / -33.33334) !== 0 && Math.round(sum.current / -33.33334) <= activeNextBack.current / 2)
            {
                setCircleFirst( {
                    flex: "1",
                    backgroundColor: "#ddd",
                    borderRadius: "50%",
                })
                setCircleSecond( {
                    flex: "2",
                    backgroundColor: "#fed700",
                    borderRadius: "2.2rem"
                })
                setCircleThird( {
                    flex: "1",
                    backgroundColor: "#ddd",
                    borderRadius: "50%",
                })
            }
            else
            {
                setCircleFirst( {
                    flex: "1",
                    backgroundColor: "#ddd",
                    borderRadius: "50%"
                })
                setCircleSecond( {
                    flex: "1",
                    backgroundColor: "#ddd",
                    borderRadius: "50%",
                })
                setCircleThird( {
                    flex: "2",
                    backgroundColor: "#fed700",
                    borderRadius: "2.2rem"
                })
            }
        }
        else if (styleScreen === "tablet")
        {
            activeNextBack.current =  cartUl.childElementCount - 4;
            sum.current -= 25;
            if(Math.round(sum.current / -25) === activeNextBack.current + 1)
            {
                sum.current = sum.current += 25;
            }
            if(Math.round(sum.current / -25) !== 0 && Math.round(sum.current / -25) <= activeNextBack.current / 2)
            {
                setCircleFirst( {
                    flex: "1",
                    backgroundColor: "#ddd",
                    borderRadius: "50%",
                })
                setCircleSecond( {
                    flex: "2",
                    backgroundColor: "#fed700",
                    borderRadius: "2.2rem"
                })
                setCircleThird( {
                    flex: "1",
                    backgroundColor: "#ddd",
                    borderRadius: "50%",
                })
            }
            else
            {
                setCircleFirst( {
                    flex: "1",
                    backgroundColor: "#ddd",
                    borderRadius: "50%"
                })
                setCircleSecond( {
                    flex: "1",
                    backgroundColor: "#ddd",
                    borderRadius: "50%",
                })
                setCircleThird( {
                    flex: "2",
                    backgroundColor: "#fed700",
                    borderRadius: "2.2rem"
                })
            }
        }
        else
        {
            activeNextBack.current =  cartUl.childElementCount - 5;
            sum.current -= 20;
            if(Math.round(sum.current / -20) === activeNextBack.current + 1)
            {
                sum.current = sum.current += 20;
            }
            if(Math.round(sum.current / -20) !== 0 && Math.round(sum.current / -20) <= activeNextBack.current / 2)
            {
                setCircleFirst( {
                    flex: "1",
                    backgroundColor: "#ddd",
                    borderRadius: "50%",
                })
                setCircleSecond( {
                    flex: "2",
                    backgroundColor: "#fed700",
                    borderRadius: "2.2rem"
                })
                setCircleThird( {
                    flex: "1",
                    backgroundColor: "#ddd",
                    borderRadius: "50%",
                })
            }
            else
            {
                setCircleFirst( {
                    flex: "1",
                    backgroundColor: "#ddd",
                    borderRadius: "50%"
                })
                setCircleSecond( {
                    flex: "1",
                    backgroundColor: "#ddd",
                    borderRadius: "50%",
                })
                setCircleThird( {
                    flex: "2",
                    backgroundColor: "#fed700",
                    borderRadius: "2.2rem"
                })
            }
        }
        setProductDetails({ 
            transform: `translateX(${sum.current}%) translateX(0px)`
        })
    }  
    const handleOnChangeSort = (e) => {
        dispatch(getTypeSort(e.target.value))
    }

    const handleOnChangeQuality = (e) => {
        dispatch(getQuality(e.target.value))
    }  

    useEffect(() => {
        let array = [];
        let length = 0;
        if(typeHome) {
            if(searchProducts.list?.length !== 0)
                length = Math.ceil(searchProducts.list.length / quality);
        }
        else {
            if(products.list?.length !== 0)
                length = Math.ceil(products.list.length / quality);
                
        }
        if(length !== 0)
        {
            for(let i = 1; i <= length; i++)
            {
                array.push(i);
            }
            setListNumberPage(array);
        }
    }, [products, searchProducts])

    const handleOnClickNumberPage = (e) => {
        setNumberPage(Number(e.target.getAttribute("value")) + 1);
        dispatch(getNumberPage(e.target.getAttribute("value")));
    }

    const handleOnClickIncreaseNumberPage = () => {
        listNumberPage.length >= numberPage + 1 && setNumberPage(numberPage + 1) && dispatch(getNumberPage(numberPage));
    }

    const styleNumberPage = {
        backgroundColor: "#fed700"
    }

    const handleOnKeyPressSubmitNumberPage = (e) => {
        if(e.key === "Enter")
        {
            setNumberPage(Number(e.target.value))
            dispatch(getNumberPage(Number(e.target.value) - 1))
        }
    }
    return ( 
        <div className={cx("home", "grid__column-10", "grid__column-12")}>
            {typeHome === null && (
                <div className={cx("home__child")}>
                    <div className={cx("home__child__rcm")}>
                        <div className={cx("home__child__rcm__content")}>Recommended Products</div>
                        <div className={cx("home__child__rcm__icon")}>
                            <FontAwesomeIcon icon={faAngleLeft} className={cx("home__child__rcm__icon--left")} onClick={handleOnClickBackItem}/>
                            <FontAwesomeIcon icon={faAngleRight} className={cx("home__child__rcm__icon--right")} onClick={handleOnClickNextItem}/>
                        </div>
                    </div>
                    <div className={cx("home__child__product--wrapper")}>
                        <ul style={productDetails} className={cx("home__child__product", "home__child__product--handle", "grid__row--noWrap")}>
                        {listProducts && listProducts.map((product, index) => (
                            product.recommend === "true" && <HomeShop key={index} product={product} reloadCart={reloadCart} setReloadCart={setReloadCart}/>
                        ))}
                        </ul>
                    </div>
                    <div className={cx("home__child__page")}>
                        <div style={circleFirst} className={cx("home__child__page__child", "home__child__page__first")}></div>
                        <div style={circleSecond} className={cx("home__child__page__child", "home__child__page__second")}></div>
                        <div style={circleThird} className={cx("home__child__page__child", "home__child__page__third")}></div>
                    </div>
                </div>
            )}
            <div className={cx("home__shop")}>
                <div className={cx("home__shop__name")}>
                    <div className={cx("home__shop__name--left")}>
                        Shop
                    </div>
                    <div className={cx("home__shop__name--right")}>
                        Showing {(numberPage - 1) * quality + 1 }–{typeHome === null ? (numberPage - 1) * quality + products.listProduct?.length : (numberPage - 1) * quality + searchProducts.listProduct?.length} of {typeHome === null ? products.list?.length : searchProducts.list?.length} results
                    </div>
                </div>
                <div className={cx("home__shop__selec")}>
                    <div className={cx("home__shop__selec__icon")} onClick={handleOnClickFilterOnTabletOrMobile}>
                        {pcWidth ? (
                            <Fragment>
                                <FontAwesomeIcon icon={faBars} className={cx("home__shop__selec__icon__child")} />
                                <FontAwesomeIcon icon={faList} className={cx("home__shop__selec__icon__child")} />
                            </Fragment>
                        ) : ""}
                        {!pcWidth ? (
                            <Fragment>
                                <FontAwesomeIcon icon={faFilter} className={cx("home__shop__selec__icon__child")} />
                                <span className={cx("home__shop__selec__icon__filter")}>
                                    Filters
                                </span>
                            </Fragment>
                        ) : ""}
                    </div>
                    <div className={cx("home__shop__selec__list")}>
                        <form className={cx("home__shop__selec__list__sort")}>
                            <select name="orderby" className={cx("home__shop__selec__list__sort__selec")} aria-label="Shop order" fdprocessedid="rwrbl" onChange={handleOnChangeSort}>
                                <option className={cx("home__shop__selec__list__sort__selec--child")} value="menu_order" defaultValue>Default sorting</option>
                                <option className={cx("home__shop__selec__list__sort__selec")} value="date">Sort by latest</option>
                                <option className={cx("home__shop__selec__list__sort__selec")} value="price">Sort by price: low to high</option>
                                <option className={cx("home__shop__selec__list__sort__selec")} value="price-desc">Sort by price: high to low</option>
                            </select>
                        </form>
                        <div className={cx("home__shop__selec__list__show")}>
                            <select name="ppp" className={cx("home__shop__selec__list__show__selec")} fdprocessedid="fu23c" onChange={handleOnChangeQuality}>
                                <option className={cx("home__shop__selec__list__show__selec--child")} value="20">Show 20</option>
                                <option className={cx("home__shop__selec__list__show__selec--child")} value="40">Show 40</option>
                                <option className={cx("home__shop__selec__list__show__selec--child")} value="-1">Show All</option>
                            </select>
                        </div>
                    </div>
                    <div className={cx("home__shop__selec__page")}>
                        <input type="text" name="" id=""  value={numberPage} className={cx("home__shop__selec__page--input")} onChange={handleOnChangeNumberPage} onKeyPress={handleOnKeyPressSubmitNumberPage}/>
                        <span className={cx("home__shop__selec__page--content")}>of {listNumberPage.length}</span>
                        <FontAwesomeIcon icon={faArrowRight} onClick={handleOnClickIncreaseNumberPage}/>
                    </div>
                </div>
                <ul className={cx("home__shop__product", "grid__row")}>
                    {typeHome === null ? (
                        products.listProduct?.map((product, index) => (
                            <HomeShop key={index} product={product} reloadCart={reloadCart} setReloadCart={setReloadCart}/>
                        ))
                    ) : (
                        searchProducts.listProduct?.map((product, index) => (
                            <HomeShop key={index} product={product} reloadCart={reloadCart} setReloadCart={setReloadCart}/>
                        ))
                    )}
                </ul>
                <div className={cx("home__shop__page")}>
                    <div className={cx("home__shop__page--left")}>
                    Showing {(numberPage - 1) * quality + 1 }–{typeHome === null ? (numberPage - 1) * quality + products.listProduct?.length : (numberPage - 1) * quality + searchProducts.listProduct?.length} of {typeHome === null ? products.list?.length : searchProducts.list?.length} results
                    </div>
                    <div className={cx("home__shop__page--right")}>
                        {listNumberPage.map((x, index) => (
                            x === numberPage ? (<div key={index} style={styleNumberPage} className={cx("home__shop__page--right--round")} value={index} onClick={handleOnClickNumberPage}>{x}</div> ) : (<div key={index} className={cx("home__shop__page--right--round")} value={index} onClick={handleOnClickNumberPage}>{x}</div> )
                        ))}
                    </div>
                </div>
            </div>
        </div>
     );
}

export default Home;