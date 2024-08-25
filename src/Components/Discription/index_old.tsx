// import { Data } from "../../App";
interface appProps {
    selectedMenu?: any;
    setType?:any;
}

export default function Discription({selectedMenu,setType}:appProps){
    return(
        <div style={{display:"flex",flexDirection:"row" , zIndex:"1", color:"white", position:"absolute",marginTop:"58vh",padding:"1rem 1.5rem", width:"100%", justifyContent:"space-between"}}>
                  <div>
                    {/* <div style={{display:"flex"}}><div style={{background:"black", height:"30px", width:"30px", borderRadius:"18px",marginRight:"5px"}}></div><b>{Data?.[selectedMenu]?.name}</b></div> */}
                    <div style={{marginTop:"0.6rem"}}>Discription</div>
                    {/* <div style={{marginTop:"0.5rem"}}><h6>${Data?.[selectedMenu]?.price}</h6></div> */}
                  </div>
                  <div>
                    <div onClick={()=>setType(2)}>
                      <svg width="35" height="35" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="17" width="20" height="4" rx="2" stroke="#fff" strokeWidth="2"></rect><rect x="2" y="10" width="20" height="4" rx="2" stroke="#fff" strokeWidth="2"></rect><rect x="2" y="3" width="20" height="4" rx="2" stroke="#fff" strokeWidth="2"></rect></svg>
                    </div>
                    <div style={{paddingTop:"5px"}}>
                      <svg width="35" height="35" fill="#00A99D" xmlns="http://www.w3.org/2000/svg"><path clipRule="evenodd" d="M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18Z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path><path d="M12 7v10M17 12H7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                    </div>
                    <div style={{paddingTop:"5px"}}>
                      <svg width="35" height="35" fill="none" xmlns="http://www.w3.org/2000/svg"><path clipRule="evenodd" d="M20.369 5.11C17.549 1.022 12 3.435 12 7.589 12 3.434 6.451 1.02 3.631 5.11.717 9.339 3.59 16.745 12.001 21c8.41-4.255 11.282-11.661 8.368-15.89Z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                    </div>
                  </div>
                </div>
    )
}