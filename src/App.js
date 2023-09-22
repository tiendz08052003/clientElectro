import DefaultLayout from "./layout/DefaultLayout";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { publicRoute } from "./Routes";
import { Fragment, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getProduct, getBrand, getColor, getType } from "./pages/Home/homeSlice";
import { getProductCatalog } from "./layout/Components/Header/HeaderFooter/headerFooterSlice";

function App() {
  const [pcWidth, setPcWidth] = useState(true);
  const [onSideBar, setOnSideBar] = useState(false);
  const [reloadCart, setReloadCart] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProduct())
  })

  useEffect(() => {
    dispatch(getBrand())
  })

  useEffect(() => {
    dispatch(getColor())
  })

  useEffect(() => {
    dispatch(getProductCatalog())
  })

  useEffect(() => {
    dispatch(getType())
  })

  useEffect(() => {
    if(window.innerWidth <= 1230)
    {
        setPcWidth(false)
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

  const handleOnClickFilterOnTabletOrMobile = () => {
    if(!pcWidth)
      setOnSideBar(!onSideBar);
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          {
            publicRoute.map((EleRoute, index) => {
              const Page = EleRoute.component;

              let Layout = DefaultLayout;

              if(EleRoute.layout === null)
              {
                Layout = Fragment;
              }
              else if (EleRoute.layout)
              {
                Layout = EleRoute.layout;
              }
              if((<Page />).type.name === "Home" || (<Page />).type.name === "o_")
              {
                return (
                  <Route 
                    key={index} 
                    path={EleRoute.path} 
                    element={
                      <Layout onSideBar={onSideBar} reloadCart={reloadCart} handleOnClickFilterOnTabletOrMobile={handleOnClickFilterOnTabletOrMobile}>
                        <Page handleOnClickFilterOnTabletOrMobile={handleOnClickFilterOnTabletOrMobile} reloadCart={reloadCart} setReloadCart={setReloadCart}/>
                      </Layout>
                    }
                  />  
                )
              }
              else
              {
                return (
                  <Route 
                    key={index} 
                    path={EleRoute.path} 
                    element={
                      <Layout>
                        <Page />
                      </Layout>
                    }
                  />  
                )
              }
            })
          }
        </Routes>
      </div>
    </Router>
  );
}

export default App;
