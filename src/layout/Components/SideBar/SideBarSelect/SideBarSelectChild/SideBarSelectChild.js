import style from './SideBarSelectChild.module.scss';
import classNames from 'classnames/bind';
import { brandList, colorList } from '../../sideBarSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { sideBarBrandList, sideBarColorList } from '~/redux/selector';

const cx = classNames.bind(style);

function SideBarSelectChild({child, name}) {
    const [checked, testChecked] = useState(false)
    const dispatch = useDispatch();

    const brand = useSelector(sideBarBrandList);
    const color = useSelector(sideBarColorList);

    const handleOnClickCheckbox = (e) => {
        switch(name)
        {
            case "Brand":
            {
                dispatch(brandList({
                    type: "custom",
                    name: e.target.value
                })) 
                break;
            }
            case "Color":
            {
                dispatch(colorList(
                {
                    type: "custom",
                    name: e.target.value
                })); 
                break;
            }
            default: 
        }
    }

    const handleOnchangeCheckbox = () =>{
        
    }

    return ( 
        <li className={cx("sideBarSelectChild")}> 
            <input type="checkbox" checked={brand.includes(child.name) || color.includes(child.name)} value={child.name} className={cx("sideBarSelectChild__input")} onClick={handleOnClickCheckbox} onChange={handleOnchangeCheckbox}/>
            {child.name}
            <span></span>
        </li>
     );
}

export default SideBarSelectChild;