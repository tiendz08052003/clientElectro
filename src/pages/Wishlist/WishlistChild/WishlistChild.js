import classNames from "classnames/bind";
import styles from "./WishlistChild.module.scss";

import { faCaretDown, faCaretUp, faSpinner, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "~/Components/Image/Image";
import { imgs } from "~/assest/imgs";
import { Fragment, memo, useEffect, useState } from "react";
import * as ProductServices from '~/services/ProductServices';
import * as WishlistServices from '~/services/WishlistServices';
import { useSelector, useDispatch } from "react-redux";
import { getUser } from "~/redux/selector";
import {CreateAxios} from "~/Components/CreateInstance/CreateInstance";
import { loginAccount } from "~/pages/Account/accountSlice";
import ToastInformation from "~/Components/ToastInfomation/ToastInformation";

const cx = classNames.bind(styles);

function WishlistChild({resultWishlist, setReload, reload}) {
    const [listResultCart, setListResultCart] = useState({});
    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const [bool, setBool] = useState(false);

    const user = useSelector(getUser);
    const dispatch = useDispatch();

    const axiosJWT = CreateAxios(user, dispatch, loginAccount)

    useEffect(() => {
        const fetchAPI = async () => {
            setLoading(true);
            const res = await ProductServices.shop();
            res.map((data) => {
                if(resultWishlist.idProduct === data._id)
                {
                    setListResultCart(data);
                    setLoading(false);
                }
            })
        }
        fetchAPI();
    }, [])


    const handleOnClickDeleteWishlist = (e) => {
        setBool(false);
        const id = e.target.closest(".wishlistChild__column1__exit--icon--handle").getAttribute("data-id");
        const fetchAPI = async () => {
            const res = await WishlistServices.deleteWishlist(id, user?.accessToken, axiosJWT);
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
        <tr className={cx("wishlistChild")}>
            {loading ? (
                <td className={cx("header__middle__child__search__child__icon")} colSpan="6">
                    <FontAwesomeIcon icon={faSpinner} className={cx("header__middle__child__search__child__icon__child")}/>
                </td>
            ) : (
                <Fragment>
                    <td className={cx("wishlistChild__column1", "wishlistChild__column")}>
                        <div className={cx("wishlistChild__column1__exit")}>
                            <FontAwesomeIcon icon={faXmark} className={cx("wishlistChild__column1__exit--icon", "wishlistChild__column1__exit--icon--handle")} onClick={handleOnClickDeleteWishlist} data-id={resultWishlist._id}/>
                        </div>
                    </td>
                    <td className={cx("wishlistChild__column2", "wishlistChild__column")}> 
                        <Image alt = "ảnh sản phẩm" src={imgs.anhSound} className={cx("wishlistChild__column2__img")} />
                    </td>
                    <td className={cx("wishlistChild__column3", "wishlistChild__column")}>
                        <div className={cx("wishlistChild__column__content")}>
                            {listResultCart.name}
                        </div>
                    </td>
                    <td className={cx("wishlistChild__column4", "wishlistChild__column")}>
                        <div className={cx("wishlistChild__column__content")}>
                            {listResultCart.price}
                        </div>
                    </td>
                    <td className={cx("wishlistChild__column5", "wishlistChild__column")}>
                        <div className={cx("wishlistChild__column__content")}>
                            {listResultCart.discount ? listResultCart.discount : 0}
                        </div>
                    </td>
                </Fragment>
            )}
            {bool && <ToastInformation content={content} title={title} bool={bool} setBool={setBool}/>}
        </tr>
    )
}

export default memo(WishlistChild);