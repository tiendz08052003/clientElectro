import classNames from "classnames/bind";
import styles from "./CompareChild.module.scss";

import { faCaretDown, faCaretUp, faSpinner, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "~/Components/Image/Image";
import { imgs } from "~/assest/imgs";
import { Fragment, memo, useEffect,  useState } from "react";
import * as ProductServices from '~/services/ProductServices';
import * as CompareServices from '~/services/CompareServices';
import ToastInformation from "~/Components/ToastInfomation/ToastInformation";

const cx = classNames.bind(styles);

function CompareChild({compareChild, setReload, reload}) {
    const [listResultCart, setListResultCart] = useState({});
    const [loading, setLoading] = useState(true);
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const [bool, setBool] = useState(false);

    
    useEffect(() => {
        const fetchAPI = async () => {
            setLoading(true);
            const res = await ProductServices.shop();
            res.map((data) => {
                if(compareChild.idProduct === data._id)
                {
                    setListResultCart(data);
                    setLoading(false);
                }
            })
        }
        fetchAPI();
    }, [])


    const handleOnClickDeleteCart = (e) => {
        setBool(false);
        const id = e.target.closest(".compareChild__column1__exit--icon--handle").getAttribute("data-id");
        const fetchAPI = async () => {
            const res = await CompareServices.deleteCompare(id);
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
        <tr className={cx("compareChild")}>
            {loading ? (
                <td className={cx("header__middle__child__search__child__icon")} colSpan="6">
                    <FontAwesomeIcon icon={faSpinner} className={cx("header__middle__child__search__child__icon__child")}/>
                </td>
            ) : (
                <Fragment>
                    <td className={cx("compareChild__column1", "compareChild__column")}>
                        <div className={cx("compareChild__column1__exit")}>
                            <FontAwesomeIcon icon={faXmark} className={cx("compareChild__column1__exit--icon", "compareChild__column1__exit--icon--handle")} onClick={handleOnClickDeleteCart} data-id={compareChild._id}/>
                        </div>
                    </td>
                    <td className={cx("compareChild__column2", "compareChild__column")}> 
                        <Image alt = "ảnh sản phẩm" src={imgs.anhSound} className={cx("compareChild__column2__img")} />
                    </td>
                    <td className={cx("compareChild__column3", "compareChild__column")}>
                        <div className={cx("compareChild__column__content")}>
                            {listResultCart.name}
                        </div>
                    </td>
                    <td className={cx("compareChild__column4", "compareChild__column")}>
                        <div className={cx("compareChild__column__content")}>
                            {listResultCart.price}
                        </div>
                    </td>
                    <td className={cx("compareChild__column5", "compareChild__column")}>
                        <div className={cx("compareChild__column__content")}>
                            {listResultCart.discount ? listResultCart.discount : 0}
                        </div>
                    </td>
                </Fragment>
            )}
            {bool && <ToastInformation content={content} title={title} bool={bool} setBool={setBool}/>}
        </tr>
    )
}

export default memo(CompareChild);