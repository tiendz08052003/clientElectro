import classNames from "classnames/bind";
import styles from "./CartChild.module.scss";

import { faCaretDown, faCaretUp, faSpinner, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "~/Components/Image/Image";
import { imgs } from "~/assest/imgs";
import { Fragment, memo, useEffect,  useState } from "react";
import * as ProductServices from '~/services/ProductServices';
import * as CartServices from '~/services/CartServices';
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "~/redux/selector";
import { loginAccount } from "~/pages/Account/accountSlice";
import {CreateAxios} from "~/Components/CreateInstance/CreateInstance";
import ToastInformation from "~/Components/ToastInfomation/ToastInformation";

const cx = classNames.bind(styles);

function CartChild({resultCart, setReload, reload}) {
    const [listResultCart, setListResultCart] = useState({});
    const [quality, setQuality] = useState(1);
    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const [bool, setBool] = useState(false);

    const user = useSelector(getUser);
    const dispatch = useDispatch();
    
    let axiosJWT = CreateAxios(user, dispatch, loginAccount)

    const handleOnChangeValueQuality = (e) => {
        if(e.target.value > 0 || e.target.value === "")
        {
            setQuality(e.target.value);
            const id = e.target.getAttribute("data-id");
            const fetchAPI = async () => {
                await CartServices.updateCart(user?.accessToken, id, Number(e.target.value), axiosJWT); 
                setReload(!reload);
            }
            fetchAPI();
        }
    }

    const handleOnClickUpQuality = (e) => {
        setQuality(Number(quality) + 1);
        const id = e.target.closest(".cartChild__column6__input__upDown__iconUp--handle").getAttribute("data-id");
        const fetchAPI = async () => {
            await CartServices.updateCart(user?.accessToken, id, Number(quality) + 1, axiosJWT); 
            setReload(!reload);
        }
        fetchAPI();
    }

    const handleOnClickDownQuality = (e) => {
        if(quality !== 1)
        {
            setQuality(Number(quality) - 1);
            const id = e.target.closest(".cartChild__column6__input__upDown__iconDown--handle").getAttribute("data-id");
            const fetchAPI = async () => {
                await CartServices.updateCart(user?.accessToken, id, Number(quality) - 1, axiosJWT); 
                setReload(!reload);
            }
            fetchAPI();
        }
    }

    useEffect(() => {
        const fetchAPI = async () => {
            setLoading(true);
            const res = await ProductServices.shop();
            res.map((data) => {
                if(resultCart.idProduct === data._id)
                {
                    setListResultCart(data);
                    setQuality(resultCart.count)
                    setLoading(false);
                }
            })
        }
        fetchAPI();
    }, [])


    const handleOnClickDeleteCart = (e) => {
        setBool(false);
        const id = e.target.closest(".cartChild__column1__exit--icon--handle").getAttribute("data-id");
        const fetchAPI = async () => {
            const res = await CartServices.deleteCart(user?.accessToken, id, axiosJWT);
            if(res === "Success")
            {
                setContent("Success");
                setTitle("Sản phẩm xóa thành công!");
                setBool(true);
                setTimeout(() => {
                    setReload(!reload);
                }, 3000)
            }
            else 
            {
                setContent("Error");
                setTitle("Sản phẩm xóa thất bại!");
                setBool(true);
            }
        }
        fetchAPI();
    }
    
    return ( 
        <tr className={cx("cartChild")}>
            {loading ? (
                <td className={cx("header__middle__child__search__child__icon")} colSpan="6">
                    <FontAwesomeIcon icon={faSpinner} className={cx("header__middle__child__search__child__icon__child")}/>
                </td>
            ) : (
                <Fragment>
                    <td className={cx("cartChild__column1", "cartChild__column")}>
                        <div className={cx("cartChild__column1__exit")}>
                            <FontAwesomeIcon icon={faXmark} className={cx("cartChild__column1__exit--icon", "cartChild__column1__exit--icon--handle")} onClick={handleOnClickDeleteCart} data-id={resultCart._id}/>
                        </div>
                    </td>
                    <td className={cx("cartChild__column2", "cartChild__column")}> 
                        <Image alt = "ảnh sản phẩm" src={imgs.anhSound} className={cx("cartChild__column2__img")} />
                    </td>
                    <td className={cx("cartChild__column3", "cartChild__column")}>
                        <div className={cx("cartChild__column__content")}>
                            {listResultCart.name}
                        </div>
                    </td>
                    <td className={cx("cartChild__column4", "cartChild__column")}>
                        <div className={cx("cartChild__column__content")}>
                            {quality * listResultCart.price}
                        </div>
                    </td>
                    <td className={cx("cartChild__column5", "cartChild__column")}>
                        <div className={cx("cartChild__column__content")}>
                            {listResultCart.discount}
                        </div>
                    </td>
                    <td className={cx("cartChild__column6", "cartChild__column")}>
                        <div className={cx("cartChild__column6__input")}>
                            <input type="number" className={cx("cartChild__column6__input__child")} value={quality} onChange={handleOnChangeValueQuality} data-id={resultCart._id}/>
                            <div className={cx("cartChild__column6__input__upDown", "cartChild__column6__input__upDown--handle")}>
                                <FontAwesomeIcon icon={faCaretUp} className={cx("cartChild__column6__input__upDown__iconUp", "cartChild__column6__input__upDown__iconUp--handle")} onClick={handleOnClickUpQuality} type-icon="up"  data-id={resultCart._id}/>
                                <FontAwesomeIcon icon={faCaretDown} className={cx("cartChild__column6__input__upDown__iconDown", "cartChild__column6__input__upDown__iconDown--handle")} onClick={handleOnClickDownQuality} type-icon="down"  data-id={resultCart._id}/>
                            </div>
                        </div>
                    </td>
                    <td className={cx("cartChild__column7", "cartChild__column")}>
                        <div className={cx("cartChild__column__content")}>
                            {quality * listResultCart.price - listResultCart.discount}
                        </div>
                    </td>
                </Fragment>
            )}
            {bool && <ToastInformation content={content} title={title} bool={bool} setBool={setBool}/>}
        </tr>
    )
}

export default memo(CartChild);