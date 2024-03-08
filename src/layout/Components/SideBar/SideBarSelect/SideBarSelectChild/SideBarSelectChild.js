import style from './SideBarSelectChild.module.scss';
import classNames from 'classnames/bind';
import { listBrand, listColor } from '../../sideBarSlice';
import { useDispatch, useSelector } from 'react-redux';
import { sideBarBrandList, sideBarColorList } from '~/redux/selector';

const cx = classNames.bind(style);

function SideBarSelectChild({child, name}) {
    const dispatch = useDispatch();

    const brand = useSelector(sideBarBrandList);
    const color = useSelector(sideBarColorList);

    const handleOnClickCheckbox = (e) => {
        switch(name)
        {
            case "Brand":
            {
                dispatch(listBrand({
                    type: "custom",
                    name: e.target.value
                })) 
                break;
            }
            case "Color":
            {
                dispatch(listColor(
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