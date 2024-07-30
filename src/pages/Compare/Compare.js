import classNames from "classnames/bind";
import styles from "./Compare.module.scss";
import * as CompareServices from "~/services/CompareServices"
import { useState } from "react";
import { useEffect } from "react";
import CompareChild from "./CompareChild";
import ToastInformation from "~/Components/ToastInfomation/ToastInformation";
import { getProduct, getUser } from "~/redux/selector";
import { useSelector } from "react-redux";
import Image from "~/Components/Image";
import * as MainServices from "~/services/MainServices";

const cx = classNames.bind(styles);

function Compare() {
    const [compare, setCompare] = useState([]);
    const [reload, setReload] = useState(false);
    const [productOne, setProductOne] = useState(undefined);
    const [productTwo, setProductTwo] = useState(undefined);
    const [bool, setBool] = useState(false);
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const products = useSelector(getProduct);
    const user = useSelector(getUser);

    useEffect(() => {
        let listCompare = [];
        const fetchAPI = async () => {
            const res = await CompareServices.getCompare();
            const { id } = await MainServices.getIDHardware();
            if(user?.accessToken)
                listCompare = res.filter(x => x.idAccount === user._id)
            else
                listCompare = res.filter(x => x.idHardware === id)    
            setCompare(listCompare);

        }
        fetchAPI();
    }, [reload])

    const handleOnClickCheckBox = (e) => {
        let count = 0;
        let x = document.querySelectorAll(".compareChild__column__checkbox");
        if(e.target.checked)
        {
            x.forEach((y, index) => {
                if(y.checked)
                {
                    count++;
                }
            })
            if(count === 3)
            {
                e.target.checked = false;
                setContent("Error");
                setTitle("Bạn đã chọn đủ 2 checkbox!");
                setBool(true);
            }
            else if(count === 1)
            {
                let x = products.filter(product => product._id === compare[Number(e.target.getAttribute("index"))].idProduct);
                if(!productOne)
                    setProductOne(x[0]);
                else
                    setProductTwo(x[0]);
            }
            else
            {
                let x = products.filter(product => product._id === compare[Number(e.target.getAttribute("index"))].idProduct);
                if(!productTwo)
                    setProductTwo(x[0]);
                else
                    setProductOne(x[0]);
            }
        }
        else
        {
            if(productOne?._id === compare[Number(e.target.getAttribute("index"))].idProduct)
            {
                setProductOne(undefined);
            }
            else
            {
                setProductTwo(undefined);
            }
        }
    }
    return ( 
        <div className={cx("compare")}>
            <div className={cx("compare__topic")}>
                compare
            </div>
            <table className={cx("compare__table")}>
                <thead>
                    <tr className={cx("compare__tableRow1")}>
                        <th className={cx("compare__tableRow1__column1")}></th>
                        <th className={cx("compare__tableRow1__column2")}></th>
                        <th className={cx("compare__tableRow1__column3")}>Product</th>
                        <th className={cx("compare__tableRow1__column4")}>Price</th>
                        <th className={cx("compare__tableRow1__column5")}>Discount</th>
                        <th className={cx("compare__tableRow1__column5")}>Chọn</th>
                    </tr>
                </thead>
                <tbody>
                    {compare.length > 0 ? (
                        compare.map((compareChild, index) => (
                            <CompareChild key={compareChild._id} index={index} compareChild={compareChild} setReload={setReload} reload={reload} handleOnClickCheckBox={handleOnClickCheckBox}/> 
                        ))
                    ) : (
                        <tr>
                            <td className={cx("compare__table--noData")} colSpan={6}>
                                Không có dữ liệu
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            <table className={cx("compare__table")}>
                {compare.length > 0 && (productOne || productTwo) && (
                    <tbody className={cx("compare__table__body")}>
                        <tr>
                            <td>
                                {(productOne || productTwo) && "Name"}
                            </td>
                            <td>
                                {productOne?.name}
                            </td>
                            <td>
                                {productTwo?.name}
                            </td>
                        </tr>  
                        <tr>
                            <td>
                                {(productOne || productTwo) && "Image"}
                            </td>
                            <td>
                                <Image src={productOne?.image} className={cx("compare__table__body__image")}/>
                            </td>
                            <td>
                                <Image src={productTwo?.image} className={cx("compare__table__body__image")}/>
                            </td>
                        </tr> 
                        <tr>
                            <td>
                                {(productOne || productTwo) && "Production"}
                            </td>
                            <td>
                                <ul>
                                    {productOne?.introduce.map((intro, index) => (<li key={index}>{intro}</li>))} 
                                </ul>
                            </td>
                            <td>
                                <ul>
                                    {productTwo?.introduce.map((intro, index) => (<li key={index}>{intro}</li>))} 
                                </ul>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                {(productOne || productTwo) && "Price"}
                            </td>
                            <td>
                                {productOne?.price}
                            </td>
                            <td>
                                {productTwo?.price}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                {(productOne || productTwo) && "Discount"}
                            </td>
                            <td>
                                {productOne?.discount}
                            </td>
                            <td>
                                {productTwo?.discount}
                            </td>
                        </tr> 
                    </tbody>
                )}
            </table>
            {bool && <ToastInformation content={content} title={title} bool={bool} setBool={setBool}/>}
        </div>
     );
}

export default Compare;