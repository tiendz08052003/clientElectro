import classNames from "classnames/bind";
import styles from "./Chat.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronCircleDown, faMagnifyingGlass, faMessage, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import { IconCart, IconCollapseRightChat, IconCollapseLeftChat, IconFace, IconHideChat, IconImage, IconPrint, IconVideo } from "~/Components/Icons";
import Image from "~/Components/Image";
import { getUser } from "~/redux/selector";
import { useSelector } from "react-redux";
import { socket } from "~/socket";

import * as AuthServices from '~/services/AuthServices'; 
import * as ChatServices from "~/services/ChatServices";
import ChatGuest from "./ChatGuest";
import Loading from "~/Components/Loading";

const cx = classNames.bind(styles);

function Chat() {
    const [view, setView] = useState(false);
    const [styleFil, setStyleFil] = useState(false);
    const [idRoom, setIdRoom] = useState("");
    const [idUserChat, setIdUserChat] = useState("");
    const [boolChatting, setBoolChatting] = useState(false);
    const [listUser, setListUser] = useState([]);
    const [users, setUsers] = useState([]);
    const [nameUser, setNameUser] = useState("");
    const [styleSend, setStyleSend] = useState(false);
    const [messageInput, setMessageInput] = useState("");
    const [messageSummary, setMessageSummary] = useState("");
    const [fresh, setFresh] = useState(false);
    const [listMessageChat, setListMessageChat] = useState([]);
    const [showSidebar, setShowSidebar] = useState(1);
    const [valueInput, setValueInput] = useState("");
    const [collapse, setCollapse] = useState(true);
    const ref = useRef(null);
    const refMainMessage = useRef(null);
    socket.connect();

    const User = useSelector(getUser);

    const handleClickButtonChat = () => {
        setView(!view);
        setFresh(true)
        if(!fresh)
        {
            setBoolChatting(true);
            const fetchAPI = async () => {
                const res = await ChatServices.getChat();
                socket.emit('client-to-sever', {res, User});
            }   
            fetchAPI();
        } 
    }

    const handleClickButtonCloseChat = () => {
        setView(!view);
        setFresh(false)
        if(nameUser === "")
        {
            socket.emit("client-send-sever-disconnect")
        }
    }

    useEffect(() => {
        const fetchAPI = async () => {
            const results = await AuthServices.getAuth();
            setUsers(results);
        }
        fetchAPI();
    }, [])

    const styleChat = {
        width: view ? "auto" : "100px",
        height: view ? "auto" : "48px",
    }

    const styleFilter = {
        display: styleFil ? "none" : "block",
    }

    const handleFocusInput = () => {
        setStyleFil(true);
    }

    const handleBlurInput = () => {
        setStyleFil(false);
    }

    const handleClickChatClient = () => {
        socket.emit("client-to-sever-joinRoom", idRoom);
        setIdUserChat(idRoom[0]);
        setBoolChatting(true);
        setMessageSummary("");
    }

    useEffect(() => {
        socket.on("sever-send-client-reply", (obj) => {
            console.log("Có người kết nối vào phòng: ", obj.id)
            const fetchAPI = async () => {
                const res = await ChatServices.getChat()
                const user = res.filter(x => x.idAuth === User._id)[0]
                await ChatServices.updateChat(user._id, {
                    idPhong: obj.idPhong,
                    idKhachChat: user.admin ? obj.idPhong : obj.idAdmin,
                    queue: obj.admin ? true : false,
                })
                const results = await AuthServices.getAuth();
                results.map(ur => {
                    if((User.admin &&  obj.idPhong === ur._id) || (!User.admin && obj.idAdmin === ur._id))
                    {
                        setNameUser(ur.userName)
                    }
                })
            }
            fetchAPI();
        })

        socket.on("sever-send-client-dsUserName", (array) => {
            setListUser(array)
        })

        socket.on("sever-send-client-reload", (array) => {
            console.log("Có người đăng xuất khỏi phòng")
            setListUser(array)
        })

        socket.on("sever-send-client-message", (data) => {
            setMessageSummary(data.messageInput)
            const x = refMainMessage.current;
            if(data.User._id === User._id)
                x.innerHTML += `<div class="Chat_chat__main__bottom__content__main__div__WrdLi" style="justify-content: right;"><span class="Chat_chat__main__bottom__content__main__div__content__ds1OG" style="background-color: rgb(0, 132, 255);">${data.messageInput}</span></div>`
            else
                x.innerHTML += `<div class="Chat_chat__main__bottom__content__main__div__WrdLi"><span class="Chat_chat__main__bottom__content__main__div__content__ds1OG">${data.messageInput}</span></div>`
        })

        socket.on("sever-send-client-finishChat", () => {
            const fetchAPI = async () => {
                const res = await ChatServices.getChat()
                const user = res.filter(x => x.idAuth === User._id)[0]
                if(User.admin)
                    socket.emit("sever-send-client-setIdPhong")
                await ChatServices.updateChat(user._id, {
                    idPhong: User._id,
                    idKhachChat: "",
                    message: [],
                    queue: User.admin? false : true,
                })
            }
            fetchAPI();
            setNameUser("")
            setIdUserChat("")
            const x = refMainMessage.current;
            if(x)
            {
                x.innerHTML = "";
            }
            console.log("Đã kết thúc cuộc trò chuyện!")
        })

        socket.on("sever-send-client-ConnectSuccess", (id) => {
            console.log("Chưa kết nối: ", id)
        })

        socket.on("sever-send-client-Connected", (id) => {
            console.log("Đã kết nối: ", id)
        })

        socket.on("sever-send-client-loadAgain", () => {
            if(nameUser === "")
            {
                const fetchAPI = async () => {
                    const res = await ChatServices.getChat()                 
                    const user = res.filter(x => x.idAuth === User._id)[0]
                    const results = await AuthServices.getAuth();
                    const guest = results.filter(x => x._id === user.idKhachChat)[0]
                    setNameUser(guest.userName)
                    setIdUserChat(user.idKhachChat)
                    setListMessageChat(user.message)
                }
                fetchAPI();
            }
        })

        socket.on("sever-send-client-disConnect", () => {
            setNameUser("")
            setIdUserChat("")
            setListMessageChat([])
        })

        return () => {
          socket.off("sever-send-client-reply");
          socket.off("sever-send-client-dsUserName");
          socket.off("sever-send-client-ConnectSuccess");
          socket.off("sever-send-client-Connected");
          socket.off("sever-send-client-reload");
          socket.off("sever-send-client-finishChat");
          socket.off("sever-send-client-message");
          socket.off("sever-send-client-disConnect");
        };
    }, []);
    
    const handleOnInputText = (e) => {
        setMessageInput(e.target.value)
        if(e.target.value.length !== 0 && nameUser !== "")
            setStyleSend(true);
        else
            setStyleSend(false);
    }

    const handleOnClickSend = () => {
        socket.emit("client-to-sever-message", {messageInput, User})
        setMessageInput("");
        setStyleSend(false);
        ref.current.focus();
    }

    const handleOnClickChatting = () => {
        setBoolChatting(true)
        users.map((ur) => {
            if(idUserChat === ur._id){
                setNameUser(ur.userName)
            }
        })
    }

    const handleOnClickFinishChat = () => {
        socket.emit("client-to-sever-finnishChat", User.admin? idUserChat : User._id)
    }

    const handleClickOption = (e) => {
        setShowSidebar(e.target.value)
    }

    const handleInput = (e) => {
        setValueInput(e.target.value)
        setListUser(listUser.filter(x => {
            let k = users.filter(user => user._id === x)
            let h = k.map(x => x.userName)[0]
            let y = h.toLowerCase();
            let z = e.target.value.toLowerCase();
            if(y.includes(z))
            {
                return x;
            }
        }))
    }

    const handleClickCollapse = () => {
        setCollapse(!collapse)
    }

    return ( 
        <div className={cx("chat")} style={styleChat}>
            <div className={cx("chat__main")} style={{display: view ? "block": "none"}}>
                <div className={cx("chat__main__top")}>
                    <div className={cx("chat__main__top__title")}>
                        Chat •
                        {
                            collapse && (
                                <span className={cx("chat__main__top__title__name")}>
                                    {User && User.userName}
                                </span>
                            )
                        }
                    </div>
                    <div className={cx("chat__main__top__icon")}>
                        {
                            User.admin && (
                                collapse ? (
                                    <div className={cx("chat__main__top__icon__cut")} onClick={handleClickCollapse}>
                                        <IconCollapseRightChat className={cx("chat__main__top__icon__cut__details")}/>
                                    </div>
                                ) : (
                                    <div className={cx("chat__main__top__icon__cut")} onClick={handleClickCollapse}>
                                        <IconCollapseLeftChat className={cx("chat__main__top__icon__cut__details")}/>
                                    </div>
                                )
                            ) 
                        }
                        <div className={cx("chat__main__top__icon__hide")} onClick={handleClickButtonCloseChat}>
                            <IconHideChat className={cx("chat__main__top__icon__hide__details")} />
                        </div>
                    </div>
                </div>
                <div className={cx("chat__main__bottom")}>
                    {User && User.admin && (
                        <div className={cx("chat__main__bottom__account")}>
                            <div className={cx("chat__main__bottom__account__search")}>
                                <div className={cx("chat__main__bottom__account__search__txtSearch")}>
                                    <FontAwesomeIcon icon={faMagnifyingGlass} className={cx("chat__main__bottom__account__search__txtSearch__icon")} />
                                    <input value={valueInput} type="text" className={cx("chat__main__bottom__account__search__txtSearch__input")} onFocus={handleFocusInput} onBlur={handleBlurInput} onInput={handleInput}/>
                                </div>
                                <div className={cx("chat__main__bottom__account__search__filter")} style={styleFilter}>
                                    <select className={cx("chat__main__bottom__account__search__filter__select")} onClick={handleClickOption}>
                                        <option value={1}>
                                            Tất cả
                                        </option>
                                        <option value={2}>
                                            Đang chat
                                        </option>
                                        <option value={3}>
                                            Khách hàng đợi
                                        </option>
                                    </select>
                                </div>
                            </div>
                            {idUserChat && (showSidebar == 1 || showSidebar == 2) && (
                                users.map((ur) => (
                                    idUserChat === ur._id && ur.admin === false && (
                                        <div className={cx("chat__main__bottom__account__details")} key={ur._id} onClick={handleOnClickChatting}>
                                            <div className={cx("chat__main__bottom__account__details__avatar")}>
                                                <Image src="https://cf.shopee.vn/file/792b99e3c472e88995b2e55d341f670e_tn" className={cx("chat__main__bottom__account__details__avatar__details")}/>
                                            </div>
                                            <div className={cx("chat__main__bottom__account__details__content")}>
                                                <div className={cx("chat__main__bottom__account__details__content__name")}>
                                                    {ur.userName}
                                                </div>
                                                <div className={cx("chat__main__bottom__account__details__content__summary")}>
                                                    {messageSummary}
                                                </div>
                                            </div>
                                        </div>      
                                    )
                                ))
                            )}
                            {
                                (showSidebar == 1 || showSidebar == 3) && (
                                    <div className={cx("chat__main__bottom__account__listQueue")}>
                                        <div className={cx("chat__main__bottom__account__listQueue__title")}>Khách hàng đang đợi: {listUser.length}</div>
                                        <ul className={cx("chat__main__bottom__account__listQueue__list")}>
                                            {
                                                listUser.map((id) => (
                                                    users.map((ur) => (
                                                        id === ur._id && ur.admin === false && (
                                                            <ChatGuest key={id} User={User} ur={ur} setNameUser={setNameUser} setBoolChatting={setBoolChatting} setIdRoom={setIdRoom}/>
                                                        )
                                                    ))
                                                ))
                                            }
                                        </ul>
                                    </div>
                                )
                            }
                        </div>
                    )}
                    {collapse && (
                        nameUser !== "" || User.admin === false ? (
                            <div className={cx("chat__main__bottom__content")}>
                                <div className={cx("chat__main__bottom__content__option")}>
                                    {nameUser === "" ? (
                                        <>
                                            <Loading />
                                            <span className={cx("chat__main__bottom__content__option__topic")}>
                                                Đang đợi nhân viên hỗ trợ
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <div className={cx("chat__main__bottom__content__option__name")}>
                                                {nameUser}
                                            </div>
                                            <FontAwesomeIcon icon={faChevronCircleDown}/>
                                            {boolChatting && (<div className={cx("chat__main__bottom__content__option__finish")} onClick={handleOnClickFinishChat}>Kết thúc</div>)}
                                        </>
                                    ) }
                                </div>
                                <div className={cx("chat__main__bottom__content__main")} >
                                    <div ref={refMainMessage} style={{display: boolChatting || User.admin === false ? "block" : "none"}}>
                                    {
                                        listMessageChat.length !== 0 && (
                                            listMessageChat.map((x, index) => (
                                                x.admin ? (
                                                    User.admin ? (
                                                        <div key={index} className={cx("chat__main__bottom__content__main__div")} style={{"justifyContent": "right"}}>
                                                            <span className={cx("chat__main__bottom__content__main__div__content")} style={{"backgroundColor": "rgb(0, 132, 255)"}}>{x.admin}</span>
                                                        </div>
                                                    ) : (
                                                        <div key={index} className={cx("chat__main__bottom__content__main__div")}>
                                                            <span className={cx("chat__main__bottom__content__main__div__content")}>{x.admin}</span>
                                                        </div>
                                                    )
                                                ) : (
                                                    !User.admin ? (
                                                        <div key={index} className={cx("chat__main__bottom__content__main__div")} style={{"justifyContent": "right"}}>
                                                            <span className={cx("chat__main__bottom__content__main__div__content")} style={{"backgroundColor": "rgb(0, 132, 255)"}}>{x.user}</span>
                                                        </div>
                                                    ) : (
                                                        <div key={index} className={cx("chat__main__bottom__content__main__div")}>
                                                            <span className={cx("chat__main__bottom__content__main__div__content")}>{x.user}</span>
                                                        </div>
                                                    )
                                                )
                                            ))
                                        ) 
                                    }
                                    </div>
                                </div>
                                {
                                    boolChatting === true  || User.admin === false ? (
                                        <div className={cx("chat__main__bottom__content__input")}>
                                            <div className={cx("chat__main__bottom__content__input__import")}>
                                                <textarea type="text" placeholder="Nhập nội dung tin nhắn" className={cx("chat__main__bottom__content__input__import__text")} ref={ref} value={messageInput} onInput={handleOnInputText}></textarea>
                                                {
                                                    styleSend && (
                                                        <div className={cx("chat__main__bottom__content__input__import__send")} onClick={handleOnClickSend}>
                                                            <FontAwesomeIcon icon={faPaperPlane} className={cx("chat__main__bottom__content__input__import__send__icon")}/>
                                                        </div>
                                                    )
                                                }
                                            </div>
                                            <div className={cx("chat__main__bottom__content__input__option")}>
                                                <IconFace className={cx("chat__main__bottom__content__input__option__icon", "chat__main__bottom__content__input__option__iconFace")}/>
                                                <IconImage className={cx("chat__main__bottom__content__input__option__icon", "chat__main__bottom__content__input__option__iconImage")}/>
                                                <IconVideo className={cx("chat__main__bottom__content__input__option__icon", "chat__main__bottom__content__input__option__iconVideo")}/>
                                                <IconCart className={cx("chat__main__bottom__content__input__option__icon", "chat__main__bottom__content__input__option__iconCart")}/>
                                                <IconPrint className={cx("chat__main__bottom__content__input__option__icon", "chat__main__bottom__content__input__option__iconPrint")}/>
                                            </div>
                                        </div>

                                    ) : (
                                        <div className={cx("chat__main__bottom__content__button")}>
                                            <button className={cx("chat__main__bottom__content__button__details")} onClick={handleClickChatClient}>
                                                Tư vấn khách hàng
                                            </button>
                                        </div>
                                    ) 
                                }
                            </div>
                        ) : (
                            <div className={cx("chat__main__bottom__content")}>
                                <div className={cx("chat__main__bottom__content__empty")}>
                                    Chưa có đoạn chat nào
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>
            <div className={cx("chat__button")} onClick={handleClickButtonChat} style={{display: view === false ? "flex" : "none"}}>
                <div className={cx("chat__button__icon")}>
                    <FontAwesomeIcon icon={faMessage} />
                </div>
                <div className={cx("chat__button__content")}>
                    Chat
                </div>
            </div>
        </div> 
    );
}

export default Chat;